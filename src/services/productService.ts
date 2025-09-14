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

export async function updateProduct(id: number, value: number, quantity: number): Promise<Product> {
  const response = await axios.put(`${API_URL}/products`, {
    id,
    value,
    quantity,
  });
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  const response =  await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
}