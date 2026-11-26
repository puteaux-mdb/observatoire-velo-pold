<template>
  <div class="bg-white not-prose text-gray-900 w-48">
    <div class="py-1 bg-zinc-100 flex flex-col items-center justify-center">
      <div class="font-bold text-base">
        {{ title }}
      </div>
      <div class="flex flex-row space-x-1">
        <a v-for="line in lines" :key="line" :href="assetUrl(`/${getLineCode(line).toLowerCase()}`)">
          <LineBadge :line="line" size="sm" />
        </a>
      </div>
    </div>
    <div class="px-2 divide-y">
      <div class="py-1 flex flex-col items-center">
        <div class="text-sm font-bold">Tronçon</div>
        <div class="text-sm text-center">
          {{ feature.properties.name }}
        </div>
      </div>
      <div class="py-1 flex items-center justify-between">
        <div class="text-base font-bold">Statut</div>
        <div>
          <div class="text-sm" :class="getStatus(feature.properties).class">
            {{ getStatus(feature.properties).label }}
          </div>
          <div v-if="getStatus(feature.properties).date" class="italic">
            {{ getStatus(feature.properties).date }}
          </div>
        </div>
      </div>
      <div v-if="feature.properties.status === 'blocked' && feature.properties.blockedBy" class="py-1">
        <div class="text-sm font-bold text-lvv-pink">Bloqué par</div>
        <div class="text-sm">{{ feature.properties.blockedBy }}</div>
      </div>
      <div class="py-1 flex items-center justify-between">
        <div class="text-base font-bold">Longueur</div>
        <div class="text-sm">{{ Math.round(getDistance({ features: [feature] }) / 25) * 25 }}m</div>
      </div>
      <div class="py-1 flex items-center justify-between">
        <div class="text-base font-bold">Type</div>
        <div class="text-sm text-right">
          {{ typologyNames[feature.properties.type] ?? 'Inconnu' }}
        </div>
      </div>
      <div class="py-1 flex items-start justify-between gap-2">
        <div class="text-sm font-bold">Réseau</div>
        <div class="text-sm text-right">{{ featureNetworkLabels }}</div>
      </div>
      <div class="py-1 flex items-start justify-between gap-2">
        <div class="text-sm font-bold">Maître d’ouvrage</div>
        <div class="text-sm text-right">{{ feature.properties.owners?.join(', ') || 'Non renseigné' }}</div>
      </div>
      <div v-if="featureCommitments.length" class="py-1">
        <div class="text-sm font-bold">Engagements</div>
        <ul class="mt-0.5 space-y-1">
          <li v-for="c in featureCommitments" :key="c.id" class="text-sm">
            <div>{{ c.label }}</div>
            <div class="text-xs text-gray-600">
              {{ c.period }} · échéance <strong>{{ c.deadline }}</strong>
              <span
                v-if="isCommitmentOverdue(c, feature.properties.status)"
                class="ml-1 inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800"
              >
                échéance dépassée
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="feature.properties.horizon" class="py-1 flex items-center justify-between">
        <div class="text-sm font-bold">Horizon</div>
        <div class="text-sm">{{ feature.properties.horizon }}</div>
      </div>
      <div v-if="feature.properties.updatedAt || feature.properties.reviewedAt" class="py-1 text-xs text-gray-500">
        <div v-if="feature.properties.updatedAt">Mis à jour le {{ feature.properties.updatedAt }}</div>
        <div v-if="feature.properties.reviewedAt">Revu le {{ feature.properties.reviewedAt }}</div>
      </div>
      <div v-if="feature.properties.comment" class="py-1">
        <div class="text-sm font-bold">Commentaire</div>
        <div class="text-sm">{{ feature.properties.comment }}</div>
      </div>
      <div v-if="feature.properties.source" class="py-1">
        <div class="text-sm font-bold">Source</div>
        <div class="text-sm">
          <a
            v-if="feature.properties.sourceUrl"
            :href="feature.properties.sourceUrl"
            target="_blank"
            rel="noopener"
            class="underline text-lvv-blue-600"
          >
            {{ feature.properties.source }}
          </a>
          <span v-else>{{ feature.properties.source }}</span>
        </div>
      </div>
      <div v-if="feature.properties.blogLink" class="py-1 text-sm">
        <a :href="feature.properties.blogLink" class="underline text-lvv-blue-600">En savoir plus</a>
      </div>
      <div v-if="displayQuality() && feature.properties.quality" class="py-1 flex items-center justify-between">
        <div class="text-base font-bold">Qualité</div>
        <div class="text-xs" :class="getQuality(feature.properties.quality).class">
          <Icon
            :name="getQuality(feature.properties.quality).icon"
            class="h-4 w-4 align-middle"
            :class="getQuality(feature.properties.quality).classIcon"
          />
          {{ getQuality(feature.properties.quality).label }}
        </div>
      </div>
    </div>
    <div v-if="!hasDetailsPanel" class="bg-lvv-blue-600 flex justify-center">
      <a class="p-1 text-white text-base italic hover:underline" :href="getSectionDetailsUrl(feature.properties)">
        voir le détail <Icon name="mdi:link-variant" class="h-4 w-4 text-white" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import LineBadge from '~/components/line/LineBadge.vue';
