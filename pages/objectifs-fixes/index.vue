<template>
  <div>
    <div class="bg-lvv-blue-600 text-white">
      <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 class="text-3xl font-bold sm:text-4xl">Objectifs fixés</h1>
        <p class="mt-3 max-w-3xl text-lvv-blue-100">
          Où en sont les engagements pris par la Région, le Département et Paris Ouest La Défense pour le vélo sur
          les 11 communes du territoire ? Chaque objectif est rappelé avec son horizon.
        </p>
      </div>
    </div>

    <nav class="sticky z-20 border-b border-gray-200 bg-white/95 backdrop-blur" style="top: var(--navbar-height, 0px)">
      <div class="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 sm:px-6">
        <a
          v-for="tab in tabs"
          :key="tab.id"
          :href="`#${tab.id}`"
          :class="[
            'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium',
            activeTab === tab.id
              ? 'border-lvv-blue-600 text-lvv-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800',
          ]"
        >
          {{ tab.label }}
        </a>
      </div>
    </nav>

    <div class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <div class="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Chiffres d'exemple.</strong> Cette page est une maquette : les valeurs affichées sont fictives et
        seront remplacées par les données de l'observatoire.
      </div>

      <!-- Modes actifs -->
      <section id="modes-actifs" class="objectif-section pt-12">
        <h2 class="text-2xl font-bold text-gray-900">+50 % de modes actifs d'ici à 2050</h2>
        <p class="mt-2 text-gray-600">
          Objectif du plan climat-air-énergie de POLD (2019) : « 50 % de croissance des modes actifs d'ici à 2050 »,
          c'est-à-dire de la marche et du vélo. Horizon <strong>{{ MODES_ACTIFS.baseYear }}-{{ MODES_ACTIFS.targetYear }}</strong>.
        </p>
        <div class="mt-6 grid items-center gap-6 lg:grid-cols-[18rem_1fr]">
          <div class="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <TargetGauge
              :value="actifs.growth"
              :target="actifs.expectedNow"
              :max="MODES_ACTIFS.growthTarget"
              :value-label="`+${actifs.growth} %`"
              :target-label="`prévu ${actifs.lastYear} : +${actifs.expectedNow} %`"
              caption="sur +50 % visés en 2050"
              color="#E85D04"
            />
            <p class="mt-2 text-center text-sm text-gray-600">
              Part des modes actifs : <strong>{{ MODES_ACTIFS.baseShare }} %</strong> en {{ MODES_ACTIFS.baseYear }},
              <strong>{{ actifs.lastShare }} %</strong> en {{ actifs.lastYear }}.
              <br />
              Cible 2050 : <strong>{{ actifs.targetShare }} %</strong>.
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 class="font-bold text-gray-900">Trajectoire linéaire jusqu'en 2050</h3>
            <svg viewBox="0 0 520 220" class="mt-3 w-full" role="img" aria-label="Trajectoire de la part des modes actifs">
              <g v-for="t in actifs.yTicks" :key="t">
                <line :x1="40" :x2="510" :y1="y(t)" :y2="y(t)" stroke="#f3f4f6" />
                <text :x="34" :y="y(t) + 4" text-anchor="end" font-size="11" class="fill-gray-500">{{ t }} %</text>
              </g>
              <polyline :points="actifs.linePoints" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5 4" />
              <polyline :points="actifs.measurePoints" fill="none" stroke="#E85D04" stroke-width="3" />
              <g v-for="m in actifs.milestones" :key="m.year">
                <circle :cx="x(m.year)" :cy="y(m.share)" r="4" fill="#fff" stroke="#6b7280" stroke-width="2" />
                <text :x="x(m.year)" :y="y(m.share) - 9" text-anchor="middle" font-size="11" font-weight="700" class="fill-gray-700">
                  {{ m.share }} %
                </text>
                <text :x="x(m.year)" y="214" text-anchor="middle" font-size="11" class="fill-gray-500">{{ m.year }}</text>
              </g>
              <circle
                v-for="m in MODES_ACTIFS.measures"
                :key="`m${m.year}`"
                :cx="x(m.year)"
                :cy="y(m.share)"
                r="4.5"
                fill="#E85D04"
              />
              <text :x="x(MODES_ACTIFS.baseYear)" y="214" text-anchor="middle" font-size="11" class="fill-gray-500">
                {{ MODES_ACTIFS.baseYear }}
              </text>
            </svg>
            <div class="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
              <span class="flex items-center gap-1.5"><span class="h-0.5 w-5 bg-[#E85D04]" /> part mesurée</span>
              <span class="flex items-center gap-1.5"><span class="h-0 w-5 border-t-2 border-dashed border-gray-400" /> trajectoire linéaire vers l'objectif</span>
            </div>
          </div>
        </div>
      </section>

      <!-- VIF -->
      <section id="vif" class="objectif-section pt-12">
        <h2 class="text-2xl font-bold text-gray-900">Vélo Île-de-France (VIF)</h2>
        <p class="mt-2 text-gray-600">
          Réseau régional de pistes cyclables structurantes, réalisé en deux phases : phase 1 sur 2021-2025, phase 2
          sur 2025-2030. Achèvement de l'ensemble du réseau prévu en 2030.
        </p>
        <div class="mt-6 grid gap-6 lg:grid-cols-2">
          <PlanCard v-for="plan in VIF_PHASES" :key="plan.id" :plan="plan" color="#0055C8" />
        </div>
      </section>

      <!-- Département -->
      <section id="departement" class="objectif-section pt-14">
        <h2 class="text-2xl font-bold text-gray-900">Plan vélo des Hauts-de-Seine</h2>
        <p class="mt-2 text-gray-600">Itinéraires départementaux structurants et interdépartementaux.</p>
        <div class="mt-6 grid gap-6">
          <PlanCard v-for="plan in CD92_PLANS" :key="plan.id" :plan="plan" color="#5B3F99" />
          <div class="rounded-xl border border-dashed border-gray-300 p-5 text-gray-600">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-lg font-bold text-gray-800">{{ CD92_NEXT.title }}</h3>
              <span class="rounded-full bg-gray-100 px-3 py-1 text-sm">
                Horizon <strong>{{ CD92_NEXT.period }}</strong> · échéance {{ CD92_NEXT.deadline }}
              </span>
            </div>
            <p class="mt-1 text-sm">{{ CD92_NEXT.note }}.</p>
          </div>
        </div>
      </section>

      <!-- Schéma directeur POLD -->
      <section id="schema-directeur" class="objectif-section pt-14">
        <h2 class="text-2xl font-bold text-gray-900">Schéma directeur cyclable de POLD</h2>
        <p class="mt-2 text-gray-600">{{ SDC_POLD.note }}</p>
        <div class="mt-6 grid items-center gap-6 lg:grid-cols-[18rem_1fr]">
          <div class="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <TargetGauge :value="sdcPct" :target="SDC_POLD.target ?? 80" color="#008C44" />
            <p class="mt-2 text-center text-sm text-gray-600">
              Objectif <strong>{{ SDC_POLD.target }} % en {{ SDC_POLD.deadline }}</strong>
              <br />
              Il manque <strong>{{ sdcGapKm }}</strong> pour l'atteindre.
            </p>
          </div>
          <PlanCard :plan="SDC_POLD" color="#008C44" />
        </div>
      </section>

      <!-- Gares -->
      <section id="gares" class="objectif-section pt-14">
        <h2 class="text-2xl font-bold text-gray-900">Le vélo autour des gares</h2>
        <div class="mt-2 space-y-2 text-gray-600">
          <p>
            <strong>POLD</strong> (plan climat 2019, fiches MOBIL 3 et MOBIL 6) : développer le stationnement vélo aux
            gares, en priorité sécurisé, et soigner les abords et le lien aux pistes. Horizon : 2018 et au-delà, sans
            cible chiffrée.
          </p>
          <p>
            <strong>Île-de-France Mobilités</strong> (schéma directeur du stationnement vélo, 2020) : équiper toutes les
            gares en stationnement en libre accès et sécurisé, 140 000 places en Île-de-France. Horizon 2030.
          </p>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="kpi in garesKpis" :key="kpi.label" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="text-2xl font-bold text-gray-900">{{ kpi.value }}</div>
            <div class="text-sm text-gray-600">{{ kpi.label }}</div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2 text-sm">
          <button
            v-for="m in modeFilters"
            :key="m"
            type="button"
            :class="[
              'rounded-full border px-3 py-1',
              modeFilter === m ? 'border-lvv-blue-600 bg-lvv-blue-600 text-white' : 'border-gray-300 text-gray-700',
            ]"
            @click="modeFilter = m"
          >
            {{ m === 'Toutes' ? 'Toutes les gares' : m === 'L' || m === 'U' ? `Ligne ${m}` : m }}
          </button>
        </div>

        <div class="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table class="w-full min-w-[46rem] text-sm">
            <thead class="bg-gray-50 text-left text-gray-600">
              <tr>
                <th class="px-3 py-2 font-medium">Ville / gare</th>
                <th class="px-3 py-2 text-right font-medium" title="Arceaux en libre accès non abrités">Libre accès</th>
                <th class="px-3 py-2 text-right font-medium" title="Libre accès abrité ou couvert">⭐ Abrité</th>
                <th class="px-3 py-2 text-right font-medium" title="Consigne fermée">🔒 Sécurisé</th>
                <th class="px-3 py-2 text-right font-medium" title="Bornes Vélib' à moins de 300 m">Vélib'</th>
                <th class="px-3 py-2 text-right font-medium" title="Aménagements cyclables connectés à la gare, rayon 3 km">
                  Pistes connectées (3 km)
                </th>
                <th class="px-3 py-2 text-right font-medium">VIF le plus proche</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="ville in garesParVille" :key="ville.commune">
                <tr class="cursor-pointer border-t border-gray-200 bg-white font-semibold hover:bg-gray-50" @click="toggle(ville.commune)">
                  <td class="px-3 py-2">
                    <Icon
                      :name="open.has(ville.commune) ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                      class="-mt-0.5 mr-1 h-4 w-4 align-middle text-gray-400"
                    />
                    {{ ville.commune }}
                    <span class="font-normal text-gray-500">· {{ ville.gares.length }} gare{{ ville.gares.length > 1 ? 's' : '' }}</span>
                  </td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ ville.libre }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ ville.abrite }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ ville.securise }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ ville.velib }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ km(ville.connecte) }}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{{ distance(ville.vifMin) }}</td>
                </tr>
                <template v-if="open.has(ville.commune)">
                  <tr v-for="gare in ville.gares" :key="gare.name" class="border-t border-gray-100 text-gray-700">
                    <td class="py-1.5 pl-9 pr-3">
                      <span>{{ gare.name }}</span>
                      <span class="ml-2 inline-flex flex-wrap gap-1 align-middle">
                        <span
                          v-for="m in gare.modes"
                          :key="m"
                          class="rounded px-1.5 py-0.5 text-[10px] font-bold leading-none"
                          :style="{ background: MODE_COLORS[m], color: m === 'L' ? '#1f2937' : '#fff' }"
                        >
                          {{ m }}
                        </span>
                      </span>
                      <span v-if="gare.note" class="block text-xs text-gray-400">{{ gare.note }}</span>
                    </td>
                    <td class="px-3 py-1.5 text-right tabular-nums">{{ gare.libre }}</td>
                    <td class="px-3 py-1.5 text-right tabular-nums">{{ gare.abrite || '—' }}</td>
                    <td class="px-3 py-1.5 text-right tabular-nums">
                      <span v-if="gare.securise">{{ gare.securise }}</span>
                      <span v-else class="text-amber-700">aucun</span>
                    </td>
                    <td class="px-3 py-1.5 text-right tabular-nums">{{ gare.velib || '—' }}</td>
                    <td class="px-3 py-1.5 text-right tabular-nums">{{ km(gare.connecte3km) }}</td>
                    <td class="px-3 py-1.5 text-right tabular-nums">{{ distance(gare.vifM) }}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-gray-500">
          Rayon de 3 km, soit environ 15 minutes à vélo : c'est le rayon retenu par l'Apur pour les gares du Grand Paris
          Express. Les « pistes connectées » ne comptent que les aménagements reliés à la gare par un itinéraire continu.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanCard from '~/components/objectifs/PlanCard.vue';
