import { Cliente } from '@/types/Client';

const API_URL = 'http://127.0.0.1:8000';

export async function getAllClients(): Promise<Cliente[]> {
  const response = await fetch(`${API_URL}/clients`);
  if (!response.ok) {
    throw new Error('Erro ao buscar clientes');
  }
  return response.json();
}

export async function createClient(name: string, telefone: string): Promise<Cliente> {
  telefone = telefone || '21993903683';
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, telefone }),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar cliente');
  }
  return response.json();
}
