-- ============================================================================
-- CETé — Seed de DÉMONSTRATION (données réalistes pour visualiser l'UI admin/client)
-- ============================================================================
-- NON destructif et IDEMPOTENT : ré-exécutable sans créer de doublons
-- (gardes `where not exists` / `on conflict`). Ne touche pas aux comptes auth ni
-- au client « Société Démo » existant (lié à client@cete.fr).
--
-- Pré-requis : schéma migré (migrations 1→8), `admin@cete.fr` présent en `profiles`.
-- Application : via Supabase MCP `execute_sql` (DML, pas DDL) ou `psql`.
--
-- Données rattachées au client démo (visibles depuis le portail client@cete.fr) :
--   client_id = d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172
-- uploaded_by des documents = admin@cete.fr = 935e7600-5374-4315-9f56-f7791c68650e
-- (⚠ adapter ces 2 UUID si la base est repartie de zéro / comptes recréés)
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- 1/5 — clients + client_contacts
-- ──────────────────────────────────────────────────────────────────────────
insert into public.clients
  (slug, company_name, legal_form, siret, vat_number, sector, headcount,
   address_street, address_postal_code, address_city, status,
   contract_start_date, contract_end_date, internal_notes)
values
  ('voltalia-industries','Voltalia Industries','SAS','48217635400021','FR48482176354','industrie','250-500',
   '12 avenue des Frères Lumière','69008','Lyon','active','2024-03-01','2027-02-28','Site principal + 2 ateliers TST. Client référent secteur industrie.'),
  ('groupe-mistral-logistique','Groupe Mistral Logistique','SARL','39458712300035',null,'logistique','100-250',
   '8 quai du Lazaret','13002','Marseille','active','2024-09-15','2026-09-14','Entrepôts frigorifiques, tableaux HT à surveiller.'),
  ('tertia-bureaux','Tertia Bureaux','SA','52391048700019','FR52523910487','tertiaire','50-100',
   '45 rue de La Boétie','75008','Paris','active','2025-01-10','2028-01-09','Immeuble de bureaux IGH, contrat triennal.'),
  ('chu-rives-de-loire','CHU Rives-de-Loire','autre','26440217800048',null,'medical','1000+',
   '1 boulevard Jean Monnet','44093','Nantes','active','2024-06-01','2027-05-31','Établissement de santé, blocs critiques. Priorité continuité.'),
  ('residence-le-parc','Résidence Le Parc','SCI','81022547600027',null,'immobilier','10-50',
   '22 cours de l''Intendance','33000','Bordeaux','onboarding','2026-05-01',null,'Onboarding en cours, première visite à planifier.'),
  ('neo-energie','Néo Énergie','SAS','90357218400013','FR90903572184','industrie','50-100',
   '3 rue de l''Hippodrome','59000','Lille','paused','2023-11-01','2025-10-31','Contrat suspendu — renégociation en cours.'),
  ('cinema-lumiere','ErP Cinéma Lumière','EURL','44781209600022',null,'erp_collectif','10-50',
   '14 allée Jean Jaurès','31000','Toulouse','archived','2022-04-01','2024-03-31','Contrat clôturé, archivé. Historique conservé.')
on conflict (slug) do nothing;

insert into public.client_contacts (client_id, first_name, last_name, role, email, phone, is_primary)
select id, v.fn, v.ln, v.r, v.em, v.ph, v.pri from public.clients c
join (values
  ('voltalia-industries','Hélène','Mercier','Directrice HSE','h.mercier@voltalia-ind.fr','+33 4 72 00 11 22',true),
  ('voltalia-industries','Karim','Benali','Responsable maintenance','k.benali@voltalia-ind.fr','+33 4 72 00 11 23',false),
  ('groupe-mistral-logistique','Sophie','Garnier','Resp. sécurité','s.garnier@mistral-log.fr','+33 4 91 00 33 44',true),
  ('tertia-bureaux','Antoine','Lefebvre','Directeur technique','a.lefebvre@tertia.fr','+33 1 44 00 55 66',true),
  ('chu-rives-de-loire','Dr Claire','Rousseau','Ingénieure biomédicale','c.rousseau@chu-rdl.fr','+33 2 40 00 77 88',true),
  ('chu-rives-de-loire','Marc','Dubreuil','Services techniques','m.dubreuil@chu-rdl.fr','+33 2 40 00 77 89',false),
  ('residence-le-parc','Isabelle','Fontaine','Gérante SCI','i.fontaine@residence-leparc.fr','+33 5 56 00 99 00',true),
  ('neo-energie','Thomas','Picard','Resp. exploitation','t.picard@neo-energie.fr','+33 3 20 00 11 22',true),
  ('cinema-lumiere','Julien','Moreau','Gérant','j.moreau@cinema-lumiere.fr','+33 5 61 00 22 33',true),
  ('societe-demo','Paul','Durand','Responsable QSE','p.durand@societe-demo.fr','+33 1 23 45 67 89',true)
) as v(slug,fn,ln,r,em,ph,pri) on c.slug = v.slug
where not exists (
  select 1 from public.client_contacts cc where cc.client_id = c.id and cc.first_name = v.fn and cc.last_name = v.ln
);

-- ──────────────────────────────────────────────────────────────────────────
-- 2/5 — contract_documents (uploaded_by = admin) + certificates
-- ──────────────────────────────────────────────────────────────────────────
insert into public.contract_documents
  (client_id, type, title, version, file_name, file_size, mime_type, uploaded_by, status, notes)
select c.id, v.typ, v.title, v.ver, v.fname, v.fsize, 'application/pdf',
       '935e7600-5374-4315-9f56-f7791c68650e'::uuid, v.st, v.notes
from public.clients c
join (values
  ('voltalia-industries','contract','Contrat de notation 2024-2027',1,'contrat-voltalia-2024.pdf',284512,'signed','Signé par les 2 parties.'),
  ('voltalia-industries','report','Rapport d''évaluation — Atelier TST Lyon',2,'rapport-voltalia-lyon.pdf',1842300,'signed','Rapport final remis au client.'),
  ('groupe-mistral-logistique','contract','Contrat de notation 2024-2026',1,'contrat-mistral.pdf',265120,'signed',null),
  ('groupe-mistral-logistique','report','Rapport d''évaluation — Entrepôt Marseille',1,'rapport-mistral-marseille.pdf',1523400,'signed',null),
  ('tertia-bureaux','quote','Devis notation IGH',1,'devis-tertia-igh.pdf',98230,'sent','En attente de signature.'),
  ('tertia-bureaux','contract','Contrat de notation 2025-2028',1,'contrat-tertia.pdf',271800,'signed',null),
  ('tertia-bureaux','report','Rapport d''évaluation — Siège Paris',1,'rapport-tertia-paris.pdf',1689200,'signed',null),
  ('chu-rives-de-loire','contract','Contrat-cadre établissement de santé',1,'contrat-chu.pdf',312400,'signed','Contrat-cadre multi-sites.'),
  ('chu-rives-de-loire','report','Rapport d''évaluation — Bloc technique Nantes',1,'rapport-chu-nantes.pdf',2104500,'signed',null),
  ('neo-energie','offer','Offre commerciale renouvellement',1,'offre-neo-energie.pdf',76400,'sent','Renégociation en cours.'),
  ('neo-energie','report','Rapport d''évaluation — Site Lille (2023)',1,'rapport-neo-2023.pdf',1402900,'archived','Document archivé.'),
  ('cinema-lumiere','contract','Contrat de notation 2022-2024',1,'contrat-cinema.pdf',241000,'archived','Contrat clôturé.'),
  ('societe-demo','report','Rapport d''évaluation — Siège Démo',1,'rapport-societe-demo.pdf',1325000,'signed',null),
  ('societe-demo','quote','Devis renouvellement 2026',1,'devis-demo-2026.pdf',54200,'draft','Brouillon.')
) as v(slug,typ,title,ver,fname,fsize,st,notes) on c.slug = v.slug
where not exists (select 1 from public.contract_documents d where d.client_id = c.id and d.title = v.title);

insert into public.certificates
  (certificate_number, client_id, company_name, siren, address, composite_rating,
   vigi_score, vigi_score_tendance, sub_criteria, evaluation_date, validity_date, expert_name, status)
select v.num, c.id, v.cname, v.siren, v.addr, v.comp, v.vigi, v.tend,
       v.sub::jsonb, v.edate::date, v.vdate::date, v.expert, v.st
from public.clients c
join (values
  ('CETE-2026-0001','voltalia-industries','Voltalia Industries','482176354','12 avenue des Frères Lumière, 69008 Lyon','BAB','B','+','{"autoEvaluation":"B+","recommandation":"A-","gestesMetiers":"B"}','2026-02-15','2029-02-15','Michel LIGIER','valide'),
  ('CETE-2025-0042','groupe-mistral-logistique','Groupe Mistral Logistique','394587123','8 quai du Lazaret, 13002 Marseille','CBC','C','','{"autoEvaluation":"C+","recommandation":"B","gestesMetiers":"C"}','2025-10-20','2028-10-20','Bruno CLAUDEL','valide'),
  ('CETE-2026-0007','tertia-bureaux','Tertia Bureaux','523910487','45 rue de La Boétie, 75008 Paris','AAB','A','+','{"autoEvaluation":"A","recommandation":"A-","gestesMetiers":"B+"}','2026-03-05','2029-03-05','Pierre VIRELY','valide'),
  ('CETE-2025-0031','chu-rives-de-loire','CHU Rives-de-Loire','264402178','1 boulevard Jean Monnet, 44093 Nantes','BBA','B','-','{"autoEvaluation":"B","recommandation":"B","gestesMetiers":"A-"}','2025-07-10','2028-07-10','Michel LIGIER','valide'),
  ('CETE-2023-0118','neo-energie','Néo Énergie','903572184','3 rue de l''Hippodrome, 59000 Lille','DCD','D','-','{"autoEvaluation":"D","recommandation":"C-","gestesMetiers":"D"}','2023-09-01','2025-08-31','Bruno CLAUDEL','expire'),
  ('CETE-2022-0090','cinema-lumiere','ErP Cinéma Lumière','447812096','14 allée Jean Jaurès, 31000 Toulouse','CCC','C','','{"autoEvaluation":"C","recommandation":"C","gestesMetiers":"C"}','2022-06-15','2024-06-15','Pierre VIRELY','expire'),
  ('CETE-2026-0012','societe-demo','Société Démo','123456789','1 rue de la Démo, 75001 Paris','ABA','A','+','{"autoEvaluation":"A-","recommandation":"B+","gestesMetiers":"A"}','2026-04-01','2029-04-01','Michel LIGIER','valide')
) as v(num,slug,cname,siren,addr,comp,vigi,tend,sub,edate,vdate,expert,st) on c.slug = v.slug
on conflict (certificate_number) do nothing;

-- ──────────────────────────────────────────────────────────────────────────
-- 3/5 — evaluations (auditor = founder ; completed → cert + rapport + scores)
-- ──────────────────────────────────────────────────────────────────────────
insert into public.evaluations
  (client_id, site_name, site_address, visit_date, status, vigi_score, composite_rating,
   omt_score, auditor_id, certificate_id, report_document_id, next_evaluation_due, notes)
select
  c.id, v.site, v.addr, v.vdate::date, v.st, v.vigi, v.comp, v.omt::jsonb,
  (select f.id from public.founders f where f.name = v.auditor),
  (select ce.id from public.certificates ce where ce.certificate_number = v.cert),
  (select d.id from public.contract_documents d where d.client_id = c.id and d.title = v.report),
  v.ndue::date, v.notes
from public.clients c
join (values
  ('voltalia-industries','Atelier TST Lyon','12 avenue des Frères Lumière, 69008 Lyon','2026-02-15','completed','B','BAB','{"autoEvaluation":"B+","recommandation":"A-","gestesMetiers":"B"}','Michel LIGIER','CETE-2026-0001','Rapport d''évaluation — Atelier TST Lyon','2027-02-15','Bon niveau global, vigilance sur les consignations.'),
  ('voltalia-industries','Poste de livraison HT','12 avenue des Frères Lumière, 69008 Lyon','2026-07-20','scheduled',null,null,null,'Bruno CLAUDEL',null,null,null,'Visite planifiée — poste HT.'),
  ('groupe-mistral-logistique','Entrepôt frigorifique Marseille','8 quai du Lazaret, 13002 Marseille','2025-10-20','completed','C','CBC','{"autoEvaluation":"C+","recommandation":"B","gestesMetiers":"C"}','Bruno CLAUDEL','CETE-2025-0042','Rapport d''évaluation — Entrepôt Marseille','2026-10-20','Plan d''action demandé sur les armoires de quai.'),
  ('tertia-bureaux','Siège Paris (IGH)','45 rue de La Boétie, 75008 Paris','2026-03-05','completed','A','AAB','{"autoEvaluation":"A","recommandation":"A-","gestesMetiers":"B+"}','Pierre VIRELY','CETE-2026-0007','Rapport d''évaluation — Siège Paris','2027-03-05','Excellent niveau, référence interne.'),
  ('chu-rives-de-loire','Bloc technique Nantes','1 boulevard Jean Monnet, 44093 Nantes','2025-07-10','completed','B','BBA','{"autoEvaluation":"B","recommandation":"B","gestesMetiers":"A-"}','Michel LIGIER','CETE-2025-0031','Rapport d''évaluation — Bloc technique Nantes','2026-07-10','Continuité de service prioritaire.'),
  ('chu-rives-de-loire','Plateau imagerie','1 boulevard Jean Monnet, 44093 Nantes','2026-05-15','in_progress',null,null,null,'Pierre VIRELY',null,null,null,'Évaluation en cours.'),
  ('residence-le-parc','Parties communes & locaux techniques','22 cours de l''Intendance, 33000 Bordeaux','2026-06-10','scheduled',null,null,null,'Pierre VIRELY',null,null,null,'Première visite onboarding.'),
  ('neo-energie','Site de production Lille','3 rue de l''Hippodrome, 59000 Lille','2023-09-01','completed','D','DCD','{"autoEvaluation":"D","recommandation":"C-","gestesMetiers":"D"}','Bruno CLAUDEL','CETE-2023-0118','Rapport d''évaluation — Site Lille (2023)','2024-09-01','Non-conformités majeures relevées (historique).'),
  ('neo-energie','Revue de surveillance 2025','3 rue de l''Hippodrome, 59000 Lille','2025-03-01','cancelled',null,null,null,'Michel LIGIER',null,null,null,'Annulée — contrat suspendu.'),
  ('cinema-lumiere','Salle & cabine de projection','14 allée Jean Jaurès, 31000 Toulouse','2022-06-15','completed','C','CCC','{"autoEvaluation":"C","recommandation":"C","gestesMetiers":"C"}','Pierre VIRELY','CETE-2022-0090',null,'2023-06-15','Évaluation historique (contrat clôturé).'),
  ('societe-demo','Siège Démo','1 rue de la Démo, 75001 Paris','2026-04-01','completed','A','ABA','{"autoEvaluation":"A-","recommandation":"B+","gestesMetiers":"A"}','Michel LIGIER','CETE-2026-0012','Rapport d''évaluation — Siège Démo','2027-04-01','Compte démo — bon niveau.'),
  ('societe-demo','Annexe Démo','1 rue de la Démo, 75001 Paris','2026-08-12','scheduled',null,null,null,'Bruno CLAUDEL',null,null,null,'Visite annexe planifiée.')
) as v(slug,site,addr,vdate,st,vigi,comp,omt,auditor,cert,report,ndue,notes) on c.slug = v.slug
where not exists (select 1 from public.evaluations e where e.client_id = c.id and e.site_name = v.site);

-- ──────────────────────────────────────────────────────────────────────────
-- 4/5 — client_documents + notifications (assigned → Société Démo)
-- ──────────────────────────────────────────────────────────────────────────
insert into public.client_documents
  (title, category, type, description, file_size, duration, upload_date, url, youtube_id, access_type, visibility, assigned_client_ids)
select v.title, v.cat, v.typ, v.descr, v.fsize, v.dur, v.udate::date, v.url, v.yt, v.acc, v.vis, v.assigned::uuid[]
from (values
  ('Newsletter CETé — Mai 2026','newsletters','pdf','Actualités sécurité électrique et nouveautés réglementaires.','1.8 Mo',null,'2026-05-05','/docs/newsletter-mai-2026.pdf',null,'download','global','{}'),
  ('Newsletter CETé — Mars 2026','newsletters','pdf','Retour sur les évolutions de la NF C 18-510.','1.6 Mo',null,'2026-03-04','/docs/newsletter-mars-2026.pdf',null,'download','global','{}'),
  ('Capsule — La consignation en 5 étapes','capsules','video','Capsule pédagogique sur la procédure de consignation.',null,'7 min','2026-04-18',null,'cetecaps001','view-only','global','{}'),
  ('Capsule — Comprendre la Règle des 3C','capsules','video','Auto-évaluation, recommandation, gestes métiers expliqués.',null,'9 min','2026-02-22',null,'cetecaps002','view-only','global','{}'),
  ('Guide TST — Bonnes pratiques de terrain','guides','pdf','Guide pratique des travaux sous tension.','4.2 Mo',null,'2026-01-30','/docs/guide-tst.pdf',null,'download','global','{}'),
  ('Guide — Préparer sa notation CETé','guides','pdf','Checklist de préparation avant la visite d''évaluation.','2.1 Mo',null,'2026-04-02','/docs/guide-preparation.pdf',null,'view-only','assigned','{d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172}'),
  ('Carnet de prescriptions — Société Démo','carnets','pdf','Prescriptions personnalisées suite à l''évaluation du siège.','3.0 Mo',null,'2026-04-10','/docs/carnet-demo.pdf',null,'download','assigned','{d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172}'),
  ('Carnet de suivi annuel','carnets','pdf','Modèle de carnet de suivi des actions correctives.','1.2 Mo',null,'2026-03-15','/docs/carnet-suivi.pdf',null,'download','global','{}')
) as v(title,cat,typ,descr,fsize,dur,udate,url,yt,acc,vis,assigned)
where not exists (select 1 from public.client_documents d where d.title = v.title);

insert into public.notifications (type, message, date, visibility, assigned_client_ids)
select v.typ, v.msg, v.d::date, v.vis, v.assigned::uuid[]
from (values
  ('veille','Nouvelle version de la NF C 18-510 en consultation publique.','2026-05-20','global','{}'),
  ('info','Pensez à planifier vos évaluations annuelles avant l''été.','2026-05-12','global','{}'),
  ('document','Un nouveau rapport d''évaluation est disponible dans votre espace.','2026-04-12','assigned','{d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172}'),
  ('veille','Mise à jour de la recommandation métier TST (R468).','2026-04-28','global','{}'),
  ('document','Votre certificat de notation 2026 a été déposé.','2026-04-03','assigned','{d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172}'),
  ('info','Maintenance planifiée du portail client le 15 juin (2h-4h).','2026-05-25','global','{}')
) as v(typ,msg,d,vis,assigned)
where not exists (select 1 from public.notifications n where n.message = v.msg);

-- ──────────────────────────────────────────────────────────────────────────
-- 5/5 — resources + articles
-- ──────────────────────────────────────────────────────────────────────────
insert into public.resources
  (title, description, category, type, access_type, url, youtube_id, file_size, source, published_date, visibility, assigned_client_ids)
select v.title, v.descr, v.cat, v.typ, v.acc, v.url, v.yt, v.fsize, v.src, v.pd::date, v.vis, v.assigned::uuid[]
from (values
  ('NF C 18-510 — Opérations sur ouvrages électriques','Norme de référence pour les opérations sur installations électriques.','normes','pdf','download','/resources/nfc-18510.pdf',null,'5.4 Mo','AFNOR','2024-09-01','global','{}'),
  ('Code du travail — Prévention du risque électrique','Articles R.4544-1 et suivants relatifs aux opérations sur installations.','reglementation','lien','view-only','https://www.legifrance.gouv.fr',null,null,'Légifrance','2023-01-01','global','{}'),
  ('Guide INRS ED 6187 — Le risque électrique','Guide de prévention édité par l''INRS.','guides','pdf','download','/resources/inrs-ed6187.pdf',null,'3.1 Mo','INRS','2023-06-01','global','{}'),
  ('Rapport annuel sinistralité électrique 2025','Synthèse des données de sinistralité et tendances.','rapports','pdf','download','/resources/rapport-sinistralite-2025.pdf',null,'2.8 Mo','CETé','2026-01-15','global','{}'),
  ('Veille réglementaire — Avril 2026','Synthèse mensuelle des évolutions normatives et réglementaires.','veille','lien','view-only','https://cete-notation.fr/veille/2026-04',null,null,'CETé','2026-04-30','global','{}'),
  ('Webinaire — Travaux sous tension : enjeux 2026','Rediffusion du webinaire CETé sur les TST.','veille','video','view-only','https://youtube.com','ceteweb2026','45 min','CETé','2026-03-20','global','{}'),
  ('NF C 15-100 — Installations électriques BT','Norme des installations électriques basse tension.','normes','pdf','download','/resources/nfc-15100.pdf',null,'6.2 Mo','AFNOR','2024-03-01','global','{}'),
  ('Guide — Les habilitations électriques','Panorama des niveaux d''habilitation et de leur attribution.','guides','pdf','download','/resources/guide-habilitations.pdf',null,'2.3 Mo','INRS','2025-09-10','assigned','{d4bbc7e3-9a58-44f3-80e8-b03f8b3bc172}')
) as v(title,descr,cat,typ,acc,url,yt,fsize,src,pd,vis,assigned)
where not exists (select 1 from public.resources r where r.title = v.title);

insert into public.articles (title, excerpt, author, category, status, published_date, views, featured, video_url)
select v.title, v.excerpt, v.author, v.cat, v.st, v.pd::date, v.views, v.feat, v.vurl
from (values
  ('La Règle des 3C : noter la maîtrise du risque électrique','Comment CETé évalue l''auto-évaluation, la recommandation métier et les gestes métiers.','Michel LIGIER','Expertise','published','2026-03-10',1240,true,null),
  ('TST : pourquoi la formation continue est décisive','Le maintien des compétences en travaux sous tension, clé de la sécurité.','Pierre VIRELY','Formation','published','2026-02-18',870,false,null),
  ('NF C 18-510 : ce qui change en 2026','Décryptage des évolutions de la norme et de leurs impacts terrain.','Bruno CLAUDEL','Réglementation','published','2026-04-05',1530,true,null),
  ('5 réflexes pour prévenir l''arc électrique','Des gestes simples pour réduire le risque d''arc flash sur site.','Équipe CETé','Sécurité','published','2026-01-22',640,false,null),
  ('Vigi-Score : l''innovation au service de la prévention','La notation CETé comme levier d''amélioration continue.','Michel LIGIER','Innovation','published','2026-03-28',980,false,null),
  ('Retour d''expérience : audit d''un site logistique','Étude de cas (brouillon en cours de rédaction).','Bruno CLAUDEL','Expertise','draft',null,0,false,null),
  ('Préparer son entreprise à la notation CETé','Les étapes clés avant la visite d''évaluation (brouillon).','Pierre VIRELY','Formation','draft',null,0,false,null)
) as v(title,excerpt,author,cat,st,pd,views,feat,vurl)
where not exists (select 1 from public.articles a where a.title = v.title);
