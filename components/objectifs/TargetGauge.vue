<template>
  <svg viewBox="0 0 240 150" class="w-full max-w-xs" role="img" :aria-label="`${valueText}, ${targetText}`">
    <path :d="arc(0, max)" fill="none" stroke="#e5e7eb" stroke-width="22" stroke-linecap="round" />
    <path v-if="value > 0" :d="arc(0, value)" fill="none" :stroke="color" stroke-width="22" stroke-linecap="round" />
    <line
      :x1="point(target, 72).x"
      :y1="point(target, 72).y"
      :x2="point(target, 112).x"
      :y2="point(target, 112).y"
      stroke="#111827"
      stroke-width="3"
    />
    <text
      :x="point(target, 128).x"
      :y="point(target, 128).y"
      :text-anchor="target > max * 0.6 ? 'end' : target < max * 0.4 ? 'start' : 'middle'"
      class="fill-gray-900"
      font-size="11"
      font-weight="700"
    >
      {{ targetText }}
    </text>
    <text x="120" y="112" text-anchor="middle" font-size="32" font-weight="700" :fill="color">{{ valueText }}</text>
    <text x="120" y="132" text-anchor="middle" font-size="11" class="fill-gray-500">{{ caption }}</text>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number;
    target: number;
    color: string;
    max?: number;
    valueLabel?: string;
    targetLabel?: string;
    caption?: string;
  }>(),
  { max: 100, valueLabel: undefined, targetLabel: undefined, caption: 'des axes réalisés' },
);

const valueText = computed(() => props.valueLabel ?? `${props.value} %`);
const targetText = computed(() => props.targetLabel ?? `objectif ${props.target} %`);

const CX = 120;
const CY = 118;
const R = 92;

function point(v: number, r = R) {
  const p = Math.min(Math.max(v / props.max, 0), 1);
  const a = Math.PI * (1 - p);
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
}
function arc(from: number, to: number) {
  const s = point(from);
  const e = point(to);
  return `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${e.x} ${e.y}`;
}
</script>
