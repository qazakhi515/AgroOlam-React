import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import { Article, ArticleInquiry } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";
import "../../../css/news.css";

const categoryLabels: Record<ArticleCategory, string> = {
  [ArticleCategory.ALL]: "Barchasi",
  [ArticleCategory.KASALLIKLAR]: "Kasalliklar & Davolash",
  [ArticleCategory.AGRO_TAVSIYALAR]: "Agro-Tavsiyalar",
  [ArticleCategory.URUG_VA_HOSIL]: "Urug'chilik & Hosil",
  [ArticleCategory.YANGILIKLAR]: "Soha Yangiliklari",
};

export default function NewsPage() {
  const history = useHistory();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>(
    ArticleCategory.ALL
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const fetchArticles = async (
    category: ArticleCategory,
    search: string,
    pageNum: number
  ) => {
    const articleService = new ArticleService();
    const inquiry: ArticleInquiry = {
      page: pageNum,
      limit: 9,
      order: "createdAt",
      articleCategory: category === ArticleCategory.ALL ? undefined : category,
      search: search.trim() ? search.trim() : undefined,
    };
    const data = await articleService.getArticles(inquiry);
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles(selectedCategory, searchQuery, page);
  }, [selectedCategory, page]);

  const handleSearch = () => {
    setPage(1);
    fetchArticles(selectedCategory, searchQuery, 1);
  };

  const handleCategoryChange = (cat: ArticleCategory) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <div className="news-page">
      {/* Header & Search */}
      <Box className="news-header-section">
        <Container>
          <Typography className="news-header-title">
            AgroOlam Agro-Yangiliklar & Mutaxassis Maslahatlari
          </Typography>
          <Typography className="news-header-subtitle">
            Ekinlar parvarishi, kasalliklarning erta oldini olish, dorilarning
            kimyoviy mosligi va serhosil urug'lar bo'yicha amaliy tavsiyalar
          </Typography>

          <Box className="news-search-box">
            <SearchIcon sx={{ color: "#718096", mr: 1 }} />
            <input
              type="text"
              className="news-search-input"
              placeholder="Kasallik, dori yoki urug' nomini qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              variant="contained"
              className="news-search-btn"
              onClick={handleSearch}
            >
              Qidirish
            </Button>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Category Filters */}
        <Box className="news-categories">
          {Object.values(ArticleCategory).map((cat) => (
            <Button
              key={cat}
              className={`category-tab-btn ${
                selectedCategory === cat ? "active" : "inactive"
              }`}
              onClick={() => handleCategoryChange(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </Box>

        {/* Articles Grid */}
        <Box className="articles-grid">
          {articles.map((item) => (
            <Box
              key={item._id}
              className="article-card"
              onClick={() => history.push(`/news/${item._id}`)}
            >
              <Box className="article-card-img-wrap">
                <img
                  src={item.articleImage}
                  alt={item.articleTitle}
                  className="article-card-img"
                />
                <span className="article-badge">
                  {categoryLabels[item.articleCategory]}
                </span>
              </Box>

              <Box className="article-card-body">
                <Typography className="article-card-title">
                  {item.articleTitle}
                </Typography>
                <Typography className="article-card-brief">
                  {item.articleBrief}
                </Typography>

                <Box className="article-card-meta">
                  <span className="article-meta-item">
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    {item.readingTime || "3 daqiqa"}
                  </span>
                  <span className="article-meta-item">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                    {item.articleViews} ko'rildi
                  </span>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Pagination */}
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={Math.max(1, Math.ceil(articles.length / 9))}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      </Container>
    </div>
  );
}

