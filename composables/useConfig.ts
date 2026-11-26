import config from '~/config.json';

export type SiteFeature = keyof typeof config.features;
export type NetworkId = (typeof config.networks)[number]['id'];
export type LineDefinition = { number: number; code: string; network: string };

const lines = config.lines as LineDefinition[];

/** Code affiché d'une ligne (ex. 20 -> « V20 », 107 -> « VD7 ») */
export function getLineCode(line: number | string | undefined | null): string {
  const number = Number(line);
  return lines.find((l) => l.number === number)?.code ?? String(line ?? '');
}

/** Numéro interne d'une ligne à partir de son code (« v20 » -> 20) */
export function getLineNumberFromCode(code: string | undefined | null): number | undefined {
  if (!code) return undefined;
  return lines.find((l) => l.code.toLowerCase() === code.toLowerCase())?.number;
}

/** Réseau d'appartenance par défaut d'une ligne (vif, departemental, pold, communal…) */
export function getLineNetwork(line: number | undefined | null): string | undefined {
  return lines.find((l) => l.number === Number(line))?.network;
}

export function getNetworkLabel(id: string): string {
  return config.networks.find((n) => n.id === id)?.label ?? id;
}

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

  /** Numéros internes des lignes du réseau */
  function getLineNumbers(): number[] {
    return lines.map((l) => l.number);
  }

  function getNbVoiesCyclables(): number {
    return lines.length;
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
    getLineCode,
    getLineNumberFromCode,
    getLineNetwork,
    getNetworkLabel,
    displayQuality,
    displayQualityOnHomePage,
    displayCounters,
    hasFeature,
  };
};
