<template>
  <section class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center text-center">
        <img :src="assetUrl(config.assoLogoUrl)" :alt="`logo ${config.assoName}`" class="h-28 w-auto" />
        <h2 class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Les associations du collectif
        </h2>
        <p class="mt-3 max-w-2xl text-lg text-gray-500">
          Cet observatoire est tenu par les associations vélo du {{ config.assoName }}.
        </p>
      </div>
      <ul class="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <li v-for="asso in config.associations" :key="asso.name" class="flex flex-col items-center text-center">
          <component
            :is="asso.link ? 'a' : 'div'"
            :href="asso.link || undefined"
            :target="asso.link ? '_blank' : undefined"
            class="relative flex h-32 w-32 items-center justify-center"
          >
            <img
              :src="assetUrl(asso.logo)"
              :alt="`logo ${asso.name}`"
              class="max-h-32 max-w-32 object-contain"
              :class="{ 'opacity-50': 'enChantier' in asso && asso.enChantier }"
            />
            <template v-if="'enChantier' in asso && asso.enChantier">
              <img
                :src="assetUrl('/associations/plots-chantier.png')"
                alt=""
                class="absolute -bottom-1 -right-3 w-20 drop-shadow"
              />
              <span
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-900 shadow"
              >
                En chantier
              </span>
            </template>
          </component>
          <p class="mt-2 text-sm font-semibold text-gray-900">{{ asso.name }}</p>
          <p class="text-xs text-gray-500">{{ asso.communes.join(', ') }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const { config } = useConfig();
const assetUrl = useAssetUrl();
</script>
