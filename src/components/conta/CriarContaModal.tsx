'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';

interface CriarContaModalProps {
  open: boolean;
  onClose: () => void;
}

interface ContaNova {
  id: number;
  name: string;
  status: string;
  valueDebit: number;
  payed: boolean;
  createAT: string;
  closeAT: string | null;
  items: any[];
  mesa?: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
};

export default function CriarContaModal({ open, onClose }: CriarContaModalProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState<string[]>([]);
  const [clienteInput, setClienteInput] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [mesa, setMesa] = useState('');

  // Carrega clientes mockados + localStorage
  useEffect(() => {
    const base = ['João Silva', 'Maria Oliveira', 'Carlos Souza'];
    const armazenados = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('clientesExtra') || '[]') : [];
    const full = Array.from(new Set([...base, ...armazenados]));
    setClientes(full);
  }, [open]);

  const handleSalvar = () => {
    const nomeFinal = (clienteSelecionado || clienteInput || '').trim();
    if (!nomeFinal) return;

    // Se for novo cliente, armazena para persistir futuramente
    if (!clientes.includes(nomeFinal)) {
      const extras = JSON.parse(localStorage.getItem('clientesExtra') || '[]');
      extras.push(nomeFinal);
      localStorage.setItem('clientesExtra', JSON.stringify(extras));
    }

    const mesaFinal = mesa.trim() === '' ? 'Balcão' : mesa.trim();

    // Mock criação da conta
    const contasExistentes: ContaNova[] = JSON.parse(localStorage.getItem('contasDinamicas') || '[]');
    const novoId = contasExistentes.length > 0 ? Math.max(...contasExistentes.map(c => c.id)) + 1 : 100; // começa em 100 para não conflitar

    const novaConta: ContaNova = {
      id: novoId,
      name: nomeFinal + (mesaFinal ? ` - Mesa ${mesaFinal}` : ''),
      status: 'aberta',
      valueDebit: 0,
      payed: false,
      createAT: new Date().toISOString(),
      closeAT: null,
      items: [],
      mesa: mesaFinal,
    };

    localStorage.setItem('contasDinamicas', JSON.stringify([...contasExistentes, novaConta]));

    // Redireciona para a página de gerenciamento
    onClose();
    router.push(`/dashboard/conta/gerenciar/${novoId}`);
  };

  const handleClose = () => {
    setClienteInput('');
    setClienteSelecionado(null);
    setMesa('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-criar-conta-title">
      <Box sx={style}>
        <Typography id="modal-criar-conta-title" variant="h6" gutterBottom>
          Criar nova conta
        </Typography>
        <Autocomplete
          freeSolo
          options={clientes}
            value={clienteSelecionado}
            onChange={(_, newValue) => setClienteSelecionado(newValue)}
            inputValue={clienteInput}
            onInputChange={(_, newInput) => setClienteInput(newInput)}
            renderInput={(params) => <TextField {...params} label="Cliente" placeholder="Digite ou selecione" fullWidth />}
            sx={{ mb: 2 }}
        />
        <TextField
          label="Mesa (opcional)"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Button onClick={handleClose} variant="outlined" color="primary">Cancelar</Button>
          <Button onClick={handleSalvar} variant="contained" color="primary" disabled={!clienteSelecionado && !clienteInput}>
            Criar conta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
