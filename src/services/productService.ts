import axios from 'axios';
import { Product } from '../types/Product';

const API_URL = 'http://localhost:8000';

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
}

export async function createProduct(name: string, value: number, quantity?: number): Promise<Product> {
  const response = await axios.post(`${API_URL}/products`, {
    name,
    value,
    quantity: quantity ?? 0,
  });
  return response.data;
}
