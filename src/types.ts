export interface KidProfile {
  id: string;
  name: string;
  classKey: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3';
  className: string;
  points: number;
  streak: number;
  emoji: string;
  avatarBg: string;
  avatarColor: string;
}

export interface DigitalContent {
  id: string;
  title: string;
  subject: 'toan' | 'tieng_viet' | 'tieng_anh' | 'ky_nang';
  format: 'pdf' | 'flashcards' | 'video';
  age: 'mam_non' | 'lop_1' | 'lop_2' | 'lop_3';
  isPremium: boolean;
  downloads: number;
  desc: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  downloads: number;
  desc: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Flashcard {
  emoji: string;
  eng: string;
  viet: string;
  pron: string;
  category?: string;
}

export interface Message {
  sender: 'user' | 'ai' | 'ai-loading';
  text: string;
  id: string;
}

export interface Milestone {
  milestone: string;
  detail: string;
}
