import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from '@/components/theme/ThemeRegistry';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}
