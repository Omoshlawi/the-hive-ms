export interface Property {
  id: string;
  name: string;
  description: any;
  thumbnail: string;
  organizationId: string;
  organization?: Organization;
  addressId: string;
  address?: Address;
  createdBy: string;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
}

export interface Address {
  id: string;
  name: string;
  ward: string;
  county: string;
  village?: string;
  landmark: string;
  latitude?: string;
  metadata?: Record<string, any>;
  longitude?: string;
  subCounty: string;
  postalCode: string;
  description: string;
}
