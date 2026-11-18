// Serves /site the way Cloudflare Pages does (extensionless URLs, _redirects, 404.html): http://localhost:4190
process.env.SITE_DIR = 'site';
if (!process.argv[2]) process.argv[2] = '4190';
await import('./serve.mjs');
