import { Box, Button, Container, Stack, Chip, CircularProgress } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveProducts } from "./selector";
import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { getSavedLanguage, translations } from "../../../lib/i18n";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;

  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever); //product larni chaqirish
  const lang = getSavedLanguage();
  const t = translations[lang];

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: undefined,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    //Backend server data request => data
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => {
        setProducts(data); //slice go
      })
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  //** Handler */
  const searchCollectionHandler = (collection?: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setAiExplanation(null);
    setProductSearch({ ...productSearch });
  };

  //** Search Order Handler */
  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    productSearch.page = 1;
    setAiExplanation(null);
    setProductSearch({ ...productSearch });
  };

  /** AI Natural Language Search */
  const handleAISearch = async (queryOverride?: string) => {
    const prompt = (queryOverride !== undefined ? queryOverride : searchText).trim();
    if (!prompt) return;
    setSearchText(prompt);
    setAiLoading(true);
    try {
      const res = await axios.post(`${serverApi}/ai/search`, { prompt });
      const { productCollection, search, order, explanation } = res.data;
      setAiExplanation(explanation || `AI Search: "${prompt}"`);
      setProductSearch({
        page: 1,
        limit: 8,
        order: order || "createdAt",
        productCollection: (productCollection as ProductCollection) || undefined,
        search: search || "",
      });
    } catch (err) {
      console.log("Error in handleAISearch:", err);
      // Fallback to normal search
      searchProductHandler();
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchText("");
    setAiExplanation(null);
    setProductSearch({
      page: 1,
      limit: 8,
      order: "createdAt",
      productCollection: undefined,
      search: "",
    });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const aiSuggestions: Record<string, string[]> = {
    en: [
      "Cheap cucumber seeds",
      "Powdery mildew medicine",
      "Bio tomato fertilizer",
      "Smart greenhouse tools",
    ],
    ko: [
      "저렴한 오이 씨앗",
      "흰가루병 방제 살균제",
      "토마토 친환경 비료",
      "스마트 온실 농기구",
    ],
    uz: [
      "Arzon bodring urug'i",
      "Un-shudringga qarshi dori",
      "Pomidor uchun o'g'it",
      "Issiqxona asboblari",
    ],
  };

  const activeSuggestions = aiSuggestions[lang] || aiSuggestions.en;

  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Box className="main-title">
              {lang === "ko"
                ? "Agrivia 스마트 농자재 마켓"
                : lang === "uz"
                ? "Agrivia Agro Mahsulotlar Bozori"
                : "Agrivia Smart Agro Marketplace"}
            </Box>
            <div className="mclain-input" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                placeholder={
                  lang === "ko"
                    ? "예: 저렴한 오이 씨앗, 흰가루병 방제약..."
                    : lang === "uz"
                    ? "Masalan: arzon bodring urug'i, pomidor dorisi..."
                    : "e.g. cheap cucumber seeds, powdery mildew..."
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAISearch();
                }}
                style={{ flex: 1 }}
              />
              <button
                className="main-input-button"
                onClick={searchProductHandler}
                style={{ minWidth: "80px" }}
              >
                Search
              </button>
              <button
                className="main-input-button"
                onClick={() => handleAISearch()}
                disabled={aiLoading}
                style={{
                  background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 18px",
                  borderRadius: "20px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                }}
              >
                {aiLoading ? (
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                ) : (
                  <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                )}
                AI Search
              </button>
            </div>

            {/* Quick AI Suggestion Chips */}
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ mt: 1.5, gap: "6px" }}
            >
              <span style={{ fontSize: "12px", color: "#666", alignSelf: "center" }}>
                💡 {lang === "ko" ? "AI 추천 검색:" : lang === "uz" ? "AI tavsiya:" : "Try AI Search:"}
              </span>
              {activeSuggestions.map((sug, idx) => (
                <Chip
                  key={idx}
                  label={sug}
                  size="small"
                  onClick={() => handleAISearch(sug)}
                  sx={{
                    bgcolor: "#edf7ee",
                    color: "#2e7d32",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#c8e6c9" },
                  }}
                />
              ))}
            </Stack>

            {/* AI Search Feedback Banner */}
            {aiExplanation && (
              <Box
                sx={{
                  mt: 2,
                  px: 2,
                  py: 1,
                  bgcolor: "#e8f5e9",
                  border: "1px solid #81c784",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  maxWidth: "600px",
                  width: "100%",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AutoAwesomeIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                  <span style={{ fontSize: "13px", color: "#1b5e20", fontWeight: 600 }}>
                    {aiExplanation}
                  </span>
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleResetFilters}
                  startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    fontSize: "11px",
                    color: "#2e7d32",
                    borderColor: "#81c784",
                    textTransform: "none",
                  }}
                >
                  Reset
                </Button>
              </Box>
            )}
          </Stack>

          <Stack className={"dishes-frame-section"}>
            <Stack className={"dishes-filter-box"}>
              <Button
                variant={"contained"}
                className={"order"}
                color={
                  productSearch.order === "createdAt" ? "primary" : "secondary"
                }
                onClick={() => searchOrderHandler("createdAt")}
              >
                New
              </Button>
              <Button
                variant={"contained"}
                className={"order"}
                color={
                  productSearch.order === "productPrice"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchOrderHandler("productPrice")}
              >
                Price
              </Button>
              <Button
                variant={"contained"}
                className={"order"}
                color={
                  productSearch.order === "productViews"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchOrderHandler("productViews")}
              >
                Views
              </Button>
            </Stack>
          </Stack>

          <Stack className={"list-category-section"}>
            <Stack className={"product-category"}>
              <div className={"category-main"}>
                <Button
                  variant={"contained"}
                  color={!productSearch.productCollection ? "primary" : "secondary"}
                  onClick={() => searchCollectionHandler(undefined)}
                >
                  {t.categories.all}
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.PLANTS
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.PLANTS)
                  }
                >
                  {t.categories.plants}
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.SEEDS
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.SEEDS)
                  }
                >
                  {t.categories.seeds}
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.productCollection ===
                    ProductCollection.FERTILIZERS
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.FERTILIZERS)
                  }
                >
                  {t.categories.fertilizers}
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.TOOLS
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.TOOLS)
                  }
                >
                  {t.categories.tools}
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.OTHER)
                  }
                >
                  {t.categories.other}
                </Button>
              </div>
            </Stack>
            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product, index) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume = product.productVolume
                    ? product.productVolume + " kg/L"
                    : product.productSize + " pack";
                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => chooseProductHandler(product._id)}
                    >
                      <Stack
                        className={"product-img"}
                        sx={{ backgroundImage: `url(${imagePath})` }}
                      >
                        <div className={"product-sale"}>{sizeVolume}</div>

                        <Button
                          className={"shop-btn"}
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={"/icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                            alt="shop"
                          />
                        </Button>

                        <Button className={"view-btn"} sx={{ right: "36px" }}>
                          <Badge
                            badgeContent={product.productViews}
                            color="secondary"
                          >
                            <RemoveRedEyeIcon
                              sx={{
                                color:
                                  product.productViews === 0 ? "gray" : "white",
                              }}
                            />
                          </Badge>
                        </Button>
                      </Stack>

                      <Box className={"product-desc"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>

                        <div className={"product-desc"}>
                          <MonetizationOnIcon />
                          {product.productPrice}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data">Products are not available!</Box>
              )}
            </Stack>
          </Stack>

          <Stack className={"pagination-section"}>
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Container className="family-brands">
          <Box className="category-title">Sertifikatlangan Agro-Hamkorlar & Texnologiyalar</Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%", justifyContent: "space-between", mt: 3 }}
          >
            <Box
              sx={{
                flex: 1,
                p: 2.5,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: 24, mb: 0.5 }}>🌱</Box>
              <Box sx={{ fontWeight: 800, color: "#166534", fontSize: 16 }}>Syngenta Agro</Box>
              <Box sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>Gibrid Urug'lar & Fungitsidlar</Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2.5,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: 24, mb: 0.5 }}>🔬</Box>
              <Box sx={{ fontWeight: 800, color: "#1e40af", fontSize: 16 }}>Bayer CropScience</Box>
              <Box sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>Innovatsion O'simlik Himoyasi</Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2.5,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: 24, mb: 0.5 }}>🌾</Box>
              <Box sx={{ fontWeight: 800, color: "#854d0e", fontSize: 16 }}>Yara International</Box>
              <Box sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>Mineral & Organik O'g'itlar</Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2.5,
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <Box sx={{ fontSize: 24, mb: 0.5 }}>🤖</Box>
              <Box sx={{ fontWeight: 800, color: "#065f46", fontSize: 16 }}>AgroPlant Vision AI</Box>
              <Box sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>Avtomatik Dorilash & Eslatmalar</Box>
            </Box>
          </Stack>
        </Container>
      </div>

      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"title"}>Our address</Box>
            <iframe
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps?q=Gangnam,Seoul&output=embed"
              width="1320"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
