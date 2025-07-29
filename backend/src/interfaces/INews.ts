import { IUser } from './IUser';

export interface INews {
  id: string;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  isPublished: boolean;
  views: number;
  tags?: string[];
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsService {
  createNews(newsData: Partial<INews>): Promise<INews>;
  getNewsById(id: string): Promise<INews | null>;
  getAllNews(): Promise<INews[]>;
  getPublishedNews(): Promise<INews[]>;
  updateNews(id: string, newsData: Partial<INews>): Promise<INews | null>;
  deleteNews(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<INews | null>;
  getNewsByTags(tags: string[]): Promise<INews[]>;
} 