import TargetGauge from '~/components/objectifs/TargetGauge.vue';
import { CD92_NEXT, CD92_PLANS, GARES, MODES_ACTIFS, SDC_POLD, VIF_PHASES, type Gare, type Mode } from '~/helpers/objectifs-exemple';

useHead({ title: 'Objectifs fixés' });

const tabs = [
  { id: 'modes-actifs', label: 'Modes actifs 2050' },
  { id: 'vif', label: 'VIF' },
  { id: 'departement', label: 'Plan vélo départemental' },
  { id: 'schema-directeur', label: 'Schéma directeur POLD' },
  { id: 'gares', label: 'Gares' },
];

const activeTab = ref('modes-actifs');
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) activeTab.value = visible[0].target.id;
    },
    { rootMargin: '-20% 0px -60% 0px' },
  );
  tabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) observer.observe(el);
  });
  onBeforeUnmount(() => observer.disconnect());
});

const MODE_COLORS: Record<Mode, string> = {
  'RER A': '#E3051C',
  'RER E': '#C04191',
  L: '#CEADD2',
  U: '#D60058',
  T2: '#CF009E',
};

const actifs = computed(() => {
  const { baseYear, baseShare, growthTarget, targetYear, measures, milestones } = MODES_ACTIFS;
  const targetShare = Math.round(baseShare * (1 + growthTarget / 100) * 10) / 10;
  const expected = (year: number) => baseShare + ((targetShare - baseShare) * (year - baseYear)) / (targetYear - baseYear);
  const last = measures[measures.length - 1]!;
  const growth = Math.round(((last.share - baseShare) / baseShare) * 100);
  const expectedNow = Math.round(((expected(last.year) - baseShare) / baseShare) * 100);
  const yTicks = [30, 40, 50, 60];
  return {
    targetShare,
    lastYear: last.year,
    lastShare: last.share,
    growth,
    expectedNow,
    yTicks,
    milestones: milestones.map(year => ({ year, share: Math.round(expected(year) * 10) / 10 })),
    linePoints: [baseYear, targetYear].map(yr => `${x(yr)},${y(expected(yr))}`).join(' '),
    measurePoints: measures.map(m => `${x(m.year)},${y(m.share)}`).join(' '),
  };
});
function x(year: number): number {
  return 50 + ((year - MODES_ACTIFS.baseYear) / (MODES_ACTIFS.targetYear - MODES_ACTIFS.baseYear)) * 445;
}
function y(share: number): number {
  return 195 - ((share - 30) / 30) * 175;
}

