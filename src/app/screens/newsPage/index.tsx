import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import { Article, ArticleInquiry } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";
import AndijanAgroWeatherBar from "../../components/weather/AndijanAgroWeatherBar";
import { getSavedLanguage, translations } from "../../../lib/i18n";
import "../../../css/news.css";

export default function NewsPage() {
  const history = useHistory();
  const lang = getSavedLanguage();
  const t = translations[lang].news;

  const categoryLabels: Record<ArticleCategory, string> = {
    [ArticleCategory.ALL]: t.catAll,
    [ArticleCategory.KASALLIKLAR]: t.catDiseases,
    [ArticleCategory.AGRO_TAVSIYALAR]: t.catAdvisory,
    [ArticleCategory.URUG_VA_HOSIL]: t.catSeeds,
    [ArticleCategory.YANGILIKLAR]: t.catNews,
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>(
    ArticleCategory.ALL
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

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
    const count = articleService.getTotalArticlesCount(inquiry);
    setArticles(data);
    setTotalCount(count);
  };

  useEffect(() => {
    fetchArticles(selectedCategory, searchQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            AgroOlam {t.title}
          </Typography>

          <Box className="news-search-box">
            <SearchIcon sx={{ color: "#718096", mr: 1 }} />
            <input
              type="text"
              className="news-search-input"
              placeholder={t.searchPlaceholder}
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
              {lang === "uz" ? "Qidirish" : lang === "ko" ? "검색" : "Search"}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Real-time Andijan Agro-Meteo Advisory Widget */}
        <AndijanAgroWeatherBar />

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
                  src={
                    item.articleImage ||
                    (item.articleCategory === ArticleCategory.URUG_VA_HOSIL
                      ? "/img/harvest.jpg"
                      : item.articleCategory === ArticleCategory.AGRO_TAVSIYALAR
                      ? "/img/agrolab.jpg"
                      : item.articleCategory === ArticleCategory.KASALLIKLAR
                      ? "/img/disease.jpg"
                      : "/img/farm-banner.jpg")
                  }
                  alt={item.articleTitle}
                  className="article-card-img"
                  onError={(e) => {
                    const fallback =
                      item.articleCategory === ArticleCategory.URUG_VA_HOSIL
                        ? "/img/harvest.jpg"
                        : item.articleCategory === ArticleCategory.AGRO_TAVSIYALAR
                        ? "/img/agrolab.jpg"
                        : item.articleCategory === ArticleCategory.KASALLIKLAR
                        ? "/img/disease.jpg"
                        : "/img/farm-banner.jpg";
                    (e.target as HTMLImageElement).src = fallback;
                  }}
                />
                <span className="article-badge">
                  {categoryLabels[item.articleCategory]}
                </span>
                {item.tag && (
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      bgcolor: "rgba(16, 185, 129, 0.95)",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "10px",
                      height: "22px",
                    }}
                  />
                )}
              </Box>

              <Box className="article-card-body">
                {item.source && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#2D6A4F",
                      fontWeight: 800,
                      fontSize: "11.5px",
                      mb: 0.8,
                      display: "block",
                    }}
                  >
                    {item.source}
                  </Typography>
                )}

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
            count={Math.max(1, Math.ceil(totalCount / 9))}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      </Container>
    </div>
  );
}

