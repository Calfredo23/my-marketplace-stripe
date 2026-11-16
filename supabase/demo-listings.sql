-- Optional demo listings for Test 3.
-- Safe to rerun. It replaces only the demo seller's rows.

delete from public.listings
where email = 'demo@themarket.test';

insert into public.listings (
  title,
  description,
  price,
  email,
  category,
  image_url,
  created_at
) values
  (
    'Sony noise-cancelling headphones',
    'Comfortable over-ear headphones with the case and charging cable. The pads are clean and the noise cancelling still works well.',
    120,
    'demo@themarket.test',
    'Electronics',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '15 minutes'
  ),
  (
    'Mid-century two-seat sofa',
    'Solid wood frame with a warm mustard fabric. One small mark on the back corner, otherwise in good shape. Pickup only.',
    240,
    'demo@themarket.test',
    'Furniture',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '1 hour'
  ),
  (
    'Box of design and photography books',
    'Twelve books on typography, product design, and film photography. A few have notes in the margins. Good starter shelf.',
    30,
    'demo@themarket.test',
    'Books',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '3 hours'
  ),
  (
    'Commuter bike, recently tuned',
    'Steel frame with a new chain, brake pads, and tires. Rides smoothly around town. Includes a simple U-lock.',
    180,
    'demo@themarket.test',
    'Sports',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '6 hours'
  ),
  (
    'Fujifilm mirrorless camera',
    'Compact body with a 35mm prime lens, two batteries, and a charger. Shutter count is low. Great for travel or street photos.',
    520,
    'demo@themarket.test',
    'Electronics',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '1 day'
  ),
  (
    'Black leather jacket',
    'Soft black leather with a zip front and a relaxed fit. A few light creases, no tears. Fits like a modern large.',
    45,
    'demo@themarket.test',
    'Clothing',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&h=900&q=80',
    now() - interval '2 days'
  );
