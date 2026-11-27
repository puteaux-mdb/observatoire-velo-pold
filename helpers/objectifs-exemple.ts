// Chiffres d'EXEMPLE pour maquetter la page « Objectifs fixés ».
// À remplacer par les valeurs calculées à partir des données de l'observatoire.

export const COMMUNES = [
  'Courbevoie',
  'Garches',
  'La Garenne-Colombes',
  'Levallois-Perret',
  'Nanterre',
  'Neuilly-sur-Seine',
  'Puteaux',
  'Rueil-Malmaison',
  'Saint-Cloud',
  'Suresnes',
  'Vaucresson',
] as const;

export type CommuneProgress = { commune: string; doneKm: number; plannedKm: number };

export type PlanProgress = {
  id: string;
  title: string;
  owner: string;
  period: string;
  deadline: number;
  target?: number; // objectif en % (ex. 80)
  note?: string;
  communes: CommuneProgress[];
};

function c(commune: string, doneKm: number, plannedKm: number): CommuneProgress {
  return { commune, doneKm, plannedKm };
}

export const VIF_PHASES: PlanProgress[] = [
  {
    id: 'vif-phase-1',
    title: 'VIF – Phase 1',
    owner: 'Région Île-de-France',
    period: '2021-2025',
    deadline: 2025,
    communes: [
      c('Courbevoie', 2.1, 3.0),
      c('Levallois-Perret', 1.2, 1.4),
      c('Nanterre', 3.4, 5.2),
      c('Neuilly-sur-Seine', 1.8, 2.6),
      c('Puteaux', 1.1, 2.3),
      c('Rueil-Malmaison', 2.6, 4.1),
      c('Suresnes', 1.5, 2.0),
    ],
  },
  {
    id: 'vif-phase-2',
    title: 'VIF – Phase 2',
    owner: 'Région Île-de-France',
    period: '2025-2030',
    deadline: 2030,
    communes: [
      c('Courbevoie', 0.4, 2.2),
      c('Garches', 0.0, 1.6),
      c('La Garenne-Colombes', 0.3, 1.1),
      c('Nanterre', 0.8, 3.5),
      c('Puteaux', 0.2, 1.4),
      c('Rueil-Malmaison', 0.5, 2.8),
      c('Saint-Cloud', 0.0, 1.9),
      c('Vaucresson', 0.0, 1.2),
    ],
  },
];

export const CD92_PLANS: PlanProgress[] = [
  {
    id: 'cd92-2022-2028',
    title: 'Plan vélo départemental 2022-2028',
    owner: 'Département des Hauts-de-Seine',
    period: '2022-2028',
    deadline: 2028,
    communes: [
      c('Courbevoie', 3.2, 4.5),
      c('Garches', 0.6, 1.8),
      c('La Garenne-Colombes', 1.1, 1.6),
      c('Levallois-Perret', 2.0, 2.4),
      c('Nanterre', 4.8, 8.2),
      c('Neuilly-sur-Seine', 1.4, 3.1),
      c('Puteaux', 1.9, 3.3),
      c('Rueil-Malmaison', 3.5, 6.9),
      c('Saint-Cloud', 0.9, 2.5),
      c('Suresnes', 1.7, 2.9),
      c('Vaucresson', 0.4, 1.5),
    ],
  },
];

export const CD92_NEXT = {
  title: 'Plan vélo départemental 2028-2034',
  period: '2028-2034',
  deadline: 2034,
  note: 'Plan à venir',
};

export const SDC_POLD: PlanProgress = {
  id: 'pold-sdc',
  title: 'Schéma directeur cyclable POLD',
  owner: 'Paris Ouest La Défense',
  period: '2021-2025',
  deadline: 2025,
  target: 80,
  note: 'Objectif du plan climat-air-énergie de POLD (PCAE, adopté le 25 juin 2019, fiche MOBIL 5) : 80 % des axes aménagés en 2025.',
  communes: [
    c('Courbevoie', 6.1, 11.0),
    c('Garches', 1.2, 4.0),
    c('La Garenne-Colombes', 2.3, 4.2),
    c('Levallois-Perret', 4.5, 6.0),
    c('Nanterre', 9.8, 19.5),
    c('Neuilly-sur-Seine', 3.0, 8.1),
    c('Puteaux', 4.0, 7.6),
    c('Rueil-Malmaison', 7.4, 17.3),
    c('Saint-Cloud', 1.9, 6.4),
    c('Suresnes', 3.6, 7.2),
    c('Vaucresson', 0.8, 3.7),
  ],
};

export type Mode = 'RER A' | 'RER E' | 'L' | 'U' | 'T2';

export type Gare = {
  name: string;
  commune: string;
  modes: Mode[];
  note?: string;
  libre: number; // arceaux en libre accès non abrités
  abrite: number; // libre accès abrité / couvert
  securise: number; // consigne fermée
  velib: number; // bornes Vélib' à moins de 300 m
  connecte3km: number; // km d'aménagements connectés à la gare dans un rayon de 3 km
  vifM: number | null; // distance au VIF le plus proche, en mètres
};

