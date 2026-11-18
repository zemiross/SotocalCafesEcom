// Builds the static pre-launch site into /site (real data, no shop). Wrapper so it works the same on Windows and macOS.
// Optional: LEAD_ENDPOINT_URL=https://… (needs store-setup/legal/privacy-policy.html) turns the B2B form on.
process.env.SITE = 'static';
await import('./build-prototype.mjs');
