-- Shop catalogue no longer uses "Other"; map existing rows to Electronics so filters and admin stay valid.
UPDATE public.products SET category = 'Electronics' WHERE category = 'Other';
