export type Address = {
  id: string;
  name: string;
  description: string;
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  landmark: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  metadata?: string;
};

export type OrganizationMembership = {
    id: string;
    organizationId: string;
    organization: {
      id: string;
      name: string;
      description: string;
    };
  }