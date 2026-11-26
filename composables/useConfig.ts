import config from '~/config.json';

export type SiteFeature = keyof typeof config.features;

export const useConfig = () => {
  function getRevName(gram: 'plural' | 'singular' = 'plural'): string {
    return config.revName[gram];
  }

  function getAssoName(): string {
    return config.assoName;
  }

  function getAssoLink(): string {
    return config.assoLink;
  }

  /** Numéros des lignes du réseau (ex. [4, 20] pour V4 et V20) */
  function getLineNumbers(): number[] {
    return config.lines;
  }

  function getNbVoiesCyclables(): number {
    return config.lines.length;
  }

  function displayQuality(): boolean {
    return config.qualityDisplay;
  }

  function displayQualityOnHomePage(): boolean {
    return config.qualityDisplayOnHomePage;
  }

  function displayCounters(): boolean {
    return config.countersDisplay ?? false;
  }

  /** Active/désactive une rubrique du site (plan officiel, blog, compteurs voiture, actualités) */
  function hasFeature(feature: SiteFeature): boolean {
    return Boolean(config.features?.[feature]);
  }

  return {
    config,
    getRevName,
    getAssoName,
    getAssoLink,
    getNbVoiesCyclables,
    getLineNumbers,
    displayQuality,
    displayQualityOnHomePage,
    displayCounters,
    hasFeature,
  };
};