function g(
  name: string,
  commune: string,
  modes: Mode[],
  [libre, abrite, securise, velib]: number[],
  connecte3km: number,
  vifM: number,
  note?: string,
): Gare {
  return { name, commune, modes, libre, abrite, securise, velib, connecte3km, vifM, note };
}

// Gares RER A, Transilien L/U et stations T2 des 11 communes (communes de rattachement à vérifier pour les gares en limite).
export const GARES: Gare[] = [
  // RER A
  g('La Défense', 'Puteaux', ['RER A', 'RER E', 'L', 'U', 'T2'], [220, 120, 0, 86], 14.2, 150, 'Pôle partagé avec Courbevoie'),
  g('Nanterre-Préfecture', 'Nanterre', ['RER A'], [60, 40, 100, 12], 9.3, 300),
  g('Nanterre-Ville', 'Nanterre', ['RER A'], [45, 20, 60, 8], 6.4, 450),
  g('Nanterre-Université', 'Nanterre', ['RER A', 'L'], [50, 30, 60, 0], 7.0, 800),
  g('Rueil-Malmaison', 'Rueil-Malmaison', ['RER A'], [80, 60, 120, 0], 6.8, 500),
  // Transilien L et U
  g('Clichy-Levallois', 'Levallois-Perret', ['L'], [40, 0, 0, 35], 7.9, 400, 'Gare en limite de Clichy'),
  g('Bécon-les-Bruyères', 'Courbevoie', ['L'], [30, 0, 0, 20], 4.0, 1200),
  g('Courbevoie', 'Courbevoie', ['L'], [24, 20, 40, 30], 5.4, 900),
  g('La Garenne-Colombes', 'La Garenne-Colombes', ['L'], [16, 10, 20, 22], 3.7, 1400),
  g('Puteaux', 'Puteaux', ['L', 'T2'], [18, 0, 0, 25], 6.1, 650),
  g('Suresnes-Mont-Valérien', 'Suresnes', ['L', 'U'], [22, 12, 0, 18], 4.4, 700),
  g('Le Val d\'Or', 'Saint-Cloud', ['L'], [12, 0, 0, 0], 2.6, 1500),
  g('Saint-Cloud', 'Saint-Cloud', ['L', 'U'], [20, 0, 30, 0], 2.1, 1800),
  g('Garches-Marnes-la-Coquette', 'Garches', ['L'], [12, 0, 0, 0], 1.5, 2100),
  g('Vaucresson', 'Vaucresson', ['L'], [10, 8, 20, 0], 1.2, 2600),
  // Tramway T2
  g('Faubourg de l\'Arche', 'Courbevoie', ['T2'], [10, 0, 0, 15], 5.0, 600),
  g('Les Fauvelles', 'Courbevoie', ['T2'], [8, 0, 0, 12], 3.9, 1100, 'En limite de La Garenne-Colombes'),
  g('Charlebourg', 'La Garenne-Colombes', ['T2'], [12, 0, 0, 10], 3.2, 1300),
  g('Belvédère', 'Suresnes', ['T2'], [6, 0, 0, 10], 3.5, 900, 'En limite de Puteaux'),
  g('Suresnes-Longchamp', 'Suresnes', ['T2'], [14, 0, 0, 16], 4.1, 200),
  g('Les Coteaux', 'Saint-Cloud', ['T2'], [4, 0, 0, 0], 2.0, 800),
  g('Les Milons', 'Saint-Cloud', ['T2'], [4, 0, 0, 0], 1.8, 1000),
  g('Parc de Saint-Cloud', 'Saint-Cloud', ['T2'], [10, 0, 0, 0], 2.4, 300),
];

// Objectif « +50 % de croissance des modes actifs d'ici à 2050 » (PCAE POLD 2019, chiffres clés de l'axe 2).
// Chiffres d'EXEMPLE : part modale marche + vélo des déplacements des habitants.
export const MODES_ACTIFS = {
  baseYear: 2012,
  baseShare: 38, // % des déplacements en modes actifs l'année de référence (exemple)
  growthTarget: 50, // +50 %
  targetYear: 2050,
  milestones: [2025, 2030, 2035, 2040, 2045, 2050],
  measures: [
    { year: 2012, share: 38 },
    { year: 2018, share: 40 },
    { year: 2023, share: 42 },
  ],
};

// Collèges publics (compétence du Département). Chiffres d'EXEMPLE par ville.
export type CollegesVille = {
  commune: string;
  colleges: number; // collèges publics
  desservis: number; // reliés à un aménagement cyclable continu (abords à moins de 300 m)
  equipes: number; // avec un stationnement vélo
  places: number; // places de stationnement vélo au total
};

