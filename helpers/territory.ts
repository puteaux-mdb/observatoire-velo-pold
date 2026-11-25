import type { Map as MaplibreMap } from 'maplibre-gl';
import territoire from '~/assets/territoire-pold.json';

const SOURCE_ID = 'territory-boundary';
const CASING_LAYER_ID = 'territory-boundary-casing';
const LINE_LAYER_ID = 'territory-boundary-line';

/**
 * Affiche (ou masque) la limite du territoire sous les tracés des lignes.
 * À rappeler après chaque changement de style de carte, qui efface les couches.
 */
export function plotTerritoryBoundary(map: MaplibreMap, visible: boolean) {
  if (!map.getSource(SOURCE_ID)) {
    map.addSource(SOURCE_ID, { type: 'geojson', data: territoire as GeoJSON.FeatureCollection });
  }

  // on dessine la limite sous les tracés des lignes cyclables
  const beforeId = map.getLayer('contour-layer') ? 'contour-layer' : undefined;

  if (!map.getLayer(CASING_LAYER_ID)) {
    map.addLayer(
      {
        id: CASING_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        paint: { 'line-color': '#ffffff', 'line-width': 6, 'line-opacity': 0.8 },
      },
      beforeId,
    );
  }
  if (!map.getLayer(LINE_LAYER_ID)) {
    map.addLayer(
      {
        id: LINE_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#C84271', 'line-width': 2.5, 'line-dasharray': [3, 2] },
      },
      beforeId,
    );
  }

  const visibility = visible ? 'visible' : 'none';
  map.setLayoutProperty(CASING_LAYER_ID, 'visibility', visibility);
  map.setLayoutProperty(LINE_LAYER_ID, 'visibility', visibility);
}
