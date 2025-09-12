'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Chip, TextField, Button, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Container, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getAccountById } from '@/services/accountService';
import { ContaCliente, ItemDetalhe } from '@/types/Conta';

export default function GerenciarContaPage() {
  const router = useRouter();
  const idParam = router.query.id;
  const id = Number(Array.isArray(idParam) ? idParam[0] : idParam);

   const [conta, setConta] = useState<ContaCliente | null>(null);
   const [loading, setLoading] = useState(true);

   const refreshAccountData = () => {
     if (id) {
       setLoading(true);
       getAccountById(id)
         .then((data) => {
           setConta(data);
           setLoading(false);
         })
         .catch((error) => {
           console.error(error);
           setLoading(false);
         });
     }
   };

  useEffect(() => {
    if (id) {
      getAccountById(id)
        .then((data) => {
          setConta(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!conta) {
    return (
      <DashboardLayout>
        <Typography variant="h6">Conta não encontrada.</Typography>
      </DashboardLayout>
    );
  }

   // Importa a função de fechar conta
   const { closeAccount } = require('@/services/accountService');
   const [pagando, setPagando] = useState(false);
   const handlePagarConta = async () => {
     if (!conta) return;
     setPagando(true);
     try {
       await closeAccount(conta.id);
       refreshAccountData();
       // Opcional: redirecionar para lista de contas ou mostrar mensagem de sucesso
     } catch (e) {
       alert('Erro ao fechar a conta!');
     } finally {
       setPagando(false);
     }
   };

   return (
     <DashboardLayout>
       <Box component={Container} maxWidth="lg" sx={{ mt: 4 }}>
         <Box mb={3} p={2} border={1} borderColor="#eee" borderRadius={2}>
           <Typography variant="h6">Resumo da Conta</Typography>
           <Typography><b>Cliente:</b> {conta.name}</Typography>
           <Typography><b>Valor devido:</b> <b>R$ {conta.valueDebit.toFixed(2)}</b></Typography>
           <Typography><b>Status:</b> <Chip label={conta.payed ? 'Paga' : 'Aberta'} color={conta.payed ? 'success' : 'warning'} size="small" /></Typography>
           {conta.createAT && <Typography><b>Data de abertura:</b> {new Date(conta.createAT).toLocaleDateString('pt-BR')}</Typography>}
           {/* Botão Pagar conta */}
           <Button
             variant="contained"
             color="success"
             sx={{ mt: 2 }}
             onClick={handlePagarConta}
             disabled={conta.payed || pagando}
           >
             {pagando ? 'Processando...' : 'Pagar conta'}
           </Button>
         </Box>
        
        <Box mb={3} p={2} border={1} borderColor="#eee" borderRadius={2}>
           <Typography variant="subtitle1" gutterBottom>Adicionar produto à conta</Typography>
           {/* Formulário de adicionar produto */}
           {/* @ts-ignore */}
           {id && (
             <React.Suspense fallback={<div>Carregando formulário...</div>}>
               {/* @ts-ignore */}
               {typeof window !== 'undefined' && (
                 require('@/components/conta/AddProductForm').default ? (
                   React.createElement(require('@/components/conta/AddProductForm').default, { accountId: id, onProductsAdded: refreshAccountData })
                 ) : null
               )}
             </React.Suspense>
           )}
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>Itens da Conta</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                 <TableRow>
                   <TableCell>Item</TableCell>
                   <TableCell>Quantidade</TableCell>
                   <TableCell>Data de Adição</TableCell>
                   <TableCell>Subtotal (R$)</TableCell>
                   <TableCell>Ações</TableCell>
                 </TableRow>
              </TableHead>
              <TableBody>
                 {conta.items.map((item) => (
                   <TableRow key={item.item_id}>
                     <TableCell>{item.product_name}</TableCell>
                     <TableCell>{item.quantity}</TableCell>
                     <TableCell>{item.add_at ? new Date(item.add_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                     <TableCell>{item.subtotal?.toFixed(2)}</TableCell>
                     <TableCell>
                       <IconButton color="error" disabled>
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
    </DashboardLayout>
  );
}
