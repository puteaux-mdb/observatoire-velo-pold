import config from '~/config.json';
import type { LineStringFeature } from '~/types';
import { getLineCode, getLineNumberFromCode } from '~/composables/useConfig';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const useUrl = () => {
  function withoutTrailingSlash(path: string): string {
    return path.endsWith('/') ? path.slice(0, -1) : path;
  }

  /** Adresse de la page d'une ligne : /v20, /vd7, /vp1… */
  function getVoieCyclablePath(line: number) {
    return `/${getLineCode(line).toLowerCase()}`;
  }

  /** Reconnaît l'adresse d'une ligne ; le groupe 1 contient son code */
  function getVoieCyclableRegex() {
    const codes = config.lines
      .map((l) => l.code.toLowerCase())
      .sort((a, b) => b.length - a.length)
      .map(escape);
    return new RegExp(`^/(${codes.join('|') || 'aucune-ligne'})(?=$|[/#?])`, 'i');
  }

  /** Numéro interne de la ligne correspondant à une adresse, ou chaîne vide */
  function getLineFromPath(path: string): string {
    const code = path.match(getVoieCyclableRegex())?.[1];
    const number = getLineNumberFromCode(code);
    return number === undefined ? '' : String(number);
  }

  function extractLineAndAnchorFromPath(path: string) {
    // Exemple : /v20#section-2
    const [pathNoAnchor, anchor] = path.split('#');
    const line = getLineFromPath(pathNoAnchor ?? '');
    if (line) {
      return { line, anchor };
    }
    return { anchor };
  }

  function getSectionDetailsUrl(properties: LineStringFeature['properties']): string {
    if (properties.link) {
      return properties.link;
    }
    return getVoieCyclablePath(properties.line);
  }

  return {
    withoutTrailingSlash,
    getVoieCyclablePath,
    getSectionDetailsUrl,
    getVoieCyclableRegex,
    getLineFromPath,
    extractLineAndAnchorFromPath,
  };
};
