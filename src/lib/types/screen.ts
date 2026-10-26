import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

/** React app state **/
export interface AppRootState {
  ordersPagePage: any;
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

export interface HomePageState {
  popularProducts: Product[];
  newProducts: Product[];
  topUsers: Member[];
  // Legacy aliases
  popularDishes?: Product[];
  newDishes?: Product[];
}

/** Products Page **/
export interface ProductsPageState {
  storeDetails?: Member | null;
  restaurant?: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}

/** Orders Page **/
export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
}
