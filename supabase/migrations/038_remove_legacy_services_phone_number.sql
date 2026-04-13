-- Remove all occurrences of the old public phone number from services.phone_number.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'phone_number'
  ) THEN
    UPDATE public.services
    SET phone_number = replace(phone_number, '+38976805651', '')
    WHERE phone_number LIKE '%+38976805651%';
  END IF;
END
$$;
