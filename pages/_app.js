// _app.js or _app.tsx

import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
       <Head>
        <title>InventoTrack</title>
        <link rel="icon" href="/icon.png" />
        </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
