-- Add description field to sales table for detailed sale information
ALTER TABLE public.sales
ADD COLUMN description TEXT;

COMMENT ON COLUMN public.sales.description IS 'Optional detailed description of the sale, visible on individual sale pages';
