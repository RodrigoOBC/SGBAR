import React, { useEffect, useState } from 'react';
import { TextField, Button, Autocomplete, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getProducts } from '../../services/productService';
import { addItemToAccount } from '../../services/accountService';
import { Product } from '../../types/Product';

interface AddProductFormProps {
  accountId: number;
  onProductsAdded?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ accountId, onProductsAdded }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState([
    { product: null as Product | null, quantity: 1 }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddLine = () => {
    setItems([...items, { product: null, quantity: 1 }]);
  };

  const handleRemoveLine = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleChangeProduct = (idx: number, value: Product | null) => {
    setItems(items.map((item, i) => i === idx ? { ...item, product: value } : item));
  };

  const handleChangeQuantity = (idx: number, value: number) => {
    setItems(items.map((item, i) => i === idx ? { ...item, quantity: value } : item));
  };

  const handleAddProducts = async () => {
    setLoading(true);
    try {
      for (const item of items) {
        if (item.product && item.quantity > 0) {
          await addItemToAccount(accountId, item.product.id, item.quantity);
        }
      }
      setItems([{ product: null, quantity: 1 }]);
      if (typeof onProductsAdded === 'function') {
        onProductsAdded();
      }
    } catch (e) {
      alert('Erro ao adicionar produto(s)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {items.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" gap={2}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            value={item.product}
            onChange={(_, value) => handleChangeProduct(idx, value)}
            renderInput={(params) => <TextField {...params} label="Produto" variant="outlined" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Quantidade"
            type="number"
            value={item.quantity}
            onChange={(e) => handleChangeQuantity(idx, Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ flex: 1 }}
          />
          {items.length > 1 && (
            <IconButton color="error" onClick={() => handleRemoveLine(idx)}>
              <span role="img" aria-label="remover">🗑️</span>
            </IconButton>
          )}
        </Box>
      ))}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton color="primary" onClick={handleAddLine} disabled={loading}>
          <AddIcon />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProducts}
          disabled={loading || items.some(item => !item.product || item.quantity < 1)}
        >
          Adicionar Produtos
        </Button>
      </Box>
    </Box>
  );
};

export default AddProductForm;
