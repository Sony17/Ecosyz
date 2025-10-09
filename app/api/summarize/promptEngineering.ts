// Prompt Engineering for AI Summaries

/**
 * This module provides optimized prompts for generating summaries from different content types.
 * It implements context-aware prompting to improve the quality of AI-generated summaries.
 */

interface PromptOptions {
  maxLength?: number;
  style?: 'concise' | 'detailed' | 'technical' | 'simplified';
  includeKeyPoints?: boolean;
  includeCitations?: boolean;
  targetAudience?: 'general' | 'academic' | 'technical' | 'beginner';
  language?: string;
}

/**
 * Default prompt options to use when specific options are not provided
 */
const defaultPromptOptions: PromptOptions = {
  maxLength: 500,
  style: 'concise',
  includeKeyPoints: true,
  includeCitations: false,
  targetAudience: 'general',
  language: 'en'
};

/**
 * Generate optimized prompt for summarizing academic paper abstracts
 * @param content The paper abstract content to summarize
 * @param options Customization options for the summary
 * @returns An engineered prompt for the AI model
 */
export function generatePaperSummaryPrompt(content: string, options: PromptOptions = {}): string {
  const mergedOptions = { ...defaultPromptOptions, ...options };
  
  // Base prompt with context about academic paper summarization
  let prompt = `Summarize the following academic paper abstract in ${mergedOptions.style} style for a ${mergedOptions.targetAudience} audience. `;
  
  if (mergedOptions.includeKeyPoints) {
    prompt += `Highlight the main research questions, methodology, and findings. `;
  }
  
  if (mergedOptions.includeCitations) {
    prompt += `Include relevant citations in the summary. `;
  }
  
  prompt += `Limit the summary to approximately ${mergedOptions.maxLength} characters.\n\n`;
  prompt += `Abstract:\n${content}`;
  
  return prompt;
}

/**
 * Generate optimized prompt for summarizing code repositories
 * @param repoInfo Information about the code repository
 * @param options Customization options for the summary
 * @returns An engineered prompt for the AI model
 */
export function generateCodeRepoSummaryPrompt(repoInfo: {
  name: string;
  description: string;
  readme?: string;
  languages?: string[];
  stars?: number;
}, options: PromptOptions = {}): string {
  const mergedOptions = { ...defaultPromptOptions, ...options };
  
  // Base prompt with context about code repository summarization
  let prompt = `Summarize the following GitHub repository in ${mergedOptions.style} style for ${mergedOptions.targetAudience} developers. `;
  
  if (mergedOptions.includeKeyPoints) {
    prompt += `Highlight the main purpose, key features, technologies used, and potential applications. `;
  }
  
  prompt += `Limit the summary to approximately ${mergedOptions.maxLength} characters.\n\n`;
  
  prompt += `Repository Name: ${repoInfo.name}\n`;
  prompt += `Description: ${repoInfo.description}\n`;
  
  if (repoInfo.languages && repoInfo.languages.length > 0) {
    prompt += `Languages: ${repoInfo.languages.join(', ')}\n`;
  }
  
  if (repoInfo.stars !== undefined) {
    prompt += `Stars: ${repoInfo.stars}\n`;
  }
  
  if (repoInfo.readme) {
    prompt += `README Excerpt:\n${repoInfo.readme.substring(0, 1500)}${repoInfo.readme.length > 1500 ? '...' : ''}`;
  }
  
  return prompt;
}

/**
 * Generate context-aware prompt based on content analysis
 * @param content The content to summarize
 * @param contentType The type of content being summarized
 * @param options Customization options for the summary
 * @returns An engineered prompt for the AI model
 */
export function generateContextAwarePrompt(
  content: string,
  contentType: 'paper' | 'code' | 'dataset' | 'article' | 'discussion' | 'auto',
  options: PromptOptions = {}
): string {
  const mergedOptions = { ...defaultPromptOptions, ...options };
  
  // If contentType is 'auto', attempt to detect the content type
  if (contentType === 'auto') {
    // Simple detection logic - can be enhanced with more sophisticated analysis
    if (content.includes('github.com') || content.includes('class ') || content.includes('function ')) {
      contentType = 'code';
    } else if (content.includes('Abstract') || content.includes('doi:') || content.includes('Journal of')) {
      contentType = 'paper';
    } else if (content.includes('dataset') || content.includes('data set') || content.includes('CSV')) {
      contentType = 'dataset';
    } else {
      contentType = 'article';
    }
  }
  
  // Select the appropriate prompt template based on content type
  switch (contentType) {
    case 'paper':
      return generatePaperSummaryPrompt(content, mergedOptions);
      
    case 'code':
      // Extract basic repo info from content if it's a URL or raw code
      const repoInfo = {
        name: extractRepoNameFromContent(content),
        description: extractDescriptionFromContent(content),
        readme: content
      };
      return generateCodeRepoSummaryPrompt(repoInfo, mergedOptions);
      
    case 'dataset':
      return `Summarize the following dataset in ${mergedOptions.style} style for ${mergedOptions.targetAudience} audience. Focus on the dataset contents, structure, potential applications, and key statistics if available. Limit to ${mergedOptions.maxLength} characters.\n\n${content}`;
      
    case 'discussion':
      return `Summarize the key points from this discussion in ${mergedOptions.style} style. Capture the main arguments, consensus (if any), and open questions. Limit to ${mergedOptions.maxLength} characters.\n\n${content}`;
      
    case 'article':
    default:
      return `Summarize the following article in ${mergedOptions.style} style for a ${mergedOptions.targetAudience} audience. Highlight the main points and key takeaways. Limit to ${mergedOptions.maxLength} characters.\n\n${content}`;
  }
}

/**
 * Helper function to extract repository name from content
 */
function extractRepoNameFromContent(content: string): string {
  // Simple extraction logic - can be enhanced
  if (content.includes('github.com')) {
    const match = content.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (match && match.length >= 3) {
      return match[2];
    }
  }
  
  return 'Unknown Repository';
}

/**
 * Helper function to extract description from content
 */
function extractDescriptionFromContent(content: string): string {
  // Look for common patterns in README files
  const descriptionMatches = [
    content.match(/# (.+?)[\r\n]/),
    content.match(/\n> (.+?)[\r\n]/),
    content.match(/\nDescription:\s*(.+?)[\r\n]/i)
  ];
  
  for (const match of descriptionMatches) {
    if (match && match.length >= 2) {
      return match[1];
    }
  }
  
  return 'No description available';
}

/**
 * Format the summary response from the AI model
 * @param rawSummary The raw summary text from the AI
 * @param options Formatting options
 * @returns Formatted summary text
 */
export function formatSummaryResponse(rawSummary: string, options: { 
  addSourceLink?: boolean;
  sourceUrl?: string;
  highlightKeyPoints?: boolean;
} = {}): string {
  let formattedSummary = rawSummary.trim();
  
  if (options.highlightKeyPoints) {
    // Look for key points and highlight them
    formattedSummary = formattedSummary.replace(
      /(\n|^)(key (points|findings|results|takeaways):.*?)(\n|$)/gi,
      '$1**$2**$4'
    );
  }
  
  // Add source attribution if URL is provided
  if (options.addSourceLink && options.sourceUrl) {
    formattedSummary += `\n\n*Source: [${new URL(options.sourceUrl).hostname}](${options.sourceUrl})*`;
  }
  
  return formattedSummary;
}

export default {
  generatePaperSummaryPrompt,
  generateCodeRepoSummaryPrompt,
  generateContextAwarePrompt,
  formatSummaryResponse
};