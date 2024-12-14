import { Flat } from './FlatInterface';
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
  birthday: Date;
  role: string;
  profileImage: string;
  isAdmin: boolean;
  favouriteFlats: Flat[];
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
  profile: string;
  isAdmin: boolean;
}

export interface UserMessage {
  firstName: string;
  lastName: string;
  email: string;
  profile: string;
}