const sdcTotals = computed(() => ({
  done: SDC_POLD.communes.reduce((s, r) => s + r.doneKm, 0),
  planned: SDC_POLD.communes.reduce((s, r) => s + r.plannedKm, 0),
}));
const sdcPct = computed(() => Math.round((sdcTotals.value.done / sdcTotals.value.planned) * 100));
const sdcGapKm = computed(() => {
  const gap = ((SDC_POLD.target ?? 80) / 100) * sdcTotals.value.planned - sdcTotals.value.done;
  return km(Math.max(gap, 0));
});

const modeFilters = ['Toutes', 'RER A', 'L', 'U', 'T2'] as const;
const modeFilter = ref<(typeof modeFilters)[number]>('Toutes');
const filteredGares = computed<Gare[]>(() =>
  modeFilter.value === 'Toutes' ? GARES : GARES.filter(g => g.modes.includes(modeFilter.value as Mode)),
);

const garesParVille = computed(() => {
  const map = new Map<string, Gare[]>();
  for (const g of filteredGares.value) map.set(g.commune, [...(map.get(g.commune) ?? []), g]);
  return [...map.entries()]
    .map(([commune, gares]) => ({
      commune,
      gares,
      libre: sum(gares, 'libre'),
      abrite: sum(gares, 'abrite'),
      securise: sum(gares, 'securise'),
      velib: sum(gares, 'velib'),
      connecte: sum(gares, 'connecte3km'),
      vifMin: Math.min(...gares.map(g => g.vifM ?? Infinity)),
    }))
    .sort((a, b) => a.commune.localeCompare(b.commune, 'fr'));
});

