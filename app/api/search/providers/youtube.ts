/* SPDX-License-Identifier: MIT
 * YouTube video provider client for Open Idea federated search.
 */
import type { Resource } from '../../../../src/types/resource';

// NOTE: This uses the public YouTube Data API v3. You need an API key for production use.
const YT_SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const YT_VIDEO_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos';
const YT_API_KEY = process.env.YOUTUBE_API_KEY || '';

function parseYouTubeVideos(json: any): Resource[] {
  if (!json.items) return [];
  return json.items.map((item: any) => {
    const vid = item.id.videoId || item.id;
    return {
      id: vid,
      type: 'video',
      title: item.snippet?.title || '',
      authors: [item.snippet?.channelTitle || 'YouTube'],
      year: item.snippet?.publishedAt ? parseInt(item.snippet.publishedAt.slice(0, 4)) : undefined,
      source: 'youtube',
      url: `https://www.youtube.com/watch?v=${vid}`,
      license: 'NOASSERTION',
      description: item.snippet?.description || '',
      tags: item.snippet?.tags || [],
      meta: {
        channel: item.snippet?.channelTitle,
        duration: item.contentDetails?.duration,
      },
    };
  });
}

export async function searchYouTubeVideos(q: string): Promise<Resource[]> {
  if (!YT_API_KEY) return [];
  const url = `${YT_SEARCH_ENDPOINT}?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(q)}&key=${YT_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  // For demo, skip fetching durations (requires extra API call)
  return parseYouTubeVideos(json);
}
