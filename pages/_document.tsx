import { Head, Html, Main, NextScript } from 'next/document';
function generateCSP() {
  const policy = {
    'default-src': ['https://*.tensorplex.ai', 'https://*.tensorplex.dev'],
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      'https://cdnjs.cloudflare.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
    ], // nonce to be implemented
    'style-src': ["'self'", "'unsafe-inline'"], // nonce to be implemented
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'"],
    'frame-src': ['blob: data:', 'https://verify.walletconnect.org'],
    'connect-src': [
      "'self'",
      'https://*.tensorplex.ai',
      'https://*.tensorplex.dev',
      'wss://*.walletconnect.com',
      'https://*.walletconnect.com',
    ],
    'worker-src': ["'self'", 'blob:'],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
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
      <Head />
      <meta httpEquiv="Content-Security-Policy" content={generateCSP()} />
      <body style={{ backgroundColor: '#FFFFF4' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
