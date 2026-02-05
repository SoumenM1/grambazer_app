export interface User {
  _id: string;
  name: string;
  avatar?: string;
}

export interface FeedItem {
  _id: string;
  caption?: string;
  mediaUrl: string;
  type: "image" | "video";
  isLive?: boolean;
  views?: number;
  createdAt: string;
  user: User;
}

export interface FeedResponse {
  success: boolean;
  data: FeedItem[];
  nextCursor: string | null;
}
