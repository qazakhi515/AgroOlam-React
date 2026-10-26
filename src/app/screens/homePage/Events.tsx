import React, { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { useHistory } from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import { Article } from "../../../lib/types/article";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  const history = useHistory();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articleService = new ArticleService();
      const data = await articleService.getArticles({
        page: 1,
        limit: 6,
        order: "createdAt",
      });
      setArticles(data);
    };
    fetchArticles();
  }, []);

  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box
          className={"events-text"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span className={"category-title"}>
            Agro-Yangiliklar & Dolzarb Tavsiyalar
          </span>
          <Button
            variant="outlined"
            color="success"
            onClick={() => history.push("/news")}
            sx={{ textTransform: "none", borderRadius: 4 }}
          >
            Barchasini ko'rish →
          </Button>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: true,
          }}
        >
          {articles.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString(
              "uz-UZ",
              { month: "short", day: "numeric" }
            );
            return (
              <SwiperSlide
                key={item._id}
                className={"events-info-frame"}
                style={{ cursor: "pointer" }}
                onClick={() => history.push(`/news/${item._id}`)}
              >
                <div className={"events-img"}>
                  <img
                    src={item.articleImage}
                    alt={item.articleTitle}
                    className={"events-img"}
                  />
                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{item.articleTitle}</strong>
                        <div className={"event-organizator"}>
                          <img src={"/icons/speaker.svg"} alt="speaker" />
                          <p className={"spec-text-author"}>{item.author}</p>
                        </div>
                      </div>

                      <p className={"text-desc"}>{item.articleBrief}</p>

                      <div className={"bott-info"}>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/calendar.svg"} alt="calendar" />
                          {formattedDate}
                        </div>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/location.svg"} alt="location" />
                          {item.readingTime || "3 daqiqa"} o'qish
                        </div>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-prev"}
            alt="prev"
          />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
            alt="next"
          />
        </Box>
      </Stack>
    </div>
  );
}
