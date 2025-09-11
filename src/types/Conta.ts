export interface ItemDetalhe {
  item_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  subtotal: number;
  add_at: string | null;
}

export interface ContaCliente {
  id: number;
  name: string;
  status: string;
  valueDebit: number;
  payed: boolean;
  createAT: string | null;
  closeAT: string | null;
  items: ItemDetalhe[];
}
