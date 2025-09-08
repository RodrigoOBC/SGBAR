'use client';
import * as React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

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

interface ContaDetalheModalProps {
  open: boolean;
  onClose: () => void;
  conta: ContaCliente | null;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #1976d2',
  boxShadow: 24,
  p: 4,
};

export default function ContaDetalheModal({ open, onClose, conta }: ContaDetalheModalProps) {
  if (!conta) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-conta-title">
      <Box sx={style}>
        <Typography id="modal-conta-title" variant="h6" component="h2" gutterBottom>
          Detalhes da Conta
        </Typography>
        <Typography variant="subtitle1"><b>Cliente:</b> {conta.name}</Typography>
        <Typography variant="subtitle1"><b>Valor devido:</b> <span style={{fontWeight: 'bold'}}>R$ {conta.valueDebit.toFixed(2)}</span></Typography>
        <Typography variant="subtitle1"><b>Status:</b> <Chip label={conta.payed ? 'Paga' : 'Aberta'} color={conta.payed ? 'success' : 'warning'} size="small" /></Typography>
        <Typography variant="subtitle1"><b>Data de abertura:</b> {new Date(conta.createAT).toLocaleDateString('pt-BR')}</Typography>
        {conta.closeAT && <Typography variant="subtitle1"><b>Data de fechamento:</b> {new Date(conta.closeAT).toLocaleDateString('pt-BR')}</Typography>}
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>Itens detalhados:</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Valor (R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conta.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" color="primary">Fechar</Button>
          <Button onClick={() => {
            if (conta) {
              window.location.href = `/dashboard/conta/gerenciar/${conta.id}`;
            }
          }} variant="contained" color="primary">Gerenciar Conta</Button>
        </Box>
      </Box>
    </Modal>
  );
}
