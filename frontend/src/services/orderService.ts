import api from "./api";

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
    price: string;
  };
}

export interface OrderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  orderDate: string;
  orderItems: OrderItem[];
  user?: OrderUser;
  employeeId?: number | null;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  userId: number;
  type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  items: CreateOrderItem[];
}

export const createOrder = async (
  data: CreateOrderData
): Promise<Order> => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const getOrderById = async (
  id: number
): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get("/orders");
  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: string
): Promise<Order> => {
  const response = await api.patch(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
};