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

- `status` : `done` (réalisé), `wip` (en travaux), `planned` (prévu), `postponed` (reporté), `variante`, `variante-postponed`, `tested` (provisoire), `unknown`
- `type` : `bidirectionnelle`, `bilaterale`, `voie-bus`, `voie-bus-elargie`, `velorue`, `voie-verte`, `bandes-cyclables`, `zone-de-rencontre`, `aucun`, `inconnu`
- `quality` : `satisfactory` / `unsatisfactory`
- `doneAt` (JJ/MM/AAAA) : date de mise en service, utilisée par la chronologie et l'évolution du réseau
- `id` (facultatif) : même identifiant pour un tronçon partagé par plusieurs lignes

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
