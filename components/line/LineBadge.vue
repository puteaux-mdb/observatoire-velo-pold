<template>
  <!-- Ligne VIF : logo officiel de la Région -->
  <svg
    v-if="logo"
    :viewBox="`0 0 ${VIF_LOGO_VIEWBOX} ${VIF_LOGO_VIEWBOX}`"
    :class="sizeClass"
    class="flex-shrink-0 rounded-[9%] ring-1 ring-black/10"
    role="img"
    :aria-label="code"
  >
    <title>{{ code }}</title>
    <path :d="VIF_LOGO_BACKGROUND" fill="#FFFFFF" />
    <path :d="VIF_LOGO_BARS" :fill="logo.color" />
    <path
      v-for="(glyph, index) in logo.glyphs"
      :key="index"
      :d="glyph"
      fill="#000000"
    />
  </svg>
  <!-- Autres réseaux : capsule de couleur -->
  <span
    v-else
    :class="capsuleClass"
    class="w-fit px-1.5 whitespace-nowrap rounded-full inline-flex items-center justify-center font-bold leading-none flex-shrink-0"
    :style="{
      backgroundColor: getLineColor(line),
      color: getLineTextColor(line),
    }"
  >
    {{ code }}
  </span>
</template>

<script setup lang="ts">
import { getLineCode } from "~/composables/useConfig";
import { getVifLogo } from "~/helpers/vif-logo-utils";
import {
  VIF_LOGO_BACKGROUND,
  VIF_LOGO_BARS,
  VIF_LOGO_VIEWBOX,
} from "~/helpers/vif-logos";

const props = withDefaults(
  defineProps<{ line: number; size?: "xs" | "sm" | "md" | "lg" }>(),
  { size: "md" },
);

const { getLineColor, getLineTextColor } = useColors();

const logo = computed(() => getVifLogo(Number(props.line)));
const code = computed(() => getLineCode(Number(props.line)));

const sizeClass = computed(
  () =>
    ({ xs: "h-6 w-6", sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" })[
      props.size
    ],
);
const capsuleClass = computed(
  () =>
    ({
      xs: "h-6 min-w-6 text-[10px]",
      sm: "h-8 min-w-8 text-base",
      md: "h-10 min-w-10",
      lg: "h-12 min-w-12",
    })[props.size],
);
</script>
