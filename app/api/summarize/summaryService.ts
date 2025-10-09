// Summarization service with caching to avoid repeated API calls

import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import { 
  generateContextAwarePrompt, 
  formatSummaryResponse 
} from './promptEngineering';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Redis for caching
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Cache TTL in seconds (7 days default)
const CACHE_TTL = 7 * 24 * 60 * 60;

/**
 * Interface for summary request parameters
 */
interface SummaryRequest {
  content: string;
  contentType: 'paper' | 'code' | 'dataset' | 'article' | 'discussion' | 'auto';
  maxLength?: number;
  style?: 'concise' | 'detailed' | 'technical' | 'simplified';
  targetAudience?: 'general' | 'academic' | 'technical' | 'beginner';
  includeCitations?: boolean;
  sourceUrl?: string;
}

/**
 * Interface for summary response
 */
interface SummaryResponse {
  summary: string;
  fromCache: boolean;
  contentType: string;
  timestamp: number;
  sourceUrl?: string;
}

/**
 * Generate a unique cache key for a summary request
 * @param request The summary request parameters
 * @returns A unique cache key
 */
function generateCacheKey(request: SummaryRequest): string {
  // Create a normalized version of the request for consistent hashing
  const normalizedRequest = {
    content: request.content,
    contentType: request.contentType,
    maxLength: request.maxLength || 500,
    style: request.style || 'concise',
    targetAudience: request.targetAudience || 'general',
    includeCitations: request.includeCitations || false,
  };
  
  // Hash the content to keep the key length manageable
  const contentHash = Buffer.from(normalizedRequest.content)
    .toString('base64')
    .replace(/[+/=]/g, '')
    .substring(0, 40);
  
  return `summary:${contentHash}:${normalizedRequest.contentType}:${normalizedRequest.style}:${normalizedRequest.maxLength}`;
}

/**
 * Get a summary from cache or generate a new one
 * @param request The summary request parameters
 * @returns A promise resolving to the summary response
 */
export async function getSummary(request: SummaryRequest): Promise<SummaryResponse> {
  const cacheKey = generateCacheKey(request);
  
  try {
    // Try to get from cache first
    const cachedSummary = await redis.get<SummaryResponse>(cacheKey);
    
    if (cachedSummary) {
      console.log('Cache hit for summary:', cacheKey);
      return {
        ...cachedSummary,
        fromCache: true,
      };
    }
  } catch (error) {
    // If cache retrieval fails, log but continue to generate new summary
    console.error('Cache retrieval error:', error);
  }
  
  // Generate a new summary
  const summary = await generateSummary(request);
  
  // Cache the result
  try {
    await redis.set(cacheKey, {
      summary: summary.summary,
      contentType: request.contentType,
      timestamp: Date.now(),
      sourceUrl: request.sourceUrl,
      fromCache: false,
    }, { ex: CACHE_TTL });
  } catch (error) {
    // If caching fails, log but still return the generated summary
    console.error('Cache storage error:', error);
  }
  
  return summary;
}

/**
 * Generate a summary using the OpenAI API
 * @param request The summary request parameters
 * @returns A promise resolving to the summary response
 */
async function generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
  try {
    // Generate the context-aware prompt
    const prompt = generateContextAwarePrompt(request.content, request.contentType, {
      maxLength: request.maxLength,
      style: request.style,
      includeCitations: request.includeCitations,
      targetAudience: request.targetAudience,
    });
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a highly accurate summarization assistant that provides concise, accurate summaries while preserving key information.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more focused summaries
      max_tokens: 1000,
    });
    
    // Extract and format the summary
    const rawSummary = completion.choices[0]?.message.content || 'Failed to generate summary.';
    const formattedSummary = formatSummaryResponse(rawSummary, {
      addSourceLink: !!request.sourceUrl,
      sourceUrl: request.sourceUrl,
      highlightKeyPoints: true,
    });
    
    return {
      summary: formattedSummary,
      fromCache: false,
      contentType: request.contentType,
      timestamp: Date.now(),
      sourceUrl: request.sourceUrl,
    };
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate summary: ' + (error as Error).message);
  }
}

/**
 * Clear cached summaries for specific content
 * @param contentHash Hash of the content to clear from cache
 * @returns True if successful, false otherwise
 */
export async function clearCachedSummary(contentHash: string): Promise<boolean> {
  try {
    const pattern = `summary:${contentHash}:*`;
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await Promise.all(keys.map(key => redis.del(key)));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Cache clearing error:', error);
    return false;
  }
}

export default {
  getSummary,
  clearCachedSummary,
};