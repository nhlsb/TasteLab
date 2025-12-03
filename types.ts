export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
  remainingSamples: number;
  totalSamples: number;
  rating: number;
  popularity: number; // 0-100 score for leaderboard
  spicyLevel?: number; // 0-5
  sweetLevel?: number; // 0-5
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  content: string;
  rating: number;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum ViewState {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
}