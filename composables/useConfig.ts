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

  function getNbVoiesCyclables(): number {
    return config.nbVoiesCyclables;
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
    displayQuality,
    displayQualityOnHomePage,
    displayCounters,
    hasFeature,
  };
};
