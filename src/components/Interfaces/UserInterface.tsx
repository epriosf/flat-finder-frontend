import { Flat } from './FlatInterface';
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  role: string;
  profileImage: string;
  isAdmin: boolean;
  favouriteFlats: string[];
}
export interface UserOrderBy {
  email: string;
  firstName: string;
  lastName: string;
}

//User Type
export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date;
  profileImage: string;
  isAdmin: boolean;
}

export interface UserMessage {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}
export interface FlatsResponse {
  flats: Flat[];
  pagination: {
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface UserDetail {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  isAdmin: boolean;
  favouriteFlats: string[]; // Array of favourite flat IDs
  role: string;
  flatsCount: number; // Number of flats created by the user
}
