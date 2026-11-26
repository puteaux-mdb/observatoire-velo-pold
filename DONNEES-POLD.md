# Observatoire vélo POLD — données à fournir

Ce dépôt est une adaptation de [Cyclopolis](https://github.com/lavilleavelo/cyclopolis) (La Ville à Vélo, Lyon) au territoire Paris Ouest La Défense.
Les lignes 1 et 2 actuellement en ligne sont des **exemples fictifs** : elles seront remplacées par les vraies données.

## 1. Réglages généraux — `config.json`

| Clé                                                         | Rôle                                                                     | À compléter                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| `revName`                                                   | Nom du réseau (pluriel, singulier, abréviation)                          | Nom définitif du réseau (ex. « Lignes vélo POLD ») |
| `slug`                                                      | Préfixe des URL des lignes (`/ligne-velo-1`)                             |                                                    |
| `assoName`, `assoLink`, `assoLogoUrl`                       | Association éditrice                                                     | ✅                                                 |
| `membershipLink`, `donationLink`, `contactEmail`, `socials` | Boutons « Adhérer / Donner », contact, réseaux sociaux                   | ✅                                                 |
| `baseUrl`, `coverImageUrl`                                  | Adresse du site, image de partage                                        | ✅                                                 |
| `home.*`                                                    | Textes et chiffres de la page d'accueil (distance, budget…)              | ✅                                                 |
| `home.heroImage`                                            | Image d'accueil (sinon illustration schématique)                         | facultatif                                         |
| `nbVoiesCyclables`, `colors`                                | Nombre de lignes et couleur de chacune                                   | ✅                                                 |
| `horizonYear`, `trafficYear`                                | Échéance du plan (« prévu pour 2026 ») et année de fréquentation         | ✅                                                 |
| `features`                                                  | Afficher ou masquer : plan officiel, blog, compteurs voiture, actualités |                                                    |
| `countersDisplay`, `counterSources`                         | Rubrique compteurs vélo et sources affichées                             |                                                    |

## 2. Une ligne = deux fichiers dans `content/voies-cyclables/`

### `ligne-N.json` — le tracé (GeoJSON, coordonnées WGS84 lon/lat)

Chaque tronçon est une `Feature` `LineString` :

```json
{
  "type": "Feature",
  "properties": {
    "line": 1,
    "name": "Quai de Dion-Bouton",
    "status": "done",
    "type": "bidirectionnelle",
    "quality": "satisfactory",
    "doneAt": "15/09/2024",
    "link": "/ligne-velo-1#quai-de-dion-bouton",
    "id": "tronc-commun-quais"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [2.24, 48.88],
      [2.25, 48.89]
    ]
  }
}
```

- `status` : `to-define` (à définir), `route-study` (tracé à l'étude), `validated` (tracé validé), `works-study` (travaux à l'étude), `wip` (en travaux), `done` (réalisé), `blocked` (bloqué), `unknown` (pas d'information), `tested` (provisoire)
- `type` : `bidirectionnelle`, `bilaterale`, `voie-bus`, `voie-bus-elargie`, `velorue`, `voie-verte`, `bandes-cyclables`, `zone-de-rencontre`, `aucun`, `inconnu`
- `quality` : `satisfactory` / `unsatisfactory`
- `doneAt` (JJ/MM/AAAA) : date de mise en service, utilisée par la chronologie et l'évolution du réseau
- `id` (facultatif) : même identifiant pour un tronçon partagé par plusieurs lignes
- `networks` (facultatif) : réseaux d'appartenance, ex. `["vif", "departemental"]` ; par défaut, celui de la ligne
- `owners` (facultatif) : maîtres d'ouvrage, ex. `["Puteaux", "Département des Hauts-de-Seine"]`
- `horizon` (facultatif) : horizon de réalisation, ex. `"2027"`
- `updatedAt` : date de dernière mise à jour des informations du tronçon (JJ/MM/AAAA)
- `reviewedAt` : date de dernière revue, quand on a vérifié que les informations sont toujours justes, même sans rien changer (JJ/MM/AAAA)
- `blockedBy`, `comment`, `blogLink` (facultatifs) : qui bloque, commentaire libre, lien vers un article

Codes de lignes :
- `V` + n° pour le VIF (V20) ;
- `V92-` + n° de la route départementale suivie pour les itinéraires du Département (V92-7 pour la RD7, V92-913 pour la RD913). Convention transposable aux autres départements d'Île-de-France (V93-…, V94-…) ;
- `VP` + n° pour les voies POLD (VP1).

Le numéro interne (`number`) est libre mais unique, par exemple 20 pour V20, 9207 pour V92-7, 2001 pour VP1.

Points facultatifs dans le même fichier :

- `perspective` (photo / image de projet) : `{"type": "perspective", "line": 1, "name": "…", "imgUrl": "https://…"}`
- `danger` (point noir) : `{"type": "danger", "name": "…", "description": "…", "danger": "…"}`

### `ligne-N.md` — la page de la ligne

En-tête : `name`, `line`, `from`, `to`, `description`, `trafic`, `cover` (URL d'image, peut être vide).
Puis un titre `###` par tronçon (son ancre sert de `link` dans le JSON), avec texte, images (`::content-image`), encarts (`::banner{type="postponed"}`), liens vers les transports (`:transport-link{type=rer line=A}`) ou vers une autre ligne (`:line-link{line=2}`).

## 3. Compteurs vélo (facultatif) — `content/compteurs/velo/*.json`

```json
{
  "name": "Pont de Suresnes",
  "description": "Compteur du pont de Suresnes",
  "arrondissement": "Suresnes",
  "idPdc": 100000001,
  "coordinates": [2.228, 48.869],
  "lines": [2],
  "counts": [{ "month": "2025-01-01T00:00:00.000Z", "count": 41250 }]
}
```

Puis mettre `countersDisplay: true` dans `config.json`.

## 4. Formats acceptés pour l'import

Les données peuvent être fournies en GeoJSON, KML/KMZ, export uMap, shapefile ou tableur : elles seront converties dans le format ci-dessus.

## Lancer le site

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm generate   # site statique dans .output/public, à déposer sur n'importe quel hébergement statique
```


### Source d'un tronçon

Propriétés facultatives `source` (texte) et `sourceUrl` (lien), affichées dans l'infobulle. Exemple : `"source": "Open data « Aménagements cyclables » du Département des Hauts-de-Seine"`.

### Engagements d'un tronçon

Propriété facultative `engagements` : liste des plans dans lesquels le tronçon est inscrit, par identifiant (définis dans `config.json`, rubrique `commitments`, avec période et échéance) :

| Identifiant | Plan | Période | Échéance |
|---|---|---|---|
| `vif-phase-1` | Réseau Vélo Île-de-France (VIF), phase 1 | 2021-2025 | 2025 |
| `vif-phase-2` | Réseau Vélo Île-de-France (VIF), phase 2 | 2025-2030 | 2030 |
| `vif` | VIF, phase à préciser | 2021-2030 | 2030 |
| `cd92-2022-2028` | Plan vélo des Hauts-de-Seine | 2022-2028 | 2028 |
| `cd92-2028-2034` | Plan vélo des Hauts-de-Seine (à venir) | 2028-2034 | 2034 |
| `pold-sdc` | Schéma directeur cyclable POLD (objectif PCAE : 80 % des axes en 2025) | 2021-2025 | 2025 |

Exemple : `"engagements": ["vif-phase-1", "pold-sdc"]`. Un tronçon non réalisé dont l'échéance est passée est signalé « échéance dépassée » dans l'infobulle et peut être isolé avec le filtre correspondant.
