import axios from "axios";
import { serverApi } from "../../lib/config";
import { Article, ArticleInquiry } from "../../lib/types/article";
import { ArticleCategory } from "../../lib/enums/article.enum";
import { initialArticles } from "../../lib/data/articles";

class ArticleService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getArticles(input: ArticleInquiry): Promise<Article[]> {
    try {
      let url = `${this.path}/article/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.articleCategory && input.articleCategory !== ArticleCategory.ALL) {
        url += `&articleCategory=${input.articleCategory}`;
      }
      if (input.search) {
        url += `&search=${encodeURIComponent(input.search)}`;
      }

      const result = await axios.get(url, { withCredentials: true, timeout: 2500 });
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
      return this.filterMockArticles(input);
    } catch (err) {
      // Graceful fallback to initialArticles
      return this.filterMockArticles(input);
    }
  }

  public async getArticle(articleId: string): Promise<Article> {
    try {
      const url = `${this.path}/article/${articleId}`;
      const result = await axios.get(url, { withCredentials: true, timeout: 2500 });
      if (result.data) {
        return result.data;
      }
      const found = initialArticles.find((a) => a._id === articleId);
      if (found) return found;
      return initialArticles[0];
    } catch (err) {
      const found = initialArticles.find((a) => a._id === articleId);
      return found || initialArticles[0];
    }
  }

  private filterMockArticles(input: ArticleInquiry): Article[] {
    let filtered = [...initialArticles];

    if (input.articleCategory && input.articleCategory !== ArticleCategory.ALL) {
      filtered = filtered.filter(
        (a) => a.articleCategory === input.articleCategory
      );
    }

    if (input.search && input.search.trim().length > 0) {
      const q = input.search.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.articleTitle.toLowerCase().includes(q) ||
          a.articleBrief.toLowerCase().includes(q) ||
          a.articleContent.toLowerCase().includes(q)
      );
    }

    // Pagination
    const start = (input.page - 1) * input.limit;
    return filtered.slice(start, start + input.limit);
  }
}

export default ArticleService;

