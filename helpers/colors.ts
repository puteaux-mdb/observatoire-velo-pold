/**
 * Couleur de texte lisible (blanc ou quasi-noir) sur un fond de couleur donné.
 * Utile pour les pastilles de lignes VIF dont certaines couleurs sont claires (V2, V6, V7, V10).
 */
export function getContrastTextColor(background: string | undefined): string {
  const hex = (background || '').replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return '#ffffff';
  }
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.45 ? '#1f2937' : '#ffffff';
}
