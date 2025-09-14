import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { getProducts, createProduct, updateProduct } from '@/services/productService';
import { Product } from '@/types/Product';

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', value: '', quantity: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message || 'Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProduct(
        form.name,
        Number(form.value),
        form.quantity ? Number(form.quantity) : 0
      );
      setForm({ name: '', value: '', quantity: '' });
      fetchProducts();
    } catch (e: any) {
      alert(e.message || 'Erro ao adicionar produto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Gerenciamento de Estoque</Typography>
        <Paper sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <TextField
              label="Nome do Produto"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{ flex: 1, minWidth: 180 }}
            />
            <TextField
              label="Quantidade"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={{ flex: 1, minWidth: 120 }}
            />
            <TextField
              label="Valor do Produto"
              name="value"
              type="number"
              value={form.value}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              required
              sx={{ flex: 1, minWidth: 120 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting || !form.name || !form.value}
              sx={{ height: 56 }}
            >
              {submitting ? 'Adicionando...' : 'Adicionar Produto'}
            </Button>
          </form>
        </Paper>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Valor Unitário (R$)</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{Number(product.value).toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </DashboardLayout>
  );
}
