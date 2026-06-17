import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserModel, ProductModel, CartItemModel, OrderModel } from '../types';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
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

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as UserModel);
        } else {
          // This should handled in signUp, but fallback
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Products Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: ProductModel[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as ProductModel);
      });
      
      if (prods.length === 0 && !isLoading) {
        // Seed initial products if collection is empty
        // In a real app this might be a separate setup script
        INITIAL_PRODUCTS.forEach(async (p) => {
          const { id, ...data } = p;
          await setDoc(doc(db, 'products', id), data);
        });
      }
      setProducts(prods);
    });

    return () => unsubscribe();
  }, [isLoading]);

  // Orders Listener
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    let q;
    if (currentUser.role === 'employee') {
      // Employees see everything
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else {
      // Clients see only their orders
      q = query(
        collection(db, 'orders'), 
        where('customerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: OrderModel[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as OrderModel);
      });
      setOrders(ords);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Cart persistence in localStorage is still okay as it's transient
  // but let's clear it on signout.
  useEffect(() => {
    const storedCart = localStorage.getItem('ar_cart_list');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const saveCartList = (updatedCart: CartItemModel[]) => {
    setCart(updatedCart);
    localStorage.setItem('ar_cart_list', JSON.stringify(updatedCart));
  };

  // Auth Functions
  const signIn = async (
    email: string,
    role: 'client' | 'employee',
    password?: string
  ): Promise<UserModel> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password || 'password123'); 
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserModel;
      return userData;
    } else {
      throw new Error("Usuário não encontrado no banco de dados.");
    }
  };

  const signUp = async (
    name: string,
    email: string,
    role: 'client' | 'employee',
    password?: string
  ): Promise<UserModel> => {
    try {
      const psw = password || 'password123';
      let userCredential;
      
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, psw);
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          return signIn(email, role, psw);
        }
        throw e;
      }
      
      const newUser: UserModel = {
        uid: userCredential.user.uid,
        email: email.toLowerCase(),
        name: name.trim(),
        role: role
      };
      
      await setDoc(doc(db, 'users', newUser.uid), newUser);
      return newUser;
    } catch (e: any) {
      throw e;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    saveCartList([]);
  };

  // Product Functions
  const addProduct = async (newProdData: Omit<ProductModel, 'id'>) => {
    await addDoc(collection(db, 'products'), newProdData);
  };

  const updateProduct = async (id: string, updatedFields: Partial<ProductModel>) => {
    await updateDoc(doc(db, 'products', id), updatedFields);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  // Cart Functions (Client Side only until checkout)
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
    if (!currentUser) {
      throw new Error("É necessário fazer login para realizar um pedido.");
    }
    if (cart.length === 0) {
      throw new Error("O carrinho está vazio.");
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      customerId: currentUser.uid,
      customerName: currentUser.name,
      items: [...cart],
      totalPrice: total,
      status: 'Pendente',
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    // Update products stock
    for (const item of cart) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        await updateDoc(doc(db, 'products', prod.id), {
          stock: Math.max(0, prod.stock - item.quantity)
        });
      }
    }

    clearCart();

    return {
      id: docRef.id,
      ...orderData,
      createdAt: Timestamp.now() // For immediate optimistic UI response though listeners will handle it
    } as OrderModel;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: 'Pendente' | 'Preparando' | 'Enviado' | 'Entregue'
  ) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
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
