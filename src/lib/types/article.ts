import { ArticleCategory, ArticleStatus } from "../enums/article.enum";

export interface Article {
  _id: string;
  articleTitle: string;
  articleBrief: string;
  articleContent: string;
  articleCategory: ArticleCategory;
  articleStatus: ArticleStatus;
  articleImage: string;
  articleViews: number;
  articleLikes: number;
  author: string;
  readingTime?: string;
  recommendedProducts?: {
    _id: string;
    productName: string;
    productPrice: number;
    productImage: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleInquiry {
  page: number;
  limit: number;
  order: string;
  articleCategory?: ArticleCategory;
  search?: string;
}

