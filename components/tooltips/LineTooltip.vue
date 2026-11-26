<template>
  <div class="bg-white not-prose text-gray-900 w-48">
    <div class="py-1 bg-zinc-100 flex flex-col items-center justify-center">
      <div class="font-bold text-base">
        {{ title }}
      </div>
      <div class="flex flex-row space-x-1">
        <div
          v-for="line in lines"
          :key="line"
          class="h-8 w-8 rounded-full flex items-center justify-center text-white text-base font-bold"
          :style="`background-color: ${getLineColor(line)}`"
        >
          <a :href="assetUrl(`/${config.slug}-${line}`)">
            {{ line }}
          </a>
        </div>
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
      <div v-if="feature.properties.comment" class="py-1">
        <div class="text-sm font-bold">Commentaire</div>
        <div class="text-sm">{{ feature.properties.comment }}</div>
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
import { getStatusDefinition } from '~/helpers/statuses';
import config from '~/config.json';
import type { LaneQuality, LineStringFeature } from '~/types';

const { getLineColor } = useColors();
const assetUrl = useAssetUrl();
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
