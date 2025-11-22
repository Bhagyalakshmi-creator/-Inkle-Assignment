import { TaxRecord, Country, UpdateTaxPayload } from '../types';

const TAXES_API_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io/taxes';
const COUNTRIES_API_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io/countries';

export const fetchTaxes = async (): Promise<TaxRecord[]> => {
  const response = await fetch(TAXES_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch taxes');
  }
  return response.json();
};

export const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(COUNTRIES_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
};

export const updateTaxRecord = async (id: string, data: UpdateTaxPayload): Promise<TaxRecord> => {
  const response = await fetch(`${TAXES_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update tax record');
  }
  return response.json();
};