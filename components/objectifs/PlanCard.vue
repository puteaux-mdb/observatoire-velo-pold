<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ plan.title }}</h3>
        <p class="text-sm text-gray-500">{{ plan.owner }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <span class="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
          Horizon <strong>{{ plan.period }}</strong>
        </span>
        <span v-if="overdue" class="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
          échéance {{ plan.deadline }} dépassée
        </span>
        <span v-else class="rounded-full bg-lvv-blue-100 px-3 py-1 text-lvv-blue-600">
          échéance {{ plan.deadline }}
        </span>
      </div>
    </div>

    <div class="mt-4 flex items-end gap-3">
      <span class="whitespace-nowrap text-4xl font-bold" :style="{ color }">{{ pct(total.done, total.planned) }} %</span>
      <span class="pb-1 text-sm text-gray-600">
        réalisé · {{ km(total.done) }} sur {{ km(total.planned) }} prévus sur le territoire
      </span>
    </div>
    <div class="relative mt-2 h-4 w-full overflow-hidden rounded-full bg-gray-200">
      <div class="h-full rounded-full" :style="{ width: `${pct(total.done, total.planned)}%`, background: color }" />
      <div
        v-if="plan.target"
        class="absolute top-0 h-full w-0.5 bg-gray-900"
        :style="{ left: `${plan.target}%` }"
        :title="`Objectif ${plan.target} %`"
      />
    </div>
    <p v-if="expectedPct !== null" class="mt-2 text-xs text-gray-500">
      Au rythme prévu, on devrait en être à {{ expectedPct }} % fin {{ currentYear }}.
    </p>

    <details class="mt-4 group">
      <summary class="cursor-pointer select-none text-sm font-medium text-lvv-blue-600 hover:underline">
        Détail par ville
      </summary>
      <table class="mt-3 w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500">
            <th class="py-1 font-medium">Ville</th>
            <th class="py-1 font-medium text-right">Réalisé</th>
            <th class="py-1 font-medium text-right">Prévu</th>
            <th class="w-1/3 py-1 pl-3 font-medium">Avancement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sortedCommunes" :key="row.commune" class="border-t border-gray-100">
            <td class="py-1.5">{{ row.commune }}</td>
            <td class="py-1.5 text-right tabular-nums">{{ km(row.doneKm) }}</td>
            <td class="py-1.5 text-right tabular-nums">{{ km(row.plannedKm) }}</td>
            <td class="py-1.5 pl-3">
              <div class="flex items-center gap-2">
                <div class="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: `${pct(row.doneKm, row.plannedKm)}%`, background: color }"
                  />
                  <div
                    v-if="plan.target"
                    class="absolute top-0 h-full w-px bg-gray-900"
                    :style="{ left: `${plan.target}%` }"
                  />
                </div>
                <span class="w-10 text-right tabular-nums">{{ pct(row.doneKm, row.plannedKm) }} %</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { PlanProgress } from '~/helpers/objectifs-exemple';

const props = defineProps<{ plan: PlanProgress; color: string }>();

const currentYear = new Date().getFullYear();
const overdue = computed(() => currentYear > props.plan.deadline && pct(total.value.done, total.value.planned) < 100);

const total = computed(() => ({
  done: props.plan.communes.reduce((s, r) => s + r.doneKm, 0),
  planned: props.plan.communes.reduce((s, r) => s + r.plannedKm, 0),
}));

const sortedCommunes = computed(() =>
  [...props.plan.communes].sort((a, b) => pct(b.doneKm, b.plannedKm) - pct(a.doneKm, a.plannedKm)),
);

// Avancement attendu si le plan était réalisé de façon linéaire sur sa période.
const expectedPct = computed(() => {
  const [start, end] = props.plan.period.split('-').map(Number);
  if (!start || !end || currentYear >= end) return null;
  return Math.round(((currentYear - start + 1) / (end - start + 1)) * 100);
});

function pct(done: number, planned: number): number {
  return planned > 0 ? Math.round((done / planned) * 100) : 0;
}
function km(v: number): string {
  return `${v.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}
</script>
