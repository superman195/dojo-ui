import { Head, Html, Main, NextScript } from 'next/document';
function generateCSP() {
  const policy = process.env.NEXT_PUBLIC_BACKEND_URL?.includes('localhost')
    ? ''
    : {
        'default-src': ['https://*.tensorplex.ai', 'https://*.tensorplex.dev'],
        'script-src': [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          'https://cdnjs.cloudflare.com',
          'https://cdn.jsdelivr.net',
          'https://unpkg.com',
          'https://*.googletagmanager.com',
        ], // nonce to be implemented
        'style-src': ["'self'", "'unsafe-inline'"], // nonce to be implemented
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'"],
        'frame-src': ['blob: data:', 'https://verify.walletconnect.org', "'self'"],
        'connect-src': [
          "'self'",
          'https://*.tensorplex.ai',
          'https://*.dojo.network',
          'https://*.tensorplex.dev',
          'wss://*.walletconnect.com',
          'https://*.walletconnect.com',
          'https://*.google-analytics.com',
        ],
        'worker-src': ["'self'", 'blob:'],
        'media-src': ["'self'", 'blob: data:'],
        'object-src': ["'self'"],
        'child-src': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': [],
        'block-all-mixed-content': [],
      };

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <meta
        name="description"
        content="Improve Decentralized AI Multimodal model through Crowd Sourcing with Dojo Network. Support Open Source Models (Bittensor Subnet, etc)"
      ></meta>
      <meta httpEquiv="Content-Security-Policy" content={generateCSP()} />
      <body style={{ backgroundColor: '#FFFFF4' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
