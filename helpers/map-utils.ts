import { getContrastTextColor } from './colors';
import { VIF_LOGO_BACKGROUND, VIF_LOGO_BARS, VIF_LOGO_VIEWBOX, type VifLogo } from './vif-logos';
import type { Collections } from '@nuxt/content';

/** Dessine le logo officiel d'une ligne VIF (carré blanc, bandeaux de couleur, « V » et numéro) ; « muted » : version grisée */
function drawVifLogo(
  ctx: CanvasRenderingContext2D,
  logo: VifLogo,
  x: number,
  y: number,
  size: number,
  muted = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / VIF_LOGO_VIEWBOX, size / VIF_LOGO_VIEWBOX);
  const background = new Path2D(VIF_LOGO_BACKGROUND);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill(background);
  // fin liseré pour détacher le logo du fond de carte
  ctx.strokeStyle = muted ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 8;
  ctx.stroke(background);
  ctx.fillStyle = muted ? '#D1D5DB' : logo.color;
  ctx.fill(new Path2D(VIF_LOGO_BARS));
  ctx.fillStyle = muted ? '#9CA3AF' : '#000000';
  logo.glyphs.forEach((glyph) => ctx.fill(new Path2D(glyph)));
  ctx.restore();
}

type ColoredLineStringFeature = Extract<
  Collections['voiesCyclablesGeojson']['features'][0],
  { geometry: { type: 'LineString' } }
> & { properties: { color: string } };

// features plotted last are on top
const sortOrder = [1, 3, 2, 4, 5, 6, 7, 12, 8, 9, 10, 11].reverse();

export function sortByLine(
  featureA: Extract<Collections['voiesCyclablesGeojson']['features'][0], { geometry: { type: 'LineString' } }>,
  featureB: Extract<Collections['voiesCyclablesGeojson']['features'][0], { geometry: { type: 'LineString' } }>,
) {
  const lineA = featureA.properties.line;
  const lineB = featureB.properties.line;
  return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
}

export const MAP_PRECONNECT_LINKS = [
  'https://openmaptiles.data.gouv.fr',
  'https://openmaptiles.geo.data.gouv.fr',
  'https://openmaptiles.github.io',
].map((href) => ({ rel: 'preconnect' as const, href, crossorigin: 'anonymous' as const }));

export const CROSS_ICON_SIZE = 8;

export function getCrossIconUrl(pixelRatio = 1, lineWidth = 3): string {
  const canvas = document.createElement('canvas');
  canvas.width = CROSS_ICON_SIZE * pixelRatio; // Set the desired width of your icon
  canvas.height = CROSS_ICON_SIZE * pixelRatio; // Set the desired height of your icon
  const context = canvas.getContext('2d');
  if (!context) {
    return '';
  }

  // Draw the first diagonal line of the "X"
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width, canvas.height);
  context.lineWidth = lineWidth * pixelRatio;
  context.stroke();

  // Draw the second diagonal line of the "X"
  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(canvas.width, 0);
  context.lineWidth = lineWidth * pixelRatio;
  context.stroke();

  return canvas.toDataURL();
}

/** Logo VIF grisé, pour les lignes affichées hors du territoire */
export function createMutedVifLogoIcon(logo: VifLogo, pixelRatio = 1): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas;
  }
  ctx.scale(pixelRatio, pixelRatio);
  drawVifLogo(ctx, logo, 4, 4, size - 8, true);
  return canvas;
}

export function createLineShieldIcon(
  lineLabel: string | number,
  color: string,
  pixelRatio = 1,
  vifLogo: VifLogo | null = null,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const size = 64;

  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas;
  }
  ctx.scale(pixelRatio, pixelRatio);

  if (vifLogo) {
    drawVifLogo(ctx, vifLogo, 4, 4, size - 8);
    return canvas;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 4;

  // circle background
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();

  // white border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // line number
  ctx.fillStyle = getContrastTextColor(color);
  const label = String(lineLabel);
  ctx.font = `bold ${label.length <= 2 ? 28 : label.length === 3 ? 22 : 17}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, centerX, centerY + 3);

  return canvas;
}

export function createCompositeLineShieldIcon(
  lineLabels: Array<string | number>,
  colors: string[],
  pixelRatio = 1,
  vifLogos: Array<VifLogo | null> = [],
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const iconSize = 64;
  const radius = iconSize / 2 - 4;
  const overlapPercent = 0.3; // 30% overlap
  const spacing = iconSize - iconSize * overlapPercent; // Distance between circle centers

  canvas.width = (iconSize + spacing * (lineLabels.length - 1)) * pixelRatio;
  canvas.height = iconSize * pixelRatio;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas;
  }
  ctx.scale(pixelRatio, pixelRatio);

  lineLabels.forEach((lineLabel, index) => {
    const color = colors[index];
    const x = index * spacing + iconSize / 2;
    const centerY = iconSize / 2;

    const vifLogo = vifLogos[index];
    if (vifLogo) {
      drawVifLogo(ctx, vifLogo, x - iconSize / 2 + 4, 4, iconSize - 8);
      return;
    }

    // circle background
    ctx.fillStyle = color || '#000000';
    ctx.beginPath();
    ctx.arc(x, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // line number
    ctx.fillStyle = getContrastTextColor(color);
    const label = String(lineLabel);
    ctx.font = `bold ${label.length <= 2 ? 28 : label.length === 3 ? 22 : 17}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, centerY + 3);
  });

  return canvas;
}

