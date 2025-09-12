This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Frontend (Next.js)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Estrutura migrada para Pages Router (src/pages). Página inicial em `src/pages/index.tsx`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Backend (Express)

Boilerplate em `backend/`:
- `server.ts` inicializa API em porta 4000 por padrão
- Rota de saúde: `GET /api/health`
- Logger: pino (pretty no modo dev)

Rodar backend isolado:
```bash
node -r ts-node/register backend/server.ts
```
(Adicionar ts-node como dependência se desejar executar em TS direto.)

Variáveis de ambiente (ver `.env.example`):
- `NEXT_PUBLIC_API_BASE_URL` para chamadas no frontend
- `BACKEND_PORT` (opcional) para alterar porta

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
