import type { LaneStatus } from '~/types';

/**
 * Définition centrale des états d'avancement d'un tronçon.
 *
 * - render : style utilisé sur la carte (trait plein, travaux, pointillés, semi-transparent, croix)
 * - group  : regroupement utilisé pour les statistiques (barre d'avancement, tableau de bord)
 * - mapText: texte écrit le long du tracé (pour les styles « variante » et « croix »)
 */
export type StatusRender = 'done' | 'wip' | 'planned' | 'variante' | 'variante-postponed' | 'postponed';
export type StatusGroup = 'done' | 'wip' | 'planned' | 'postponed';

type StatusDefinition = {
  label: string; // libellé au masculin (un tronçon)
  render: StatusRender;
  group: StatusGroup;
  mapText?: string;
  badgeClass: string;
};

const BADGE_DONE = 'text-white bg-lvv-blue-600 rounded-xl px-2 w-fit';
const BADGE_WIP = 'text-lvv-blue-600 rounded-xl px-2 border border-dashed border-lvv-blue-600';
const BADGE_PLANNED = 'text-lvv-blue-600 rounded-xl px-2 border border-lvv-blue-600';
const BADGE_STUDY = 'text-gray-900 bg-gray-200 rounded-xl px-2';
const BADGE_BLOCKED = 'text-white bg-lvv-pink rounded-xl px-2';

export const STATUSES: Record<LaneStatus, StatusDefinition> = {
  // états de l'observatoire POLD, dans l'ordre d'avancement
  'to-define': {
    label: 'à définir',
    render: 'variante',
    group: 'planned',
    mapText: 'à définir',
    badgeClass: BADGE_STUDY,
  },
  'route-study': {
    label: 'tracé à l’étude',
    render: 'variante',
    group: 'planned',
    mapText: 'tracé à l’étude',
    badgeClass: BADGE_STUDY,
  },
  validated: { label: 'tracé validé', render: 'planned', group: 'planned', badgeClass: BADGE_PLANNED },
  'works-study': { label: 'travaux à l’étude', render: 'planned', group: 'planned', badgeClass: BADGE_PLANNED },
  wip: { label: 'en travaux', render: 'wip', group: 'wip', badgeClass: BADGE_WIP },
  done: { label: 'réalisé', render: 'done', group: 'done', badgeClass: BADGE_DONE },
  blocked: { label: 'bloqué', render: 'postponed', group: 'postponed', mapText: 'bloqué', badgeClass: BADGE_BLOCKED },
  unknown: { label: 'pas d’information', render: 'planned', group: 'planned', badgeClass: BADGE_STUDY },
  tested: { label: 'provisoire', render: 'wip', group: 'wip', badgeClass: BADGE_WIP },

  // états hérités de Cyclopolis (Lyon), conservés pour compatibilité
  planned: { label: 'prévu', render: 'planned', group: 'planned', badgeClass: BADGE_PLANNED },
  postponed: {
    label: 'reporté',
    render: 'postponed',
    group: 'postponed',
    mapText: 'reporté',
    badgeClass: BADGE_BLOCKED,
  },
  variante: { label: 'variante', render: 'variante', group: 'done', mapText: 'variante', badgeClass: '' },
  'variante-postponed': {
    label: 'variante reportée',
    render: 'variante-postponed',
    group: 'postponed',
    mapText: 'variante reportée',
    badgeClass: BADGE_BLOCKED,
  },
};

export function getStatusDefinition(status: LaneStatus | undefined | null): StatusDefinition {
  return (status && STATUSES[status]) || STATUSES.unknown;
}

export function statusesOfGroup(group: StatusGroup): LaneStatus[] {
  return (Object.keys(STATUSES) as LaneStatus[]).filter((status) => STATUSES[status].group === group);
}
