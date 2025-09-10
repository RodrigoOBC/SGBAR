'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box, Button } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ContaDetalheModal from '@/components/conta/ContaDetalheModal';
import CriarContaModal from '@/components/conta/CriarContaModal';

interface ItemDetalhe {
  item: string;
  quantidade: number;
  valor: number;
}

interface ContaCliente {
  id: number;
  name: string;
  status: string;
  valueDebit: number;
  payed: boolean;
  createAT: string;
  closeAT: string | null;
  items: ItemDetalhe[];
}

const contasMock: ContaCliente[] = [
  {
    id: 1,
    name: 'João Silva',
    status: 'aberta',
    valueDebit: 150.0,
    payed: false,
    createAT: '2024-08-01T10:00:00Z',
    closeAT: null,
    items: [
      { item: 'Produto A', quantidade: 2, valor: 10 },
      { item: 'Produto B', quantidade: 1, valor: 50 },
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
      { item: 'Produto C', quantidade: 4, valor: 50 },
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
      { item: 'Produto D', quantidade: 1, valor: 25.5 },
      { item: 'Produto E', quantidade: 2, valor: 25 },
    ],
  },
];

export default function ContaPage() {
  const [contas, setContas] = useState<ContaCliente[]>(contasMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<ContaCliente | null>(null);
  const [criarOpen, setCriarOpen] = useState(false);

  // Carrega contas dinâmicas do localStorage (mock persistência)
  useEffect(() => {
    try {
      const dinamicas = JSON.parse(localStorage.getItem('contasDinamicas') || '[]');
      if (Array.isArray(dinamicas) && dinamicas.length > 0) {
        setContas([...contasMock, ...dinamicas]);
      }
    } catch (e) {
      console.warn('Falha ao carregar contas dinâmicas', e);
    }
  }, []);

  const handleOpenModal = (conta: ContaCliente) => {
    setContaSelecionada(conta);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setContaSelecionada(null);
  };

  const handleCloseCriar = () => {
    setCriarOpen(false);
    // Recarrega contas após criação
    try {
      const dinamicas = JSON.parse(localStorage.getItem('contasDinamicas') || '[]');
      if (Array.isArray(dinamicas)) {
        setContas([...contasMock, ...dinamicas]);
      }
    } catch {}
  };

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" gutterBottom sx={{ m: 0 }}>
            Contas dos Clientes
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setCriarOpen(true)}>Criar conta</Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {contas.map((conta) => (
            <Box key={conta.id} flex="1 1 300px" minWidth={280} maxWidth={400}>
              <Card
                sx={{ cursor: 'pointer', background: conta.payed ? '#e8f5e9' : '#fffde7' }}
                onClick={() => handleOpenModal(conta)}
                elevation={3}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {conta.name}
                  </Typography>
                  <Typography variant="body1">
                    Valor devido: <b>R$ {conta.valueDebit.toFixed(2)}</b>
                  </Typography>
                  <Typography variant="body2">
                    Data de abertura: {new Date(conta.createAT).toLocaleDateString('pt-BR')}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={conta.payed ? 'Paga' : 'Aberta'}
                      color={conta.payed ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        <ContaDetalheModal open={modalOpen} onClose={handleCloseModal} conta={contaSelecionada} />
        <CriarContaModal open={criarOpen} onClose={handleCloseCriar} />
      </Box>
    </DashboardLayout>
  );
}
