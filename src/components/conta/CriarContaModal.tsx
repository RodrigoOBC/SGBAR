'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';
import { getAllClients, createClient } from '@/services/clientService';
import { createAccount } from '@/services/accountService';
import { Cliente } from '@/types/Client';

import { ContaCliente } from '@/types/Conta';

interface CriarContaModalProps {
  open: boolean;
  onClose: () => void;
  onContaCriada?: (conta: ContaCliente) => void;
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

export default function CriarContaModal({ open, onClose, onContaCriada }: CriarContaModalProps) {
  const router = useRouter();
   const [clientes, setClientes] = useState<Cliente[]>([]);
   const [clienteInput, setClienteInput] = useState('');
   const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | string | null>(null);
   const [mesa, setMesa] = useState('');
   const [loading, setLoading] = useState(false);


   // Carrega clientes da API
   useEffect(() => {
     if (open) {
       getAllClients()
         .then(setClientes)
         .catch(() => setClientes([]));
     }
   }, [open]);

   const handleSalvar = async () => {
     setLoading(true);
     let nomeFinal = '';
     let clienteId: number | null = null;
     let telefone = '';
     if (typeof clienteSelecionado === 'string') {
       nomeFinal = clienteSelecionado.trim();
     } else if (clienteSelecionado && typeof clienteSelecionado === 'object') {
       nomeFinal = clienteSelecionado.name;
       clienteId = clienteSelecionado.id;
       telefone = clienteSelecionado.telefone;
     } else {
       nomeFinal = clienteInput.trim();
     }
     if (!nomeFinal) {
       setLoading(false);
       return;
     }

     try {
       // Se não temos clienteId, criamos o cliente
       if (!clienteId) {
         // Para simplificar, telefone vazio
         const novoCliente = await createClient(nomeFinal, telefone);
         clienteId = novoCliente.id;
       }
       const mesaFinal = mesa.trim() === '' ? '0' : mesa.trim();
       const novaConta = await createAccount(clienteId, mesaFinal);
       setLoading(false);
       onClose();
       if (typeof onContaCriada === 'function') {
         onContaCriada(novaConta);
       }
     } catch (e) {
       setLoading(false);
       alert('Erro ao criar conta ou cliente.');
     }
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
           getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
           isOptionEqualToValue={(option, value) => {
             if (typeof option === 'string' || typeof value === 'string') return option === value;
             return option.id === value.id;
           }}
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
           <Button onClick={handleSalvar} variant="contained" color="primary" disabled={loading || (!clienteSelecionado && !clienteInput)}>
             {loading ? 'Criando...' : 'Criar conta'}
           </Button>
        </Box>
      </Box>
    </Modal>
  );
}
