-- Remove legacy default phone from seller/product/service records.
UPDATE public.admin_users
SET phone = ''
WHERE role = 'seller' AND phone = '+38976805651';

UPDATE public.products
SET phone = ''
WHERE phone = '+38976805651';

UPDATE public.services
SET phone = ''
WHERE phone = '+38976805651';
