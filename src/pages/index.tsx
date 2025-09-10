import { Container, Typography, Button } from '@mui/material';

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
