const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const buildArtFallbackDataUri = (title = 'Artwork') => {
  const safeTitle = escapeXml(title || 'Artwork');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f5f5f4"/>
      <stop offset="1" stop-color="#e7e5e4"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect x="72" y="120" width="656" height="760" fill="#ffffff" opacity="0.55" rx="24"/>
  <text x="400" y="520" text-anchor="middle" font-family="ui-serif, Georgia, 'Times New Roman', serif" font-size="34" fill="#44403c">
    ${safeTitle}
  </text>
  <text x="400" y="570" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="14" letter-spacing="3" fill="#78716c">
    IMAGE UNAVAILABLE
  </text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const setFallbackOnImageError = (event, title) => {
  const target = event?.currentTarget;
  if (!target) return;

  target.onerror = null;
  target.src = buildArtFallbackDataUri(title);
};

