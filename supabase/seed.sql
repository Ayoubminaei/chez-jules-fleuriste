-- Sample catalog data for Chez Jules Fleuriste

insert into public.categories (slug, name, description, position) values
  ('bouquets',    'Bouquets',    'Bouquets de saison composés à la main', 1),
  ('plantes',     'Plantes',     'Plantes d''intérieur sélectionnées',     2),
  ('compositions','Compositions','Centres de table & arrangements',         3),
  ('evenements',  'Événements',  'Mariages, dîners, vitrines',              4)
on conflict (slug) do nothing;

insert into public.products
  (slug, name, description, price_cents, compare_at_cents, category_id,
   occasions, colors, stock, is_featured, is_new, image_url)
values
  ('bouquet-aurore', 'Bouquet Aurore',
   'Pivoines roses, renoncules, eucalyptus citronné. Composé le matin.',
   5900, null,
   (select id from public.categories where slug='bouquets'),
   array['anniversaire','remerciement']::text[], array['rose','blanc']::text[],
   12, true, true,
   'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1000&q=80'),

  ('bouquet-foret', 'Bouquet Forêt',
   'Roses anciennes bordeaux, fougères et baies sauvages.',
   7200, 8400,
   (select id from public.categories where slug='bouquets'),
   array['anniversaire']::text[], array['rouge','vert']::text[],
   3, true, false,
   'https://images.unsplash.com/photo-1471938537155-7de0bd123d0c?auto=format&fit=crop&w=1000&q=80'),

  ('bouquet-soleil', 'Bouquet Soleil',
   'Tournesols, mimosas, blé. Lumineux et estival.',
   4500, null,
   (select id from public.categories where slug='bouquets'),
   array['fete-des-meres','remerciement']::text[], array['jaune','orange']::text[],
   18, true, false,
   'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80'),

  ('bouquet-marbre', 'Bouquet Marbre',
   'Hortensias, lisianthus, eucalyptus argenté.',
   6500, null,
   (select id from public.categories where slug='bouquets'),
   array['mariage']::text[], array['blanc','vert']::text[],
   9, false, true,
   'https://images.unsplash.com/photo-1548198471-5c2d65d97f6f?auto=format&fit=crop&w=1000&q=80'),

  ('monstera-deliciosa', 'Monstera deliciosa',
   'Plante d''intérieur, pot terre cuite inclus.',
   4900, null,
   (select id from public.categories where slug='plantes'),
   array['tous-les-jours']::text[], array['vert']::text[],
   8, true, false,
   'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1000&q=80'),

  ('ficus-lyrata', 'Ficus lyrata',
   'Le figuier lyre, un classique sculptural.',
   8900, null,
   (select id from public.categories where slug='plantes'),
   array['tous-les-jours']::text[], array['vert']::text[],
   4, false, true,
   'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=1000&q=80'),

  ('composition-table-dimanche', 'Composition Table',
   'Centre de table, cire et fleurs sèches.',
   8500, null,
   (select id from public.categories where slug='compositions'),
   array['mariage']::text[], array['blanc','orange']::text[],
   5, true, true,
   'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1000&q=80'),

  ('composition-deuil', 'Composition Deuil',
   'Composition élégante, tons doux.',
   12000, null,
   (select id from public.categories where slug='compositions'),
   array['deuil']::text[], array['blanc','violet']::text[],
   6, false, false,
   'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1000&q=80'),

  ('mariage-fleur-coeur', 'Mariage Fleur de cœur',
   'Décoration sur-mesure pour votre jour J.',
   45000, null,
   (select id from public.categories where slug='evenements'),
   array['mariage']::text[], array['blanc','rose']::text[],
   2, true, false,
   'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=1000&q=80'),

  ('petit-bouquet-naissance', 'Petit Bouquet Naissance',
   'Renoncules pastel et brins de gypsophile.',
   3900, null,
   (select id from public.categories where slug='bouquets'),
   array['naissance']::text[], array['rose','blanc']::text[],
   15, false, true,
   'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1000&q=80')
on conflict (slug) do nothing;

insert into public.banners (title, subtitle, cta_label, cta_href, image_url, position) values
  ('Saison printemps',
   'Pivoines, renoncules, lilas — l''éclat retrouvé.',
   'Découvrir',
   '/catalogue?cat=bouquets',
   'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=2000&q=80',
   1)
on conflict do nothing;

insert into public.promo_codes (code, kind, amount, min_subtotal_cents, is_active) values
  ('BIENVENUE10', 'percent', 10, 4000, true)
on conflict (code) do nothing;