export const COLLEGES: CollegesVille[] = [
  { commune: 'Courbevoie', colleges: 5, desservis: 3, equipes: 4, places: 120 },
  { commune: 'Garches', colleges: 1, desservis: 0, equipes: 1, places: 20 },
  { commune: 'La Garenne-Colombes', colleges: 2, desservis: 1, equipes: 2, places: 40 },
  { commune: 'Levallois-Perret', colleges: 4, desservis: 3, equipes: 3, places: 70 },
  { commune: 'Nanterre', colleges: 8, desservis: 4, equipes: 6, places: 160 },
  { commune: 'Neuilly-sur-Seine', colleges: 2, desservis: 1, equipes: 1, places: 30 },
  { commune: 'Puteaux', colleges: 2, desservis: 1, equipes: 1, places: 24 },
  { commune: 'Rueil-Malmaison', colleges: 6, desservis: 2, equipes: 4, places: 110 },
  { commune: 'Saint-Cloud', colleges: 2, desservis: 0, equipes: 1, places: 20 },
  { commune: 'Suresnes', colleges: 3, desservis: 2, equipes: 3, places: 60 },
  { commune: 'Vaucresson', colleges: 1, desservis: 0, equipes: 1, places: 15 },
];

export type SourceLink = { label: string; owner: string; url?: string; note?: string };

export const SOURCES: { section: string; links: SourceLink[] }[] = [
  {
    section: 'Modes actifs et plans climat',
    links: [
      { label: 'Plan climat-air-énergie de Paris Ouest La Défense (2019)', owner: 'POLD', url: 'https://www.ville-levallois.fr/wp-content/uploads/2023/09/POLD_PCAET1.pdf', note: 'Objectif +50 % de modes actifs en 2050 ; fiches MOBIL 2 à 6' },
      { label: 'Rapport développement durable 2025', owner: 'POLD', url: 'https://www.ville-levallois.fr/wp-content/uploads/2026/02/Rapport-DD-POLD-2025.pdf' },
      { label: 'Plan climat-air-énergie métropolitain (2018)', owner: 'Métropole du Grand Paris', url: 'https://metropolegrandparis.fr/sites/default/files/media/document/PCAEM.pdf.pdf', note: 'Cadre de référence des plans climat des territoires' },
    ],
  },
  {
    section: 'Vélo Île-de-France (VIF)',
    links: [
      { label: 'Réseau Vélo Île-de-France : objectifs et carte d\'avancement', owner: 'Région Île-de-France', url: 'https://www.iledefrance.fr/toutes-les-actualites/reseau-velo-ile-de-france-vif-plus-de-pistes-cyclables-pour-les-deplacements-quotidiens' },
      { label: 'Brochure VIF (juillet 2026)', owner: 'Région Île-de-France', url: 'https://www.iledefrance.fr/sites/default/files/2026-09/brochure-vif-juillet-2026_def_web.pdf', note: 'Phases 1 et 2, état d\'avancement' },
    ],
  },
  {
    section: 'Plan vélo départemental et collèges',
    links: [
      { label: 'Schéma directeur cyclable / plan d\'action 2021-2028', owner: 'Département des Hauts-de-Seine', url: 'https://www.hauts-de-seine.fr/fileadmin/user_upload/Mon_departement/01_Missions_et_actions/01.7_Transport_et_voirie/Circulations_douces/Le_plan_velo.pdf', note: 'Desserte et stationnement des collèges, Savoir rouler' },
      { label: 'Plan vélo 2022-2028 (dépliant, juin 2025)', owner: 'Département des Hauts-de-Seine', url: 'https://www.hauts-de-seine.fr/fileadmin/user_upload/plan-velo-2022-2028-hauts-de-seine.pdf' },
      { label: 'Open data « Aménagements cyclables »', owner: 'Département des Hauts-de-Seine', url: 'https://www.data.gouv.fr/datasets/amenagements-cyclables' },
    ],
  },
  {
    section: 'Schéma directeur cyclable POLD',
    links: [
      { label: 'Objectif 80 % des axes aménagés en 2025 (fiche MOBIL 5)', owner: 'POLD', url: 'https://www.ville-levallois.fr/wp-content/uploads/2023/09/POLD_PCAET1.pdf', note: 'Le schéma directeur lui-même n\'est pas publié en ligne à notre connaissance' },
    ],
  },
  {
    section: 'Gares',
    links: [
      { label: 'Schéma directeur du stationnement vélo en gares et stations (2020)', owner: 'Île-de-France Mobilités', url: 'https://www.iledefrance-mobilites.fr/medias/portail-idfm/a4589a21-eea6-410f-b591-01e34e829d1c_SDSV_2020_Web.pdf' },
      { label: 'Parkings Vélos Île-de-France Mobilités', owner: 'Île-de-France Mobilités', url: 'https://www.iledefrance-mobilites.fr/le-reseau/services-de-mobilite/velo/parkings-velo' },
      { label: 'Grand Paris cyclable : 3 km autour des gares', owner: 'Apur', url: 'https://apur.org/en/our-works/bike-friendly-grand-paris-current-situation-and-projects-delivered-2030', note: 'Rayon de rabattement retenu' },
    ],
  },
];
