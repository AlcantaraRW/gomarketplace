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
      const value = await AsyncStorage.getItem('products');

      if (value) {
        const parsedValue = JSON.parse(value);
        setProducts(parsedValue);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async (id: string) => {
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex >= 0) {
        const product = products[productIndex];
        product.quantity += 1;

        const newProducts = products.filter(p => p.id !== id);
        setProducts([...newProducts, product]);

        await AsyncStorage.setItem('products', JSON.stringify(products));
      }
    },
    [products],
  );

  const decrement = useCallback(
    async (id: string) => {
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex >= 0) {
        const product = products[productIndex];
        product.quantity -= 1;

        const newProducts = products.filter(p => p.id !== id);
        setProducts([...newProducts, product]);

        await AsyncStorage.setItem('products', JSON.stringify(products));
      }
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      const index = products.findIndex(p => p.id === product.id);

      if (index >= 0) {
        increment(products[index].id);
      } else {
        setProducts(oldProducts => [...oldProducts, product]);
        await AsyncStorage.setItem('products', JSON.stringify(products));
      }
    },
    [increment, products],
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
