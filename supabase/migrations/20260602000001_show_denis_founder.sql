-- Rend visible le 4ème fondateur (Denis VUILLOZ), seedé masqué à l'origine,
-- et aligne sa bio sur le modèle des autres fondateurs (placeholder remplacé).
-- Idempotent : peut être rejoué sans effet de bord.
update public.founders
set visible = true,
    bio = $j${"fr":"Ancien des écoles de métiers EDF Distribution, Ancien Expert SERECT - Concepteur de l'échelle de notation AAA-DDD - Méthodologie Vigi-Score - Ingénierie pédagogique appliquée à la sécurité","en":"Former graduate of EDF Distribution trade schools, Former SERECT Expert - Designer of the AAA-DDD rating scale - Vigi-Score methodology - Safety-focused instructional engineering"}$j$::jsonb
where name = 'Denis VUILLOZ';
