import { Box, Button, Container, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

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
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.PLANTS,
    search: " ",
  });
  const [searchText, setSearchText] = useState<string>("");
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
  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
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
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Box className="main-title">Agrivia Agro Mahsulotlar Bozori</Box>
            <div className="mclain-input">
              <input
                type="text"
                placeholder="Type here..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}
              />
              <button
                className="main-input-button"
                onClick={searchProductHandler}
              >
                Search{" "}
              </button>
            </div>
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
                  color={
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.OTHER)
                  }
                >
                  Other
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
                  Tools
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
                  Fertilizers
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
                  Seeds
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
                  Plants
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
          <Box className="category-title">Our Family Brands</Box>
          <Stack className="brand-list">
            <Box className="review-box">
              <img src="/img/gurme.webp" />
            </Box>
            <Box className="review-box">
              <img src="/img/seafood.webp" />
            </Box>
            <Box className="review-box">
              <img src="/img/sweets.webp" />
            </Box>
            <Box className="review-box">
              <img src="/img/doner.webp" />
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
