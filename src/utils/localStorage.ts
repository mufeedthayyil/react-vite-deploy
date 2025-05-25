import { Camera, Accessory, CartItem, User } from '../types';
import { cameras, accessories } from '../data/initialData';

// Initialize local storage with data if it doesn't exist
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('cameras')) {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }
  
  if (!localStorage.getItem('accessories')) {
    localStorage.setItem('accessories', JSON.stringify(accessories));
  }
  
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
};

// Camera CRUD operations
export const getCameras = (): Camera[] => {
  const data = localStorage.getItem('cameras');
  return data ? JSON.parse(data) : [];
};

export const updateCamera = (camera: Camera): void => {
  const cameras = getCameras();
  const index = cameras.findIndex(c => c.id === camera.id);
  
  if (index !== -1) {
    cameras[index] = camera;
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }
};

export const addCamera = (camera: Camera): void => {
  const cameras = getCameras();
  cameras.push(camera);
  localStorage.setItem('cameras', JSON.stringify(cameras));
};

export const deleteCamera = (id: string): void => {
  const cameras = getCameras();
  const filtered = cameras.filter(camera => camera.id !== id);
  localStorage.setItem('cameras', JSON.stringify(filtered));
};

// Accessory CRUD operations
export const getAccessories = (): Accessory[] => {
  const data = localStorage.getItem('accessories');
  return data ? JSON.parse(data) : [];
};

export const updateAccessory = (accessory: Accessory): void => {
  const accessories = getAccessories();
  const index = accessories.findIndex(a => a.id === accessory.id);
  
  if (index !== -1) {
    accessories[index] = accessory;
    localStorage.setItem('accessories', JSON.stringify(accessories));
  }
};

export const addAccessory = (accessory: Accessory): void => {
  const accessories = getAccessories();
  accessories.push(accessory);
  localStorage.setItem('accessories', JSON.stringify(accessories));
};

export const deleteAccessory = (id: string): void => {
  const accessories = getAccessories();
  const filtered = accessories.filter(accessory => accessory.id !== id);
  localStorage.setItem('accessories', JSON.stringify(filtered));
};

// Cart operations
export const getCart = (): CartItem[] => {
  const data = localStorage.getItem('cart');
  return data ? JSON.parse(data) : [];
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    i => i.itemId === item.itemId && i.duration === item.duration
  );
  
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const updateCartItem = (item: CartItem): void => {
  const cart = getCart();
  const index = cart.findIndex(i => i.id === item.id);
  
  if (index !== -1) {
    cart[index] = item;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const removeFromCart = (id: string): void => {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(filtered));
};

export const clearCart = (): void => {
  localStorage.setItem('cart', JSON.stringify([]));
};

// User authentication
export const loginUser = (username: string, password: string): User | null => {
  // In a real app, this would be a server request with proper authentication
  if (username === 'admin' && password === '123') {
    const user = {
      id: '1',
      username: 'admin',
      isAdmin: true
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
};