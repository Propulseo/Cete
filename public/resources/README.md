# Fichiers téléchargeables (`public/resources/`)

Les fichiers déposés ici sont servis en statique à l'URL `/resources/<nom-du-fichier>`.
C'est la cible des liens de téléchargement des articles de blog et des entrées de la
table `resources` dont l'`url` commence par `/resources/`.

## Fichiers attendus

| Fichier | Utilisé par |
|---|---|
| `ft-bt-edition-2026-09.pdf` | Article « Évolution des Fiches Techniques BT — Édition du 1er septembre 2026 » (lien de téléchargement dans le corps) **et** ressource `reglementation` de l'espace client. Déposer ici le PDF « FT BT - Edition du 1er Septembre 2026 » du Comité des TST. |

> ⚠️ Tant que le PDF n'est pas déposé sous ce nom exact, le lien de téléchargement
> de l'article et la ressource de l'espace client pointent dans le vide (404).

## Convention

- Nom en minuscules, sans accents ni espaces (tirets).
- Référencer le fichier via `/resources/<nom>` (jamais un chemin absolu machine).
- Alternative pour un document réservé à un client : passer par l'éditeur admin
  (upload dans le bucket privé `client-documents`, URL signée) plutôt que ce dossier public.
