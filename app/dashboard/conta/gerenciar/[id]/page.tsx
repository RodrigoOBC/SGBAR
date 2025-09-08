'use client';
import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Chip, TextField, Button, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Dados mocados de produtos disponíveis
const produtosDisponiveis = [
  { label: 'Mine Brahma', value: 'Mine Brahma', preco: 50 },
  { label: '51', value: '51', preco: 51 },
  { label: 'Coca Retornavel', value: 'Coca Retornavel', preco: 10 }
];

// Dados mocados de contas (deveria vir de um contexto ou API futuramente)
const contasMock = [
  {
    id: 1,
    name: 'João Silva',
    status: 'aberta',
    valueDebit: 150.0,
    payed: false,
    createAT: '2024-08-01T10:00:00Z',
    closeAT: null,
    items: [
      { item: 'Produto A', quantidade: 2, valor: 50, data: '2024-08-01T10:00:00Z' },
      { item: 'Produto B', quantidade: 1, valor: 50, data: '2024-08-01T10:00:00Z' },
    ],
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    status: 'fechada',
    valueDebit: 200.0,
    payed: true,
    createAT: '2024-07-20T09:00:00Z',
    closeAT: '2024-07-25T15:00:00Z',
    items: [
      { item: 'Produto C', quantidade: 4, valor: 50, data: '2024-07-20T09:00:00Z' },
    ],
  },
  {
    id: 3,
    name: 'Carlos Souza',
    status: 'aberta',
    valueDebit: 75.5,
    payed: false,
    createAT: '2024-08-05T14:30:00Z',
    closeAT: null,
    items: [
      { item: 'Produto D', quantidade: 1, valor: 25.5, data: '2024-08-05T14:30:00Z' },
      { item: 'Produto E', quantidade: 2, valor: 25, data: '2024-08-05T14:30:00Z' },
    ],
  },
];

export default function GerenciarContaPage() {
  const params = useParams();
  const id = Number(params.id);
  let conta = contasMock.find((c) => c.id === id);
  if (!conta && typeof window !== 'undefined') {
    try {
      const dinamicas = JSON.parse(localStorage.getItem('contasDinamicas') || '[]');
      conta = dinamicas.find((c: any) => c.id === id) || null;
    } catch {}
  }

  // Estado para os itens da conta (mockado, mas simula atualização)
  const [itens, setItens] = useState(conta ? conta.items : []);
  // Formulário dinâmico: lista de grupos de campos produto+quantidade
  type FormItem = { produto: string | null; quantidade: number };
  const [formItens, setFormItens] = useState<FormItem[]>([
    { produto: null, quantidade: 1 },
  ]);
  // Lista temporária de novos itens a serem adicionados
  interface ItemConta {
    item: string;
    quantidade: number;
    valor: number;
    data: string;
  }
  const [novosItens, setNovosItens] = useState<ItemConta[]>([]);

  if (!conta) {
    return <Typography variant="h6">Conta não encontrada.</Typography>;
  }

  // Adiciona todos os itens do formulário dinâmico à lista temporária de novos itens
  const handleAdicionarNovoItem = () => {
    const novos: ItemConta[] = formItens
      .filter((f) => f.produto && f.quantidade > 0)
      .map((f) => {
        const produto = produtosDisponiveis.find((p) => p.value === f.produto);
        if (!produto) return null;
        return {
          item: produto.value,
          quantidade: f.quantidade,
          valor: produto.preco,
          data: new Date().toISOString(),
        };
      })
      .filter(Boolean) as ItemConta[];
    if (novos.length === 0) return;
    setNovosItens([...novosItens, ...novos]);
    setFormItens([{ produto: null, quantidade: 1 }]);
  };

  // Adiciona mais um grupo de campos ao formulário dinâmico
  const handleAddFormItem = () => {
    setFormItens([...formItens, { produto: null, quantidade: 1 }]);
  };

  // Remove um grupo de campos do formulário dinâmico
  const handleRemoveFormItem = (idx: number) => {
    setFormItens(formItens.filter((_, i) => i !== idx));
  };

  // Salva todos os novos itens na conta de uma vez
  const handleSalvarTodos = () => {
    if (novosItens.length === 0) return;
    setItens([...itens, ...novosItens]);
    setNovosItens([]);
  };

  // Remove item da lista temporária de novos itens
  const handleRemoverNovoItem = (idx: number) => {
    setNovosItens(novosItens.filter((_, i) => i !== idx));
  };

  // Remove item da conta
  const handleExcluirItem = (idx: number) => {
    setItens(itens.filter((_, i) => i !== idx));
  };

  return (
    <Box component={Container} maxWidth="lg" sx={{ mt: 4 }}>
      {/* Seção resumo da conta */}
      <Box mb={3} p={2} border={1} borderColor="#eee" borderRadius={2}>
        <Typography variant="h6">Resumo da Conta</Typography>
        <Typography><b>Cliente:</b> {conta.name}</Typography>
        <Typography><b>Valor devido:</b> <b>R$ {conta.valueDebit.toFixed(2)}</b></Typography>
        <Typography><b>Status:</b> <Chip label={conta.payed ? 'Paga' : 'Aberta'} color={conta.payed ? 'success' : 'warning'} size="small" /></Typography>
        <Typography><b>Data de abertura:</b> {new Date(conta.createAT).toLocaleDateString('pt-BR')}</Typography>
      </Box>

      {/* Seção de adição de produtos */}
      <Box mb={3} p={2} border={1} borderColor="#eee" borderRadius={2}>
        <Typography variant="subtitle1" gutterBottom>Adicionar produto à conta</Typography>
        {formItens.map((form, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '0 0 75%' }}>
              <Autocomplete
                disablePortal
                options={produtosDisponiveis}
                value={produtosDisponiveis.find((p) => p.value === form.produto) || null}
                onChange={(_, newValue) => {
                  const arr = [...formItens];
                  arr[idx].produto = newValue ? newValue.value : null;
                  setFormItens(arr);
                }}
                renderInput={(params) => <TextField {...params} label="Produto" fullWidth />}
              />
            </Box>
            <Box sx={{ flex: '0 0 25%' }}>
              <TextField
                label="Quantidade"
                type="number"
                value={form.quantidade}
                onChange={(e) => {
                  const arr = [...formItens];
                  arr[idx].quantidade = Number(e.target.value);
                  setFormItens(arr);
                }}
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Box>
            {formItens.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveFormItem(idx)} sx={{ mt: 0.5 }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleAddFormItem} sx={{ minWidth: 48 }}>+
          </Button>
          <Button variant="contained" color="primary" onClick={handleAdicionarNovoItem}>
            Adicionar produto
          </Button>
        </Box>
      </Box>

      {/* Lista temporária de novos itens a serem adicionados */}
      {novosItens.length > 0 && (
        <Box mb={3} p={2} border={1} borderColor="#eee" borderRadius={2}>
          <Typography variant="subtitle2" gutterBottom>Itens a adicionar</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Valor (R$)</TableCell>
                  <TableCell>Remover</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {novosItens.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoverNovoItem(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="success" onClick={handleSalvarTodos}>
            Salvar todos na conta
          </Button>
        </Box>
      )}

      {/* Tabela de itens da conta */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>Itens da Conta</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Data de Adição</TableCell>
                <TableCell>Valor (R$)</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itens.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{item.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleExcluirItem(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
