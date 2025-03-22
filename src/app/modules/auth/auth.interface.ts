export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string; // Optional field
  address?: string; 
  profilePic?: string; 
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string; // Optional field
  address?: string; 
  profilePic?: string; 
}
