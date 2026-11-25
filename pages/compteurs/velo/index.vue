<template>
  <CounterListLayout
    v-model:search-text="searchText"
    v-model:show-voies-lyonnaises="showVoiesLyonnaises"
    v-model:highlighted-counter="highlightedCounter"
    v-model:sort-by="sortBy"
    v-model:selected-month="selectedMonth"
    v-model:reference-year-offset="referenceYearOffset"
    v-model:display-mode="displayMode"
    v-model:show-map="showMap"
    v-model:selected-year="selectedYear"
    v-model:comparison-period="comparisonPeriod"
    :available-months="availableMonths"
    :available-years="availableYears"
    :counters="counters"
    :filtered-features="filteredFeatures"
    search-placeholder="Chercher un compteur, une ville, une ligne..."
    empty-search-hint="Essayez un nom de rue, une ville (ex: Puteaux) ou une ligne (ex: L 1)"
  >
    <template #header>
      <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
        Suivi des compteurs vélo {{ config.territory.adjective }}
      </h2>
      <p class="mt-4 text-xl text-gray-500 leading-8">
        Nous suivons les données de {{ stableCounters.length }} compteurs à vélo du territoire
        {{ config.territory.name }}.
      </p>
      <span v-if="config.counterSources?.length" class="text-sm text-gray-400"
        >Données&nbsp;:
        <template v-for="(source, i) in config.counterSources" :key="source.link">
          <span v-if="i > 0">, </span>
          <a class="hover:underline" :href="source.link" target="_blank">{{ source.label }}</a>
        </template></span
      >
    </template>
    <template #overview>
      <ChartMetropoleIndex
        v-if="stableCounters.length > 0"
        :counters="stableCounters"
        class="mb-6"
        @highlight="highlightedCounter = $event"
      />
    </template>
  </CounterListLayout>
</template>

<script setup lang="ts">
import type { ComparisonPeriod, DisplayMode, SortOption } from '~/components/counter/ListLayout.vue';
import type { CompteurFeature } from '~/types';
import { isTestSearch, matchesCounterSearch, useCounterSearch } from '~/composables/useCounterSearch';

const { getCompteursFeatures } = useMap();
const { getAvailableMonths, getAvailableYears, syncDefaultPeriod, sortCounters } = useCounterUtils();

const sortBy = ref<SortOption>('passages');
const displayMode = ref<DisplayMode>('monthly');
const comparisonPeriod = ref<ComparisonPeriod>('monthly');
const referenceYearOffset = ref<number>(1);
const showMap = ref<boolean>(true);
const selectedYear = ref<number>(0);

const { data: allCounters } = await useAsyncData('velo-counters', () => {
  return queryCollection('compteurs').where('path', 'LIKE', '/compteurs/velo%').all();
});

const stableCounters = computed(() => (allCounters.value ?? []).filter((counter) => !counter.test));
const visibleCounters = computed(() =>
  isTestSearch(searchText.value) ? (allCounters.value ?? []) : stableCounters.value,
);

const availableMonths = computed(() => getAvailableMonths(allCounters.value));
const availableYears = computed(() => getAvailableYears(availableMonths.value));

const selectedMonth = ref<string>('');
syncDefaultPeriod(selectedMonth, availableMonths, selectedYear, availableYears);

const counters = computed(() => {
  if (comparisonPeriod.value === 'monthly' && !selectedMonth.value) {
    return [];
  }

  if (comparisonPeriod.value === 'annual' && !selectedYear.value) {
    return [];
  }

  const sorted = sortCounters(
    visibleCounters.value,
    sortBy,
    comparisonPeriod,
    selectedMonth,
    selectedYear,
    referenceYearOffset,
  );

  return sorted
    .filter((counter) => matchesCounterSearch(counter, searchText.value))
    .map((counter) => ({
      ...counter,
      counts: counter.counts.map((count) => ({ month: count.month, veloCount: count.count })),
    }));
});

const counterFeatures = computed<CompteurFeature[]>(() => [
  ...getCompteursFeatures({
    counters: visibleCounters.value.filter((c) => !c.cyclopolisId),
    type: 'compteur-velo',
  }),
  ...getCompteursFeatures({
    counters: visibleCounters.value.filter((c) => c.cyclopolisId),
    type: 'compteur-velo',
    isMixed: true,
  }),
]);

const mapFeatures = computed(() => {
  if (!searchText.value) {
    return counterFeatures.value;
  }

  const names = new Set(counters.value.map((c) => c.name));
  return counterFeatures.value.filter((f) => names.has(f.properties.name));
});

const { searchText, showVoiesLyonnaises, highlightedCounter, filteredFeatures } = await useCounterSearch(mapFeatures, {
  sortBy,
  selectedMonth,
  selectedYear,
  referenceYearOffset,
  displayMode,
  comparisonPeriod,
  showMap,
});

const { config } = useConfig();
const PAGE_TITLE = `Compteurs vélo ${config.territory.adjective} | ${config.siteName}`;
const DESCRIPTION =
  `Carte interactive et classement des compteurs vélo ${config.territory.adjective}. ` +
  'Suivez la fréquentation cycliste mois par mois, comparez les années et explorez ' +
  "l'évolution du trafic.";

useHead({
  title: PAGE_TITLE,
  meta: [
    { hid: 'description', name: 'description', content: DESCRIPTION },
    { hid: 'og:title', property: 'og:title', content: PAGE_TITLE },
    { hid: 'og:description', property: 'og:description', content: DESCRIPTION },
    { hid: 'twitter:title', name: 'twitter:title', content: PAGE_TITLE },
    { hid: 'twitter:description', name: 'twitter:description', content: DESCRIPTION },
  ],
});
</script>
