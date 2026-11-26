import type { Map as MaplibreMap } from 'maplibre-gl';
import vifContexte from '~/assets/vif-contexte.json';
import { createMutedVifLogoIcon } from './map-utils';
import { VIF_LOGOS } from './vif-logos';

// Réseau Vélo Île-de-France complet, hors du territoire (données de la Région, découpées
// avec la limite de Paris Ouest La Défense) : simple fond de plan, en gris fin, avec les logos
// des lignes grisés. Indépendant des filtres : seul le bouton « Réseau VIF » l'affiche ou le masque.

const SOURCE_ID = 'vif-context';
const LINE_LAYER_ID = 'vif-context-line';
const LOGO_LAYER_ID = 'vif-context-logos';
const ICON_PREFIX = 'vif-context-logo-';

function addMutedLogos(map: MaplibreMap) {
  const pixelRatio = Math.max(2, Math.ceil(window.devicePixelRatio || 1));
  for (const [number, logo] of Object.entries(VIF_LOGOS)) {
    const id = `${ICON_PREFIX}${number}`;
    if (map.hasImage(id)) continue;
    const canvas = createMutedVifLogoIcon(logo, pixelRatio);
    const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (imageData) {
      map.addImage(id, imageData, { pixelRatio });
    }
  }
}

/** Affiche (ou masque) le réseau VIF hors du territoire. À rappeler après chaque changement de style. */
export function plotVifContext(map: MaplibreMap, visible: boolean) {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, { type: 'geojson', data: vifContexte as GeoJSON.FeatureCollection });
  }
  addMutedLogos(map);

  // sous les limites communales et les tracés du territoire
  const beforeId = ['communes-boundaries-line', 'contour-layer'].find((id) => map.getLayer(id));

  if (!map.getLayer(LINE_LAYER_ID)) {
    map.addLayer(
      {
        id: LINE_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#9CA3AF',
          'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.8, 14, 1.6],
          'line-opacity': 0.9,
        },
      },
      beforeId,
    );
  }
  if (!map.getLayer(LOGO_LAYER_ID)) {
    map.addLayer(
      {
        id: LOGO_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        layout: {
          'icon-image': ['concat', ICON_PREFIX, ['get', 'number']],
          'icon-size': 0.28,
          'symbol-placement': 'line',
          'symbol-spacing': 450,
          'icon-rotation-alignment': 'viewport',
          'icon-allow-overlap': false,
          'icon-padding': 4,
        },
        paint: { 'icon-opacity': 0.85 },
      },
      beforeId,
    );
  }

  const visibility = visible ? 'visible' : 'none';
  map.setLayoutProperty(LINE_LAYER_ID, 'visibility', visibility);
  map.setLayoutProperty(LOGO_LAYER_ID, 'visibility', visibility);
}
