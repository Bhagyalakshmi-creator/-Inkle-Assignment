export interface TaxRecord {
  id: string;
  name: string;
  country: string;
  createdAt?: string;
  avatar?: string;
}

export interface Country {
  id: string;
  name: string;
  code?: string;
}

export interface UpdateTaxPayload {
  name: string;
  country: string;
}