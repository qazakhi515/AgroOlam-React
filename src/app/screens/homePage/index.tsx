import React, { useEffect } from "react";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewProducts from "./NewProducts";
import PopularProducts from "./PopularProducts";
import Statistics from "./Statistics";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewProducts, setPopularProducts, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import "../../../css/home.css";
import MemberService from "../../services/memberService";
import { Member } from "../../../lib/types/member";

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const { setPopularProducts, setNewProducts, setTopUsers } =
    actionDispatch(useDispatch());

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.PLANTS,
      })
      .then((data) => {
        setPopularProducts(data);
      })
      .catch((err) => console.log(err));

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
        productCollection: ProductCollection.PLANTS,
      })
      .then((data) => {
        setNewProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const member = new MemberService();
  member
    .getTopUsers()
    .then((data) => {
      setTopUsers(data);
    })
    .catch((err) => console.log(err));

  return (
    <div className={"homepage"}>
      <Statistics />
      <PopularProducts />
      <NewProducts />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}