const garesKpis = computed(() => {
  const gs = filteredGares.value;
  const withSecure = gs.filter(g => g.securise > 0).length;
  return [
    { value: gs.length, label: 'gares et stations' },
    { value: `${withSecure} / ${gs.length}`, label: 'équipées en stationnement sécurisé' },
    { value: sum(gs, 'libre') + sum(gs, 'abrite') + sum(gs, 'securise'), label: 'places vélo au total' },
    { value: gs.filter(g => (g.vifM ?? Infinity) <= 300).length, label: 'gares à moins de 300 m du VIF' },
  ];
});

const open = ref(new Set<string>());
function toggle(commune: string) {
  const s = new Set(open.value);
  if (s.has(commune)) s.delete(commune);
  else s.add(commune);
  open.value = s;
}

function sum(gs: Gare[], key: 'libre' | 'abrite' | 'securise' | 'velib' | 'connecte3km'): number {
  return Math.round(gs.reduce((s, g) => s + g[key], 0) * 10) / 10;
}
function km(v: number): string {
  return `${v.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}
function distance(m: number | null): string {
  if (m === null || !Number.isFinite(m)) return '—';
  return m < 1000 ? `${m} m` : `${(m / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}
</script>

<style scoped>
.objectif-section {
  scroll-margin-top: calc(var(--navbar-height, 0px) + 3.5rem);
}
</style>
