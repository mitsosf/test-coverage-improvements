export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Order extends BaseEntity {
  userId: string;
  productIds: string[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
}

export interface Comment extends BaseEntity {
  userId: string;
  postId: string;
  content: string;
  likes: number;
}

export interface Tag extends BaseEntity {
  name: string;
  color: string;
  description: string;
}

export interface Category extends BaseEntity {
  name: string;
  parentId: string | null;
  slug: string;
}

export interface Review extends BaseEntity {
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  read: boolean;
}

export interface Settings extends BaseEntity {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
}

export interface Log extends BaseEntity {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata: Record<string, unknown>;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCommentInput = Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateTagInput = Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateReviewInput = Omit<Review, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateNotificationInput = Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateSettingsInput = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateLogInput = Omit<Log, 'id' | 'createdAt' | 'updatedAt'>;
