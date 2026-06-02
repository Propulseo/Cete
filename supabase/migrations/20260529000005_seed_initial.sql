-- ============================================================================
-- CETé — Migration 5/5 : Seed de référence (settings + founders, bilingue)
-- Source : fusion fr/ + en/ des mocks (cf. MOCK_DATA_AUDIT.md / BACKEND_SPEC §13).
--
-- NB Admin bootstrap : le 1er admin n'est PAS créé ici (auth.users + GoTrue).
--   → créé en B4 via Supabase Admin API (auth.admin.createUser) avec
--     raw_user_meta_data = {"role":"admin","name":"..."} → handle_new_user crée
--     le profil, puis UPDATE role='admin'. (bcrypt cost 10, identities, etc.)
-- NB Données métier démo (clients/évals/certifs/docs) : seedées séparément en B3
--   via un script de remap ids texte→uuid (cf. §13), pas dans cette migration.
-- ============================================================================

-- ── settings (singleton, id=1) ────────────────────────────────────────────────
insert into public.settings (id, company, address, city, country, phone, email, website, business_hours, map_latitude, map_longitude)
values (
  1,
  $j${"fr":"CETé - Consortium Experts Techniques Électricité","en":"CETé - Consortium of Electrical Technical Experts"}$j$::jsonb,
  'SERCE - 9 rue de Berri',
  '75008 Paris',
  'France',
  '+33 (0)1 XX XX XX XX',
  'contact@cete-notation.fr',
  'www.cete-notation.fr',
  $j${"fr":{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-18:00","friday":"09:00-18:00","saturday":"Fermé","sunday":"Fermé"},"en":{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-18:00","friday":"09:00-18:00","saturday":"Closed","sunday":"Closed"}}$j$::jsonb,
  48.8706,
  2.3062
)
on conflict (id) do nothing;

-- ── founders (4, bilingue ; seed une seule fois) ──────────────────────────────
do $do$
begin
  if not exists (select 1 from public.founders) then
    insert into public.founders (name, role, bio, specialties, former_org, current_entity, image_url, image_position, visible) values
    (
      'Michel LIGIER',
      $j${"fr":"Co-fondateur Expert TST et Risques électriques","en":"Co-founder - Live-Line Work & Electrical Risk Expert"}$j$::jsonb,
      $j${"fr":"Ancien des écoles de métiers EDF Distribution, Ancien Expert SERECT - Conformité réglementaire - Veille juridique - Ingénierie pédagogique appliquée à la sécurité","en":"Former graduate of EDF Distribution trade schools, Former SERECT Expert - Regulatory compliance - Legal monitoring - Safety-focused instructional engineering"}$j$::jsonb,
      $j${"fr":["Travaux Sous Tension","Diagnostic terrain","Référentiel de notation"],"en":["Live-Line Work","Field diagnostics","Rating framework"]}$j$::jsonb,
      $j${"fr":"Ancien Expert SERECT","en":"Former SERECT Expert"}$j$::jsonb,
      $j${"fr":"Fondateur de MaP Expertise Conseils","en":"Founder of MaP Expertise Conseils"}$j$::jsonb,
      '/assets/founders/michel.png', 'center top', true
    ),
    (
      'Bruno CLAUDEL',
      $j${"fr":"Co-fondateur Expert TST et Risques électriques","en":"Co-founder - Live-Line Work & Electrical Risk Expert"}$j$::jsonb,
      $j${"fr":"Ancien des écoles de métiers EDF Distribution, Ancien Expert SERECT - IPRP - Architecte du référentiel de notation - Ingénierie pédagogique appliquée à la sécurité","en":"Former graduate of EDF Distribution trade schools, Former SERECT Expert - IPRP - Rating framework architect - Safety-focused instructional engineering"}$j$::jsonb,
      $j${"fr":["Conformité réglementaire","Audit normatif","Veille juridique"],"en":["Regulatory compliance","Standards auditing","Legal monitoring"]}$j$::jsonb,
      $j${"fr":"Ancien Expert SERECT","en":"Former SERECT Expert"}$j$::jsonb,
      $j${"fr":"","en":""}$j$::jsonb,
      '/assets/founders/bruno-claudel.jpg', null, true
    ),
    (
      'Pierre VIRELY',
      $j${"fr":"Co-fondateur Expert TST et Risques électriques","en":"Co-founder - Live-Line Work & Electrical Risk Expert"}$j$::jsonb,
      $j${"fr":"Ancien des écoles de métiers EDF Distribution, Ancien Expert SERECT - Concepteur de programmes d'accompagnement vers le triple A - Ingénierie pédagogique appliquée à la sécurité","en":"Former graduate of EDF Distribution trade schools, Former SERECT Expert - Designer of Triple-A improvement programs - Safety-focused instructional engineering"}$j$::jsonb,
      $j${"fr":["Ingénierie pédagogique","Coaching opérationnel","Montée en compétence"],"en":["Instructional engineering","Operational coaching","Skills development"]}$j$::jsonb,
      $j${"fr":"Ancien Expert SERECT","en":"Former SERECT Expert"}$j$::jsonb,
      $j${"fr":"","en":""}$j$::jsonb,
      '/assets/founders/pierre-virely.jpg', null, true
    ),
    (
      'Denis VUILLOZ',
      $j${"fr":"Co-fondateur - Notation & Analyse","en":"Co-founder - Rating & Analysis"}$j$::jsonb,
      $j${"fr":"Ancien des écoles de métiers EDF Distribution, Ancien Expert SERECT - Concepteur de l'échelle de notation AAA-DDD - Méthodologie Vigi-Score - Ingénierie pédagogique appliquée à la sécurité","en":"Former graduate of EDF Distribution trade schools, Former SERECT Expert - Designer of the AAA-DDD rating scale - Vigi-Score methodology - Safety-focused instructional engineering"}$j$::jsonb,
      $j${"fr":["Méthodologie de notation","Analyse de risques","Échelle AAA-DDD"],"en":["Rating methodology","Risk analysis","AAA-DDD scale"]}$j$::jsonb,
      $j${"fr":"Ancien Expert SERECT","en":"Former SERECT Expert"}$j$::jsonb,
      $j${"fr":"","en":""}$j$::jsonb,
      '/assets/founders/denis.jpg', null, true
    );
  end if;
end
$do$;
