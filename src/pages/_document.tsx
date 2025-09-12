import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">      
      <Head>
        <meta name="description" content="Sistema de Gerenciamento de Estoque e Vendas" />
        <link rel="icon" href="/favicon.ico" />
        <title>Sistema de Gestão</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
