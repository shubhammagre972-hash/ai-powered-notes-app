
export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string;
  categories: string[];
  transcription?: string;
  timestamp: number;
  understandingRating?: number;
  suggestedResources?: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book';
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}
