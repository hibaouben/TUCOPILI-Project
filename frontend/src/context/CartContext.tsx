import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { createOrder } from "../services/orderService";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = "cash" | "card";

export interface Order {
  id: number | string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: string;
}

interface CartContextType {
  items: CartItem[];

  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;

  total: number;
  itemCount: number;

  activeOrder: Order | null;

  placeOrder: (
    paymentMethod: PaymentMethod
  ) => Promise<Order | null>;
}

const CartContext =
  createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] =
    useState<Order | null>(null);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (
    id: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const placeOrder = async (
    paymentMethod: PaymentMethod
  ): Promise<Order | null> => {
    if (items.length === 0 || !user) {
      return null;
    }

    try {
      const orderFromBackend = await createOrder({
        userId: Number(user.id),
        type: "TAKEAWAY",
        items: items.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
        })),
      });

      const newOrder: Order = {
        id: orderFromBackend.id,
        items: [...items],
        total: Number(orderFromBackend.total),
        paymentMethod,
        status: orderFromBackend.status,
      };

      setActiveOrder(newOrder);
      setItems([]);

      return newOrder;
    } catch (error: any) {
      console.error(
        "ERREUR CREATION COMMANDE:",
        error.response?.data || error
      );

      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        itemCount,
        activeOrder,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}