import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  Order,
  OrderInquiry,
  OrderItem,
  OrderItemInput,
  OrderUpdateInput,
} from "../../lib/types/order";
import { CartItem } from "../../lib/types/search";
import { OrderStatus } from "../../lib/enums/order.enum";
import { ProductCollection, ProductSize, ProductStatus } from "../../lib/enums/product.enum";
import { Product } from "../../lib/types/product";

const LOCAL_ORDERS_KEY = "agroolam_orders_db";

const DEFAULT_DEMO_ORDERS: Order[] = [
  {
    _id: "ord_agro_901a",
    orderTotal: 44.1,
    orderDelivery: 0,
    orderStatus: OrderStatus.PAUSE,
    memberId: "farmer_default_id",
    createdAt: new Date(Date.now() - 3600000 * 4),
    updatedAt: new Date(Date.now() - 3600000 * 4),
    orderItems: [
      {
        _id: "item_901a_1",
        itemQuantity: 1,
        itemPrice: 32.8,
        orderId: "ord_agro_901a",
        productId: "agro_clorofill_tomato_1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "item_901a_2",
        itemQuantity: 1,
        itemPrice: 11.3,
        orderId: "ord_agro_901a",
        productId: "agro_ridomil_gold_5",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    productData: [
      {
        _id: "agro_clorofill_tomato_1",
        productCollection: ProductCollection.SEEDS,
        productStatus: ProductStatus.PROCESS,
        productName: "Clorofill F1 Gibrid Pomidor Urug'i (1,000 dona)",
        productPrice: 420000,
        productImages: [
          "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80",
        ],
        productViews: 1420,
        productLeftCount: 45,
        productSize: ProductSize.NORMAL,
        productVolume: 0.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "agro_ridomil_gold_5",
        productCollection: ProductCollection.FERTILIZERS,
        productStatus: ProductStatus.PROCESS,
        productName: "Ridomil Gold MZ 68 WG (Syngenta, 1 kg)",
        productPrice: 145000,
        productImages: [
          "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80",
        ],
        productViews: 2150,
        productLeftCount: 60,
        productSize: ProductSize.NORMAL,
        productVolume: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    _id: "ord_agro_882b",
    orderTotal: 268.5,
    orderDelivery: 0,
    orderStatus: OrderStatus.PROCESS,
    memberId: "farmer_default_id",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 2),
    orderItems: [
      {
        _id: "item_882b_1",
        itemQuantity: 1,
        itemPrice: 268.5,
        orderId: "ord_agro_882b",
        productId: "agro_film_150mkr_4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    productData: [
      {
        _id: "agro_film_150mkr_4",
        productCollection: ProductCollection.OTHER,
        productStatus: ProductStatus.PROCESS,
        productName: "3 Qavatli Termo-Diffuz Salafan (150 mkr, 12m x 50m)",
        productPrice: 3450000,
        productImages: [
          "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
        ],
        productViews: 740,
        productLeftCount: 15,
        productSize: ProductSize.LARGE,
        productVolume: 90.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    _id: "ord_agro_774c",
    orderTotal: 22.4,
    orderDelivery: 5.0,
    orderStatus: OrderStatus.FINISH,
    memberId: "farmer_default_id",
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 48),
    orderItems: [
      {
        _id: "item_774c_1",
        itemQuantity: 3,
        itemPrice: 5.8,
        orderId: "ord_agro_774c",
        productId: "agro_topas_100_7",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    productData: [
      {
        _id: "agro_topas_100_7",
        productCollection: ProductCollection.FERTILIZERS,
        productStatus: ProductStatus.PROCESS,
        productName: "Topas 100 EC Fungitsid (Syngenta, 100 ml)",
        productPrice: 75000,
        productImages: [
          "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80",
        ],
        productViews: 1100,
        productLeftCount: 80,
        productSize: ProductSize.NORMAL,
        productVolume: 0.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  private getLocalOrders(): Order[] {
    try {
      const stored = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(DEFAULT_DEMO_ORDERS));
      return DEFAULT_DEMO_ORDERS;
    } catch {
      return DEFAULT_DEMO_ORDERS;
    }
  }

  private saveLocalOrders(orders: Order[]): void {
    try {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn("Could not save orders to localStorage:", e);
    }
  }

  public async createOrder(input: CartItem[]): Promise<Order> {
    const orderItemsInputs: OrderItemInput[] = input.map((cartItem: CartItem) => {
      return {
        itemQuantity: cartItem.quantity,
        itemPrice: cartItem.price,
        productId: cartItem._id,
      };
    });

    try {
      const url = `${this.path}/order/create`;
      const result = await axios.post(url, orderItemsInputs, {
        withCredentials: true,
        timeout: 6000,
      });
      console.log("createOrder via backend:", result);
      return result.data;
    } catch (err) {
      console.warn("Backend createOrder unreachable, creating order locally:", err);

      const itemsTotal = input.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const orderDelivery = itemsTotal >= 50 || itemsTotal === 0 ? 0 : 5;
      const orderTotal = Number((itemsTotal + orderDelivery).toFixed(2));
      const orderId = `ord_agro_${Date.now().toString(36)}`;

      const orderItems: OrderItem[] = input.map((item, idx) => ({
        _id: `item_${Date.now()}_${idx}`,
        itemQuantity: item.quantity,
        itemPrice: item.price,
        orderId: orderId,
        productId: item._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const productData: Product[] = input.map((item) => ({
        _id: item._id,
        productName: item.name,
        productPrice: item.price,
        productImages: [item.image || "/img/default-agro.png"],
        productCollection: ProductCollection.OTHER,
        productStatus: ProductStatus.PROCESS,
        productDesc: "AgroOlam sertifikatlangan agromahsulot",
        productViews: 100,
        productLeftCount: 50,
        productSize: ProductSize.NORMAL,
        productVolume: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const newOrder: Order = {
        _id: orderId,
        orderTotal,
        orderDelivery,
        orderStatus: OrderStatus.PAUSE,
        memberId: "farmer_local_session",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems,
        productData,
      };

      const orders = this.getLocalOrders();
      orders.unshift(newOrder);
      this.saveLocalOrders(orders);

      return newOrder;
    }
  }

  public async getMyOrders(input: OrderInquiry): Promise<Order[]> {
    try {
      const url = `${this.path}/order/all`;
      const query = `?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`;
      const result = await axios.get(url + query, { withCredentials: true, timeout: 6000 });
      if (Array.isArray(result.data)) {
        return result.data;
      }
      return this.filterLocalOrders(input.orderStatus);
    } catch (err) {
      console.warn("Backend getMyOrders unreachable, using local orders DB:", err);
      return this.filterLocalOrders(input.orderStatus);
    }
  }

  private filterLocalOrders(status: OrderStatus): Order[] {
    const orders = this.getLocalOrders();
    return orders.filter((o) => o.orderStatus === status);
  }

  public async updateOrder(input: OrderUpdateInput): Promise<Order> {
    try {
      const url = `${this.path}/order/update`;
      const result = await axios.post(url, input, {
        withCredentials: true,
        timeout: 6000,
      });
      console.log("updateOrder via backend:", result);
      return result.data;
    } catch (err) {
      console.warn("Backend updateOrder unreachable, updating local orders DB:", err);

      let orders = this.getLocalOrders();
      if (input.orderStatus === OrderStatus.DELETE) {
        orders = orders.filter((o) => o._id !== input.orderId);
        this.saveLocalOrders(orders);
        return {
          _id: input.orderId,
          orderStatus: OrderStatus.DELETE,
        } as Order;
      }

      const targetIndex = orders.findIndex((o) => o._id === input.orderId);
      if (targetIndex !== -1) {
        orders[targetIndex].orderStatus = input.orderStatus;
        orders[targetIndex].updatedAt = new Date();
        this.saveLocalOrders(orders);
        return orders[targetIndex];
      }

      const fallbackOrder: Order = {
        _id: input.orderId,
        orderTotal: 50,
        orderDelivery: 0,
        orderStatus: input.orderStatus,
        memberId: "farmer_default_id",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [],
        productData: [],
      };
      return fallbackOrder;
    }
  }
}

export default OrderService;
