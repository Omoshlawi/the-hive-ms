export interface Property {
  id: string;
  name: string;
  thumbnail: string;
  address: Address;
  addressId: string;
  categories: Array<{ category: Category }>;
  amenities: Array<{ amenity: Amenity }>;
  attributes: Array<Attribute>;
}

export interface Address {
  id: string;
  name: string;
  ward: string;
  county: string;
  village: any;
  landmark: string;
  latitude: any;
  metadata: any;
  longitude: any;
  subCounty: string;
  postalCode: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Amenity {
  id: string;
  name: string;
}

export interface Attribute {
  value: string;
  attribute: AttributeType;
}

export interface AttributeType {
  id: string;
  name: string;
}

export type ListingType = "sale" | "rental" | "lease" | "auction";
