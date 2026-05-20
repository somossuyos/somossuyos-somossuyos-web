import { META_PIXEL_NOSCRIPT_IMAGE_SRC } from '@/src/lib/analytics/metaPixel';

/** Fallback oficial Meta cuando JavaScript está desactivado (va en <body>). */
export default function MetaPixelNoscript() {
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        alt=""
        src={META_PIXEL_NOSCRIPT_IMAGE_SRC}
      />
    </noscript>
  );
}
