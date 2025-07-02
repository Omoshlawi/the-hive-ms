export type Person = {
  id: string;
  firstName?: string;
  lastName?: string;
  surname?: string;
  userId: string;
  avatarUrl?: string;
  phoneNumber: string;
  email: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  name?: string;
};

export type Listing = {
  id: string;
  propertyId: string;
  property: Property;
  organizationId: string;
  organization: Organization;
  tags: string[];
  status: string;
  title: string;
  description: any;
  type: string;
  coverImage: string;
  price: string;
  listedDate: any;
  expiryDate: string;
  featured: boolean;
  contactPersonId: string;
  metadata: Metadata;
  views: number;
  createdBy: string;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
  saleDetails: any;
};

export interface Property {
  id: string;
  name: string;
  address: Address;
  thumbnail: string;
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

export interface Organization {
  id: string;
  name: string;
  description: string;
}

export interface Metadata {
  amenities: string[];
  attributes: Attributes;
  categories: string[];
}

export interface Attributes {}
