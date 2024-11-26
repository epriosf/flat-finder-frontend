export interface User {
  firstName: string;
  lastName: string;
  profile: string;
  email: string;
  birthday: Date;
  role: string;
  id: string;
  profileImage: string;
  isAdmin: boolean;
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
