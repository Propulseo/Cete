-- Article éditorial + ressource téléchargeable : nouvelle édition des Fiches
-- Techniques BT du Comité des Travaux Sous Tension (CTST), applicable au
-- 1er septembre 2026.
--
-- 1) Un article publié (catégorie Réglementation), bilingue FR/EN, dont le corps
--    pointe vers le PDF hébergé en public : /resources/ft-bt-edition-2026-09.pdf
-- 2) Une entrée `resources` (catégorie reglementation, type pdf, téléchargement)
--    référençant ce même fichier public → visible dans l'espace client.
--
-- ⚠️ Le fichier PDF lui-même doit être déposé dans public/resources/ sous le nom
--    ft-bt-edition-2026-09.pdf (voir public/resources/README.md). Sans lui, le
--    lien de téléchargement pointe dans le vide.
--
-- Idempotent (guard `where not exists`) : rejouable sans effet de bord.
-- Route d'application : SQL Editor du dashboard Supabase (cf. README migrations).
-- Dollar-quoting ($md$…$md$) pour éviter tout échappement d'apostrophes.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) Article : Évolution des Fiches Techniques BT — Édition du 1er septembre 2026
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.articles
  (title, slug, excerpt, content, author, author_role, category, status,
   published_date, views, featured, read_minutes, meta_description,
   title_en, excerpt_en, content_en, meta_description_en)
select
  v.title, v.slug, v.excerpt, v.content, v.author, v.author_role, v.category,
  v.status, v.published_date::date, v.views, v.featured, v.read_minutes,
  v.meta_description, v.title_en, v.excerpt_en, v.content_en, v.meta_description_en
