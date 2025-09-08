import { Container, Typography, Button } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Sistema de Gerenciamento de Estoque e Vendas
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bem-vindo! Gerencie seu estoque e vendas de forma simples e eficiente.
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Entrar
      </Button>
    </Container>
  );
}
