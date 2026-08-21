-- Article éditorial : Engagement RSE — CETé ADN soutient Électriciens sans frontières
-- Publié (status = 'published'), catégorie Engagement, bilingue FR/EN.
--
-- Idempotent : guard `where not exists (... a.slug = v.slug)`, rejouable sans
-- effet de bord. Route d'application : SQL Editor du dashboard Supabase.
-- Dollar-quoting ($md$...$md$) pour éviter tout échappement d'apostrophes.

-- ── Étendre le check constraint pour accepter la catégorie 'Engagement' ──────
alter table public.articles drop constraint if exists articles_category_check;
alter table public.articles add constraint articles_category_check
  check (category in ('Expertise','Formation','Réglementation','Sécurité','Innovation','Engagement'));

insert into public.articles
  (title, slug, excerpt, content, author, author_role, category, status,
   published_date, views, featured, read_minutes, meta_description,
   title_en, excerpt_en, content_en, meta_description_en)
select
  v.title, v.slug, v.excerpt, v.content, v.author, v.author_role, v.category,
  v.status, v.published_date::date, v.views, v.featured, v.read_minutes,
  v.meta_description, v.title_en, v.excerpt_en, v.content_en, v.meta_description_en
from (values (
  $md$Engagement RSE : CETé ADN soutient Électriciens sans frontières$md$,
  $md$engagement-rse-electriciens-sans-frontieres$md$,
  $md$Chez CETé ADN, nous croyons que la force d'un collectif prend tout son sens lorsqu'elle dépasse nos frontières professionnelles. C'est pourquoi nous sommes fiers de soutenir Électriciens sans frontières (ESF), une ONG qui donne accès à l'énergie et à l'eau aux populations les plus vulnérables.$md$,
  $md$Chez **CETé ADN®**, nous croyons profondément que *la force d'un collectif* prend tout son sens lorsqu'elle dépasse nos frontières professionnelles. C'est pourquoi nous sommes fiers de soutenir **Électriciens sans frontières (ESF)**, une organisation non gouvernementale reconnue d'utilité publique qui donne accès à l'énergie et à l'eau aux populations les plus vulnérables à travers le monde.

## Pourquoi Électriciens sans frontières ?

En tant qu'experts techniques en électricité, partager notre savoir-faire et contribuer à donner accès à l'énergie aux communautés qui en sont privées est une évidence. L'accès à l'électricité n'est pas un confort — c'est un levier fondamental de développement : éducation, santé, activité économique, sécurité.

Depuis sa création en 1986, **Électriciens sans frontières** a mené plus de **350 projets** dans **40 pays**, permettant à des centaines de milliers de personnes de bénéficier d'un accès durable à l'énergie. Leurs interventions couvrent :

- l'**électrification de centres de santé** et d'écoles en zones rurales ;
- l'**installation de systèmes solaires** pour l'accès à l'eau potable ;
- la **formation de techniciens locaux** pour garantir la pérennité des installations ;
- l'**aide d'urgence** lors de catastrophes naturelles (rétablissement des réseaux électriques).

## Un partenariat qui incarne nos valeurs

Ce partenariat avec ESF s'inscrit naturellement dans la démarche de responsabilité sociétale des entreprises (RSE) de CETé ADN. Il incarne les valeurs qui fondent notre consortium :

### Solidarité
Nous mettons notre expertise au service de ceux qui en ont le plus besoin. La solidarité n'est pas un mot affiché sur un mur — c'est un engagement concret qui se traduit par un soutien financier et un partage de compétences.

### Partage d'expertise
Notre savoir-faire en maîtrise du risque électrique a une portée qui va au-delà de l'évaluation et de la notation. Il peut contribuer à sécuriser des installations dans des contextes où les normes et les ressources sont limitées.

### Engagement durable
Nous ne nous contentons pas d'un geste ponctuel. Notre soutien à ESF s'inscrit dans la durée, parce que l'accès à l'énergie est un défi de long terme qui nécessite un engagement constant.

## L'énergie comme vecteur d'égalité

Aujourd'hui encore, **près de 675 millions de personnes** dans le monde n'ont pas accès à l'électricité. Cette réalité touche principalement l'Afrique subsaharienne et l'Asie du Sud, où l'absence d'énergie freine le développement humain et économique.

En soutenant Électriciens sans frontières, CETé ADN participe à :

- **éclairer des vies** — littéralement et symboliquement ;
- **bâtir des infrastructures essentielles** pour des communautés du monde entier ;
- **former les acteurs locaux** pour un développement autonome et durable ;
- **sensibiliser le secteur de l'électricité** à sa responsabilité sociale.

## Agir ensemble

Nous sommes convaincus que chaque acteur du secteur de l'électricité peut contribuer à cet effort collectif. Que vous soyez entreprise, indépendant ou salarié, vous pouvez :

- [Découvrir les actions d'ESF sur le terrain](https://www.electriciens-sans-frontieres.org/)
- Faire un don ou devenir bénévole
- Relayer leurs campagnes auprès de vos réseaux

---

*Chez CETé ADN®, la prévention des risques est notre métier. La solidarité est notre conviction. Ensemble, éclairons des vies.*$md$,
  $md$Équipe CETé$md$,
  $md$Engagement RSE$md$,
  $md$Engagement$md$,
  $md$published$md$,
  $md$2026-08-21$md$,
  0,
  true,
  5,
  $md$CETé ADN soutient Électriciens sans frontières (ESF) dans le cadre de sa démarche RSE. Solidarité, partage d'expertise et engagement durable pour l'accès à l'énergie des populations vulnérables.$md$,
  $md$CSR Commitment: CETé ADN supports Électriciens sans frontières$md$,
  $md$At CETé ADN, we believe the strength of a collective takes on its full meaning when it extends beyond professional boundaries. That is why we are proud to support Électriciens sans frontières (ESF), an NGO providing access to energy and water for the most vulnerable populations.$md$,
  $md$At **CETé ADN®**, we firmly believe that *the strength of a collective* takes on its full meaning when it extends beyond our professional boundaries. That is why we are proud to support **Électriciens sans frontières (ESF)**, a public-benefit non-governmental organisation that provides access to energy and water for the most vulnerable populations around the world.

## Why Électriciens sans frontières?

As electrical engineering experts, sharing our know-how and helping provide access to energy for communities that lack it is a natural commitment. Access to electricity is not a comfort — it is a fundamental driver of development: education, health, economic activity, safety.

Since its founding in 1986, **Électriciens sans frontières** has carried out over **350 projects** in **40 countries**, enabling hundreds of thousands of people to benefit from sustainable access to energy. Their operations include:

- **electrification of health centres** and schools in rural areas;
- **installation of solar systems** for access to clean water;
- **training of local technicians** to ensure the long-term sustainability of installations;
- **emergency relief** during natural disasters (restoring electrical networks).

## A partnership that embodies our values

This partnership with ESF is a natural part of CETé ADN's corporate social responsibility (CSR) approach. It embodies the values at the heart of our consortium:

### Solidarity
We put our expertise at the service of those who need it most. Solidarity is not a word on a wall — it is a concrete commitment expressed through financial support and skills sharing.

### Knowledge sharing
Our expertise in electrical risk management has a reach that goes beyond assessment and rating. It can help secure installations in contexts where standards and resources are limited.

### Lasting engagement
We are not content with a one-off gesture. Our support for ESF is a long-term commitment, because access to energy is a challenge that requires constant dedication.

## Energy as a driver of equality

Today, **nearly 675 million people** worldwide still lack access to electricity. This reality primarily affects sub-Saharan Africa and South Asia, where the absence of energy hampers human and economic development.

By supporting Électriciens sans frontières, CETé ADN helps:

- **light up lives** — literally and symbolically;
- **build essential infrastructure** for communities around the world;
- **train local stakeholders** for autonomous and sustainable development;
- **raise awareness** in the electricity sector about its social responsibility.

## Acting together

We are convinced that every stakeholder in the electricity sector can contribute to this collective effort. Whether you are a company, a freelancer or an employee, you can:

- [Discover ESF's field actions](https://www.electriciens-sans-frontieres.org/)
- Make a donation or volunteer
- Share their campaigns with your networks

---

*At CETé ADN®, risk prevention is our profession. Solidarity is our conviction. Together, let us light up lives.*$md$,
  $md$CETé ADN supports Électriciens sans frontières (ESF) as part of its CSR commitment. Solidarity, knowledge sharing and lasting engagement for energy access for vulnerable populations.$md$
)) as v(title, slug, excerpt, content, author, author_role, category, status,
        published_date, views, featured, read_minutes, meta_description,
        title_en, excerpt_en, content_en, meta_description_en)
where not exists (select 1 from public.articles a where a.slug = v.slug);