import { getLineCode, getLineNetwork, getNetworkLabel } from '~/composables/useConfig';
import { getCommitment, isCommitmentOverdue, type Commitment } from '~/helpers/commitments';
import { getStatusDefinition } from '~/helpers/statuses';
import type { LaneQuality, LineStringFeature } from '~/types';

const assetUrl = useAssetUrl();
const featureCommitments = computed(
  () => (feature.properties.engagements ?? []).map((id) => getCommitment(id)).filter(Boolean) as Commitment[],
);
const featureNetworkLabels = computed(() => {
  const ids = feature.properties.networks?.length
    ? feature.properties.networks
    : [getLineNetwork(feature.properties.line)].filter(Boolean);
  return ids.map((id) => getNetworkLabel(id as string)).join(', ') || 'Non renseigné';
});
const { getRevName, displayQuality } = useConfig();
const { getDistance, typologyNames, qualityNames } = useStats();
const { getSectionDetailsUrl } = useUrl();

const { feature, lines, hasDetailsPanel } = defineProps<{
  feature: LineStringFeature;
  lines: number[];
  hasDetailsPanel: boolean;
}>();

const title = computed(() => {
  return lines.length > 1 ? getRevName() : getRevName('singular');
});

function getDoneAtText(doneAt: string): string {
  const [day, month, year] = doneAt.split('/');
  const isBeforeMandat =
    new Date(Number(year), Number(month) - 1, Number(day)).getTime() < new Date(2021, 0, 1).getTime();
  if (isBeforeMandat) {
    return 'avant 2021';
  }
  return `le ${doneAt}`;
}

function getStatus(properties: LineStringFeature['properties']): { label: string; class: string; date?: string } {
  const definition = getStatusDefinition(properties.status);
  return {
    label: definition.label,
    class: definition.badgeClass,
    date: properties.status === 'done' && properties.doneAt ? getDoneAtText(properties.doneAt) : undefined,
  };
}

function getQuality(quality: LaneQuality): { label: string; class: string; icon: string; classIcon: string } {
  const statusMapping = {
    unsatisfactory: {
      label: qualityNames.unsatisfactory,
      class: 'rounded-xl px-1 border border-red-600',
      classIcon: 'text-red-600',
      icon: 'mdi:close',
    },
    satisfactory: {
      label: qualityNames.satisfactory,
      class: 'rounded-xl px-1 border border-green-600',
      classIcon: 'text-green-600',
      icon: 'mdi:check',
    },
  };
  return statusMapping[quality];
}
</script>
