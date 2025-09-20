/* SPDX-License-Identifier: MIT
 * Resource and ResourceType interfaces for Open Idea federated search.
 */

/**
 * Supported provider sources for federated search resources.
 */

export type ResourceProvider =
  'openalex'
  | 'arxiv'
  | 'zenodo'
  | 'swh'
  | 'ckan'
  | 'huggingface'
  | 'paperswithcode'
  | 'youtube'
  | 'github'
  | 'gitlab'
  | 'figshare'
  | 'kaggle'
  | 'custom';

/**
 * ResourceType enumerates the types of resources returned by providers.
 */
export type ResourceType = 'paper' | 'dataset' | 'code' | 'model' | 'hardware' | 'video';

/**
 * Resource represents a normalized search result from any provider.
 */
export interface Resource {
  /** Unique identifier (DOI, SWHID, or URL) */
  id: string;
  /** Resource type */
  type: ResourceType;
  /** Title of the resource */
  title: string;
  /** List of authors (if available) */
  authors?: string[];
  /** Year of publication or release (if available) */
  year?: number;
  /** Source provider (e.g., 'openalex', 'arxiv', 'zenodo', etc.) */
  source: ResourceProvider;
  /** URL to the resource */
  url: string;
  /** License (SPDX identifier or text, always present if available) */
  license?: string;
  /** Optional description or abstract */
  description?: string;
  /** Optional tags */
  tags?: string[];
  /** Optional meta object for extra metadata */
  meta?: Record<string, unknown>;
  /** Optional score for ranking */
  score?: number;
  [key: string]: string | ResourceType | string[] | number | ResourceProvider | boolean | Record<string, unknown> | undefined;
}
