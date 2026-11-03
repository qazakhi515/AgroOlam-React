import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useHistory, useParams } from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import { Article } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";
import "../../../css/news.css";

interface RouteParams {
  articleId: string;
}

export default function ChosenArticle() {
  const { articleId } = useParams<RouteParams>();
  const history = useHistory();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const articleService = new ArticleService();
      const data = await articleService.getArticle(articleId);
      setArticle(data);
    };
    fetchArticle();
  }, [articleId]);

  if (!article) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">Maqola yuklanmoqda...</Typography>
      </Container>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "uz-UZ",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="article-detail-page">
      <Container maxWidth="md">
        {/* Breadcrumb and Back */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" style={{ textDecoration: "none", color: "#2e7d32" }}>
              Bosh sahifa
            </Link>
            <Link
              to="/news"
              style={{ textDecoration: "none", color: "#2e7d32" }}
            >
              Yangiliklar
            </Link>
            <Typography color="text.primary">Batafsil</Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push("/news")}
            sx={{ textTransform: "none", color: "#2e7d32" }}
          >
            Barcha yangiliklar
          </Button>
        </Stack>

        {/* Main Article Content Card */}
        <Box className="article-detail-card">
          <Box className="article-detail-header">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <span className="article-badge" style={{ position: "static" }}>
                {article.articleCategory}
              </span>
              {article.tag && (
                <Chip
                  label={article.tag}
                  size="small"
                  sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700 }}
                />
              )}
            </Stack>

            <Typography className="article-detail-title">
              {article.articleTitle}
            </Typography>

            {article.source && (
              <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ color: "#2D6A4F", fontWeight: 800 }}>
                  Manba: {article.source}
                </Typography>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "11px", color: "#047857", fontWeight: 700, textDecoration: "underline" }}
                  >
                    (Rasmiy veb-saytga o'tish ↗)
                  </a>
                )}
              </Box>
            )}

            <Box className="article-detail-meta">
              <span className="article-meta-item">
                <PersonIcon sx={{ fontSize: 18 }} />
                {article.author}
              </span>
              <span className="article-meta-item">
                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                {formattedDate}
              </span>
              <span className="article-meta-item">
                <AccessTimeIcon sx={{ fontSize: 18 }} />
                {article.readingTime || "4 daqiqa"}
              </span>
              <span className="article-meta-item">
                <VisibilityIcon sx={{ fontSize: 18 }} />
                {article.articleViews} ko'rildi
              </span>
            </Box>
          </Box>

          <img
            src={
              article.articleImage ||
              (article.articleCategory === ArticleCategory.URUG_VA_HOSIL
                ? "/img/harvest.jpg"
                : article.articleCategory === ArticleCategory.AGRO_TAVSIYALAR
                ? "/img/agrolab.jpg"
                : article.articleCategory === ArticleCategory.KASALLIKLAR
                ? "/img/disease.jpg"
                : "/img/farm-banner.jpg")
            }
            alt={article.articleTitle}
            className="article-hero-image"
            onError={(e) => {
              const fallback =
                article.articleCategory === ArticleCategory.URUG_VA_HOSIL
                  ? "/img/harvest.jpg"
                  : article.articleCategory === ArticleCategory.AGRO_TAVSIYALAR
                  ? "/img/agrolab.jpg"
                  : article.articleCategory === ArticleCategory.KASALLIKLAR
                  ? "/img/disease.jpg"
                  : "/img/farm-banner.jpg";
              (e.target as HTMLImageElement).src = fallback;
            }}
          />

          <Typography className="article-body-content">
            {article.articleContent}
          </Typography>

          {/* Recommended Products Box */}
          {article.recommendedProducts &&
            article.recommendedProducts.length > 0 && (
              <Box className="article-recommended-section">
                <Typography className="article-recommended-title">
                  Ushbu maqolada tavsiya etilgan agro-preparatlar:
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {article.recommendedProducts.map((prod) => (
                    <Box
                      key={prod._id}
                      sx={{
                        background: "#fff",
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={prod.productImage}
                        alt={prod.productName}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                          {prod.productName}
                        </Typography>
                        <Typography sx={{ color: "#2e7d32", fontWeight: 700 }}>
                          {prod.productPrice.toLocaleString()} so'm
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        startIcon={<ShoppingBagIcon />}
                        onClick={() => history.push("/products")}
                        sx={{ ml: 2, textTransform: "none" }}
                      >
                        Xarid qilish
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
        </Box>
      </Container>
    </div>
  );
}
