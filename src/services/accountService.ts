import { ContaCliente, ItemDetalhe } from "@/types/Conta";

const API_URL = "http://127.0.0.1:8000";

function mapApiToContaCliente(apiData: any): ContaCliente {
  return {
    id: apiData.account_id,
    name: apiData.client_name,
    status: apiData.sataus, // Corrigido conforme o typo da API
    valueDebit: apiData.total,
    payed: apiData.sataus === "CLOSED",
    createAT: apiData.created_at,
    closeAT: apiData.closed_at,
    items: (apiData.items || []).map((item: any): ItemDetalhe => ({
      item_id: item.item_id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      subtotal: item.subtotal,
      add_at: item.add_at,
    })),
  };
}

export async function getAllAccounts(): Promise<ContaCliente[]> {
  const response = await fetch(`${API_URL}/accounts`);
  if (!response.ok) {
    throw new Error("Erro ao buscar contas");
  }
  const data = await response.json();
  console.log(data);
  return data.map(mapApiToContaCliente);
}

export async function getAccountById(id: number): Promise<ContaCliente> {
  const response = await fetch(`${API_URL}/accounts/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar conta");
  }
  const data = await response.json();
  return mapApiToContaCliente(data);
}

export async function addItemToAccount(accountId: number, productId: number, quantity: number): Promise<void> {
  const response = await fetch(`${API_URL}/accounts/add_item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_id: accountId, product_id: productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar produto à conta');
  }
}

export async function createAccount(customerId: number, tableNumber: string): Promise<ContaCliente> {
  const response = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, table_number: tableNumber }),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar conta');
  }
  const data = await response.json();
  return mapApiToContaCliente(data);
}

export async function closeAccount(accountId: number): Promise<void> {
  const response = await fetch(`${API_URL}/accounts/${accountId}/close`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Erro ao fechar a conta');
  }
}
