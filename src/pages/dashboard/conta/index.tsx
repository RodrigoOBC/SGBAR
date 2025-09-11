'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, CircularProgress, Alert } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ContaDetalheModal from '@/components/conta/ContaDetalheModal';
import CriarContaModal from '@/components/conta/CriarContaModal';
import { ContaCliente } from '@/types/Conta';
import { getAllAccounts } from '@/services/accountService';

export default function ContaPage() {
  const [contas, setContas] = useState<ContaCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<ContaCliente | null>(null);
  const [criarOpen, setCriarOpen] = useState(false);

  // Busca contas da API
  const fetchContas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAccounts();
      setContas(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao buscar contas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
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
    fetchContas(); // Recarrega contas após criação
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
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
                      Data de abertura: {conta.createAT ? new Date(conta.createAT).toLocaleDateString('pt-BR') : '-'}
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
        )}
        <ContaDetalheModal open={modalOpen} onClose={handleCloseModal} conta={contaSelecionada} />
        <CriarContaModal open={criarOpen} onClose={handleCloseCriar} />
      </Box>
    </DashboardLayout>
  );
}