from (values (
  $md$Évolution des Fiches Techniques BT — Édition du 1er septembre 2026$md$,
  $md$fiches-techniques-bt-edition-2026$md$,
  $md$Le Comité des Travaux Sous Tension publie une nouvelle édition des Fiches Techniques BT, applicable au 1er septembre 2026. Tour d'horizon des évolutions qui impactent les matériels, les procédures et les pratiques de terrain des équipes TST.$md$,
  $md$Le Comité des Travaux Sous Tension (CTST) a publié la nouvelle édition des **Fiches Techniques BT**, applicable **à compter du 1er septembre 2026**. Cette mise à jour intègre plusieurs évolutions visant à améliorer la sécurité, la cohérence des documents et l'utilisation des outils TST.

Cette nouvelle édition prend notamment en compte le recueil **FD C18-510-1**, qui remplace désormais le recueil UTE C18-510-1, et rappelle que la version applicable des Fiches Techniques est disponible sur le site du Comité des Travaux Sous Tension.

## Les principales évolutions

Parmi les modifications les plus significatives :

- **Suppression du paragraphe « Méthode de travail »** dans l'ensemble des Fiches Techniques. Les informations sont désormais intégrées dans les rubriques « Fonction – Utilisation » et « Conditions de mise en œuvre », afin de simplifier la lecture et d'améliorer la cohérence documentaire.
- **Création d'une liste des outils soumis au contrôle périodique TST**, conformément aux prescriptions de la CET BT – Partie 2 « Outils TST ». Cette évolution clarifie les responsabilités des employeurs concernant le suivi des matériels.
- **Évolution des prescriptions concernant les gants isolants (FT BT 105 et 107)** : adaptation des catégories de gants aux risques réels conformément à la norme NF EN 60903, renforcement des vérifications avant utilisation, et précision des performances minimales attendues pour les surgants.
- **Mise à jour des caractéristiques de plusieurs outils à main (FT BT 401 à 405)**, avec une harmonisation des matériaux isolants et de leur identification (couleur orangée et/ou rouge).
- **Suppression ou retrait de certaines Fiches Techniques** devenues obsolètes, lorsque leur période de validité est échue ou que les matériels ne sont plus utilisés.
- **Actualisation de plusieurs références techniques**, notamment la prise de potentiel (FT BT 811 — nouvelle prise adaptée à la connectique M12), les outils de préparation et les produits de nettoyage.

## Le rôle essentiel des référents TST

Les référents Travaux Sous Tension sont invités à :

- télécharger la dernière édition des Fiches Techniques ;
- vérifier que la documentation interne est bien à jour ;
- identifier les évolutions impactant les matériels, les procédures et les pratiques de terrain.

Cette veille documentaire constitue un élément essentiel du maintien des compétences et de la conformité des interventions TST.

## Une information à diffuser à tous les acteurs concernés

Ces évolutions doivent impérativement être portées à la connaissance de l'ensemble des opérateurs habilités T, mais également de l'encadrement TST, afin de garantir :

- une parfaite connaissance des nouvelles prescriptions ;
- une préparation des travaux conforme aux exigences en vigueur ;
- une utilisation des matériels en adéquation avec les nouvelles Fiches Techniques ;
- le maintien d'un niveau élevé de sécurité lors des interventions sous tension.

## La prévention passe aussi par l'information

L'évolution régulière des Fiches Techniques traduit la volonté permanente d'améliorer la sécurité des interventions sous tension. Leur appropriation par les référents, les encadrants et les opérateurs est indispensable pour garantir des pratiques homogènes, conformes et sécurisées.

Chez **CETé ADN®**, nous encourageons chaque entreprise à intégrer systématiquement ces évolutions dans ses démarches de prévention, ses causeries sécurité et ses actions de maintien des compétences.

---

**Ressource à télécharger** — [Recueil des Fiches Techniques BT, édition du 1er septembre 2026 (PDF)](/resources/ft-bt-edition-2026-09.pdf). Source : Comité des Travaux Sous Tension (CTST).$md$,
  $md$Équipe CETé$md$,
  $md$Veille réglementaire$md$,
  $md$Réglementation$md$,
  $md$published$md$,
  $md$2026-07-21$md$,
  0,
  false,
  4,
  $md$Nouvelle édition des Fiches Techniques BT (Comité des Travaux Sous Tension) applicable au 1er septembre 2026 : contrôle périodique des outils, gants isolants, outils à main, prise de potentiel M12 et recueil FD C18-510-1.$md$,
  $md$Update to the LV Technical Sheets — 1 September 2026 edition$md$,
  $md$The French Live Working Committee has released a new edition of the LV Technical Sheets, applicable from 1 September 2026. An overview of the changes affecting the equipment, procedures and field practices of TST teams.$md$,
  $md$The French Live Working Committee (Comité des Travaux Sous Tension, CTST) has released the new edition of the **LV Technical Sheets** (*Fiches Techniques BT*), applicable **from 1 September 2026**. This update brings several changes designed to improve safety, document consistency and the use of live-working (TST) tools.

This new edition notably takes into account the **FD C18-510-1** collection, which now replaces the UTE C18-510-1 collection, and is a reminder that the applicable version of the Technical Sheets is available on the CTST website.

## The main changes

Among the most significant changes:

- **Removal of the "Working method" paragraph** from all Technical Sheets. The information is now integrated into the "Function – Use" and "Conditions of use" sections, to simplify reading and improve documentary consistency.
- **Creation of a list of tools subject to periodic TST inspection**, in accordance with CET BT – Part 2 "TST tools". This clarifies employers' responsibilities regarding equipment monitoring.
- **Updated requirements for insulating gloves (FT BT 105 and 107)**: glove categories aligned with real risks in accordance with the NF EN 60903 standard, stronger pre-use checks, and clearer minimum performance requirements for over-gloves.
- **Updated specifications for several hand tools (FT BT 401 to 405)**, with harmonised insulating materials and their identification (orange and/or red colour).
- **Removal or withdrawal of certain Technical Sheets** that have become obsolete, when their validity period has expired or the equipment is no longer in use.
- **Updates to several technical references**, in particular the potential tap (FT BT 811 — a new tap suited to M12 connectors), preparation tools and cleaning products.

## The key role of TST referents

Live-working referents are invited to:

- download the latest edition of the Technical Sheets;
- check that internal documentation is up to date;
- identify the changes affecting equipment, procedures and field practices.

This documentary watch is an essential part of maintaining skills and the compliance of TST operations.

## Information to be shared with everyone concerned

These changes must be brought to the attention of all authorised "T" operators, as well as TST supervisors, to ensure:

- a full understanding of the new requirements;
- work preparation that complies with the requirements in force;
- use of equipment consistent with the new Technical Sheets;
- a high level of safety during live-working operations.

## Prevention also relies on information

The regular evolution of the Technical Sheets reflects the ongoing commitment to improving the safety of live-working operations. Their adoption by referents, supervisors and operators is essential to ensure consistent, compliant and safe practices.

At **CETé ADN®**, we encourage every company to systematically incorporate these changes into its prevention approach, its safety talks and its skills-maintenance actions.

---

**Resource to download** — [Collection of LV Technical Sheets, 1 September 2026 edition (PDF)](/resources/ft-bt-edition-2026-09.pdf). Source: French Live Working Committee (CTST).$md$,
  $md$New edition of the LV Technical Sheets (French Live Working Committee) applicable from 1 September 2026: periodic tool inspection, insulating gloves, hand tools, M12 potential tap and the FD C18-510-1 collection.$md$
)) as v(title, slug, excerpt, content, author, author_role, category, status,
        published_date, views, featured, read_minutes, meta_description,
        title_en, excerpt_en, content_en, meta_description_en)
where not exists (select 1 from public.articles a where a.slug = v.slug);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) Ressource téléchargeable : le recueil PDF (espace client, cat. reglementation)
--    url = fichier public /resources/ft-bt-edition-2026-09.pdf (storage_path NULL).
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.resources
  (title, description, category, type, access_type, url, source,
   published_date, visibility, assigned_client_ids)
select
  v.title, v.description, v.category, v.type, v.access_type, v.url, v.source,
  v.published_date::date, v.visibility, v.assigned_client_ids::uuid[]
from (values (
  $md$Fiches Techniques BT — Recueil, édition du 1er septembre 2026$md$,
  $md$Recueil officiel des Fiches Techniques Travaux Sous Tension (TST) basse tension du Comité des Travaux Sous Tension, applicable à compter du 1er septembre 2026.$md$,
  $md$reglementation$md$,
  $md$pdf$md$,
  $md$download$md$,
  $md$/resources/ft-bt-edition-2026-09.pdf$md$,
  $md$Comité des Travaux Sous Tension$md$,
  $md$2026-09-01$md$,
  $md$global$md$,
  $md${}$md$
)) as v(title, description, category, type, access_type, url, source,
        published_date, visibility, assigned_client_ids)
where not exists (select 1 from public.resources r where r.title = v.title);