export function normalizeLineDirection(coordinates: [number, number][]): [number, number][] {
  if (coordinates.length < 2) {
    return coordinates;
  }

  const start = coordinates[0];
  const end = coordinates[coordinates.length - 1];

  if (!start || !end) {
    return coordinates;
  }

  const [startLon, startLat] = start;
  const [endLon, endLat] = end;

  const latDiff = endLat - startLat;
  const lonDiff = endLon - startLon;

  const shouldReverse =
    Math.abs(lonDiff) > 0.0000001
      ? lonDiff < 0 // If going west (negative lonDiff), reverse
      : latDiff > 0; // If going north (positive latDiff), reverse

  return shouldReverse ? [...coordinates].reverse() : coordinates;
}

export function addCompositeIconNames(features: Collections['voiesCyclablesGeojson']['features']) {
  // les sections en commun ont un ID
  const sectionGroups = new Map<
    string,
    { line: number; feature: Collections['voiesCyclablesGeojson']['features'][0]; index: number }[]
  >();

  features.forEach((feature, index) => {
    if (feature.geometry.type !== 'LineString' || !('id' in feature.properties) || !feature.properties.id) {
      return;
    }

    const sectionId = feature.properties.id;
    if (!sectionGroups.has(sectionId)) {
      sectionGroups.set(sectionId, []);
    }
    sectionGroups.get(sectionId)!.push({
      line: feature.properties.line,
      feature,
      index,
    });
  });

  const compositeNamesByIndex = new Map<number, string>();

  sectionGroups.forEach((group) => {
    const uniqueLines = [...new Set(group.map((item) => item.line))].sort((a, b) => a - b);

    if (uniqueLines.length <= 1) {
      return;
    }

    const compositeIconName = `line-shield-${uniqueLines.join('-')}`;

    group.forEach((item) => {
      compositeNamesByIndex.set(item.index, compositeIconName);
    });
  });

  return features.map((feature, index) => {
    const compositeIconName = compositeNamesByIndex.get(index);
    if (compositeIconName) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          compositeIconName,
        },
      };
    }
    return feature;
  });
}

export function getUsedCompositeIcons(features: Collections['voiesCyclablesGeojson']['features']): Set<string> {
  const sectionGroups = new Map<string, number[]>();

  for (const feature of features) {
    if (feature.geometry.type !== 'LineString' || !('id' in feature.properties) || !feature.properties.id) {
      continue;
    }

    const sectionId = feature.properties.id;
    if (!sectionGroups.has(sectionId)) {
      sectionGroups.set(sectionId, []);
    }
    sectionGroups.get(sectionId)!.push(feature.properties.line);
  }

  const compositeIcons = new Set<string>();
  for (const lines of sectionGroups.values()) {
    const uniqueLines = [...new Set(lines)].sort((a, b) => a - b);
    if (uniqueLines.length > 1) {
      compositeIcons.add(uniqueLines.join('-'));
    }
  }
  return compositeIcons;
}

export function groupFeaturesByColor(features: ColoredLineStringFeature[]) {
  const featuresByColor: Record<string, ColoredLineStringFeature[]> = {};
  for (const feature of features) {
    const color = feature.properties.color;

    if (featuresByColor[color]) {
      featuresByColor[color].push(feature);
    } else {
      featuresByColor[color] = [feature];
    }
  }
  return featuresByColor;
}

export function createConstructionIcon(pixelRatio = 1): HTMLCanvasElement {
  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(2 * pixelRatio, 2 * pixelRatio);

  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.fillStyle = '#FFCC00';
  ctx.strokeStyle = '#000000';

  ctx.beginPath();
  ctx.roundRect(2, 6, 20, 8, 1);
  ctx.fill();
  ctx.stroke();

  const paths: [[number, number], [number, number]][] = [
    // Top posts
    [
      [17, 3],
      [17, 6],
    ],
    [
      [7, 3],
      [7, 6],
    ],
    // Bottom posts
    [
      [17, 14],
      [17, 21],
    ],
    [
      [7, 14],
      [7, 21],
    ],
    // Stripes
    [
      [10, 14],
      [2.3, 6.3],
    ],
    [
      [14, 6],
      [21.7, 13.7],
    ],
    [
      [8, 6],
      [16, 14],
    ],
  ];

  paths.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  });

  return canvas;
}
