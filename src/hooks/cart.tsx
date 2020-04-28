import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const existingProductIndex = products.findIndex(p => p.id === product.id);
      const existingProduct = products[existingProductIndex];

      if (existingProduct) {
        products[existingProductIndex].quantity += 1;
        return;
      }

      setProducts(oldProducts => [...oldProducts, product]);
    },
    [products],
  );

  const increment = useCallback(
    async (id: string) => {
      const existingProductIndex = products.findIndex(p => p.id === id);
      const existingProduct = products[existingProductIndex];

      if (existingProduct) {
        products[existingProductIndex].quantity += 1;
      }

      setProducts(products);
    },
    [products],
  );

  const decrement = useCallback(
    async (id: string) => {
      const existingProductIndex = products.findIndex(p => p.id === id);
      const existingProduct = products[existingProductIndex];

      if (existingProduct) {
        products[existingProductIndex].quantity -= 1;
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
