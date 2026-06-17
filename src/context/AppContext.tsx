import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModel, ProductModel, CartItemModel, OrderModel } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface AppContextType {
  currentUser: UserModel | null;
  usersList: UserModel[];
  products: ProductModel[];
  cart: CartItemModel[];
  orders: OrderModel[];
  isLoading: boolean;
  
  // Auth methods
  signIn: (email: string, role: 'client' | 'employee', name?: string) => Promise<UserModel>;
  signUp: (name: string, email: string, role: 'client' | 'employee') => Promise<UserModel>;
  signOut: () => void;
  
  // Product methods
  addProduct: (product: Omit<ProductModel, 'id'>) => void;
  updateProduct: (id: string, product: Partial<ProductModel>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart methods
  addItemToCart: (product: ProductModel) => void;
  removeSingleItemFromCart: (productId: string) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Order methods
  placeOrder: () => Promise<OrderModel>;
  updateOrderStatus: (orderId: string, status: 'Pendente' | 'Preparando' | 'Enviado' | 'Entregue') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const [usersList, setUsersList] = useState<UserModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [cart, setCart] = useState<CartItemModel[]>([]);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on init
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ar_current_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedUserList = localStorage.getItem('ar_users_list');
      if (storedUserList) {
        setUsersList(JSON.parse(storedUserList));
      } else {
        // Initialize default users (one client, one employee) for easy testing
        const defaultUsers: UserModel[] = [
          { uid: 'u-1', email: 'cliente@raniere.com', name: 'Adriana Silva', role: 'client' },
          { uid: 'u-2', email: 'ateliere@raniere.com', name: 'Raniere Altieri', role: 'employee' }
        ];
        localStorage.setItem('ar_users_list', JSON.stringify(defaultUsers));
        setUsersList(defaultUsers);
      }

      const storedProducts = localStorage.getItem('ar_products_list');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        localStorage.setItem('ar_products_list', JSON.stringify(INITIAL_PRODUCTS));
        setProducts(INITIAL_PRODUCTS);
      }

      const storedOrders = localStorage.getItem('ar_orders_list');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Prepare some mock previous orders for luxurious look
        const defaultOrders: OrderModel[] = [
          {
            id: 'ORD-9842',
            customerId: 'u-1',
            customerName: 'Adriana Silva',
            items: [
              {
                productId: 'prod-1',
                name: 'Vestido Ébano Dourado',
                price: 4500,
                imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
                quantity: 1
              }
            ],
            totalPrice: 4500,
            status: 'Entregue',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'ORD-1049',
            customerId: 'u-1',
            customerName: 'Adriana Silva',
            items: [
              {
                productId: 'prod-3',
                name: 'Scarpin Aureum 85',
                price: 2900,
                imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
                quantity: 1
              },
              {
                productId: 'prod-5',
                name: 'Clutch Escultórica Raniere',
                price: 3400,
                imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
                quantity: 1
              }
            ],
            totalPrice: 6300,
            status: 'Preparando',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ];
        localStorage.setItem('ar_orders_list', JSON.stringify(defaultOrders));
        setOrders(defaultOrders);
      }

      const storedCart = localStorage.getItem('ar_cart_list');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Local storage loading error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes helper
  const saveUserData = (user: UserModel | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('ar_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ar_current_user');
    }
  };

  const saveProductsList = (updatedProducts: ProductModel[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('ar_products_list', JSON.stringify(updatedProducts));
  };

  const saveOrdersList = (updatedOrders: OrderModel[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('ar_orders_list', JSON.stringify(updatedOrders));
  };

  const saveCartList = (updatedCart: CartItemModel[]) => {
    setCart(updatedCart);
    localStorage.setItem('ar_cart_list', JSON.stringify(updatedCart));
  };

  // Auth Functions
  const signIn = async (
    email: string,
    role: 'client' | 'employee',
    name?: string
  ): Promise<UserModel> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.trim().toLowerCase();
        // Look up user
        const existingUser = usersList.find(u => u.email.toLowerCase() === normalizedEmail);
        
        if (existingUser) {
          // If role is different, update or respect custom role
          const updatedUser = { ...existingUser, role }; 
          const newList = usersList.map(u => u.uid === existingUser.uid ? updatedUser : u);
          setUsersList(newList);
          localStorage.setItem('ar_users_list', JSON.stringify(newList));
          saveUserData(updatedUser);
          resolve(updatedUser);
        } else {
          // If not exists, auto-register for ease of use in demo!
          const newUser: UserModel = {
            uid: 'u_' + Date.now(),
            email: normalizedEmail,
            name: name || (role === 'employee' ? 'Alfaiate Raniere' : 'Cliente Especial'),
            role: role
          };
          const newList = [...usersList, newUser];
          setUsersList(newList);
          localStorage.setItem('ar_users_list', JSON.stringify(newList));
          saveUserData(newUser);
          resolve(newUser);
        }
      }, 500);
    });
  };

  const signUp = async (
    name: string,
    email: string,
    role: 'client' | 'employee'
  ): Promise<UserModel> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedEmail = email.trim().toLowerCase();
        const newUser: UserModel = {
          uid: 'u_' + Date.now(),
          email: normalizedEmail,
          name: name.trim(),
          role: role
        };
        const newList = [...usersList.filter(u => u.email.toLowerCase() !== normalizedEmail), newUser];
        setUsersList(newList);
        localStorage.setItem('ar_users_list', JSON.stringify(newList));
        saveUserData(newUser);
        resolve(newUser);
      }, 500);
    });
  };

  const signOut = () => {
    saveUserData(null);
    saveCartList([]);
  };

  // Product Functions
  const addProduct = (newProdData: Omit<ProductModel, 'id'>) => {
    const newProduct: ProductModel = {
      ...newProdData,
      id: 'prod-' + Date.now()
    };
    saveProductsList([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<ProductModel>) => {
    const updated = products.map(prod => {
      if (prod.id === id) {
        return { ...prod, ...updatedFields };
      }
      return prod;
    });
    saveProductsList(updated);
  };

  const deleteProduct = (id: string) => {
    saveProductsList(products.filter(prod => prod.id !== id));
  };

  // Cart Functions
  const addItemToCart = (product: ProductModel) => {
    const existingIndex = cart.findIndex(item => item.productId === product.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + 1
      };
      saveCartList(updatedCart);
    } else {
      const newCartItem: CartItemModel = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      };
      saveCartList([...cart, newCartItem]);
    }
  };

  const removeSingleItemFromCart = (productId: string) => {
    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].quantity > 1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity - 1
        };
        saveCartList(updatedCart);
      } else {
        saveCartList(cart.filter(item => item.productId !== productId));
      }
    }
  };

  const removeItemFromCart = (productId: string) => {
    saveCartList(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    saveCartList([]);
  };

  // Order Functions
  const placeOrder = async (): Promise<OrderModel> => {
    return new Promise((resolve, reject) => {
      if (!currentUser) {
        reject(new Error("É necessário fazer login para realizar um pedido."));
        return;
      }
      if (cart.length === 0) {
        reject(new Error("O carrinho está vazio."));
        return;
      }

      // Calculate total amount
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Decrement stock in state
      const updatedProducts = products.map(prod => {
        const cartItemForProduct = cart.find(item => item.productId === prod.id);
        if (cartItemForProduct) {
          const newStock = Math.max(0, prod.stock - cartItemForProduct.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });

      // Save updated products list
      saveProductsList(updatedProducts);

      const newOrder: OrderModel = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        customerId: currentUser.uid,
        customerName: currentUser.name,
        items: [...cart],
        totalPrice: total,
        status: 'Pendente',
        createdAt: new Date().toISOString()
      };

      const updatedOrders = [newOrder, ...orders];
      saveOrdersList(updatedOrders);
      clearCart();
      resolve(newOrder);
    });
  };

  const updateOrderStatus = (
    orderId: string,
    status: 'Pendente' | 'Preparando' | 'Enviado' | 'Entregue'
  ) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    saveOrdersList(updated);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      usersList,
      products,
      cart,
      orders,
      isLoading,
      signIn,
      signUp,
      signOut,
      addProduct,
      updateProduct,
      deleteProduct,
      addItemToCart,
      removeSingleItemFromCart,
      removeItemFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
