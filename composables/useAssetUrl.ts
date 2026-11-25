/**
 * Préfixe un chemin absolu ("/logo.svg") avec le baseURL de l'application,
 * pour que le site fonctionne aussi dans un sous-dossier (ex. GitHub Pages).
 * Les URL complètes (https://…) sont renvoyées telles quelles.
 * Fonctionne aussi hors contexte Nuxt (popups de la carte).
 */
function getBaseURL(): string {
  try {
    return useRuntimeConfig().app.baseURL || '/';
  } catch {
    const nuxtData = (globalThis as { __NUXT__?: { config?: { app?: { baseURL?: string } } } }).__NUXT__;
    return nuxtData?.config?.app?.baseURL || '/';
  }
}

export const useAssetUrl = () => {
  const base = getBaseURL().replace(/\/$/, '');
  return (path: string) => (path && path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path);
};
