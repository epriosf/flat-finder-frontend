import { User } from './UserInterface';
export interface Flat {
  _id: string;
  city: string;
  streetName: string;
  streetNumber: number | null;
  areaSize: number | null;
  hasAc: boolean;
  yearBuilt: number | null;
  rentPrice: number | null;
  dateAvailable: [Date] | null;
  ownerId: User;
  rooms: number | null;
  bathrooms: number | null;
}

// export interface FlatFilter {
//   flatId: string;
//   areaSize: number | null; // Allow null if your data can have null values
//   city: string | null;
//   price: number | null;
// }

export interface FlatOrderBy {
  city: string;
  price: number;
  area: number;
}
