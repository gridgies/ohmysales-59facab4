-- Create comments table for sale discussions
CREATE TABLE public.sale_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index on sale_id for faster lookups
CREATE INDEX idx_sale_comments_sale_id ON public.sale_comments(sale_id);

-- Create index on created_at for sorting
CREATE INDEX idx_sale_comments_created_at ON public.sale_comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.sale_comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
-- Anyone can view comments
CREATE POLICY "Anyone can view comments"
  ON public.sale_comments FOR SELECT
  TO authenticated, anon
  USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments"
  ON public.sale_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.sale_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own comments, admins can delete any
CREATE POLICY "Users can delete own comments"
  ON public.sale_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at on comments
CREATE TRIGGER on_sale_comments_updated
  BEFORE UPDATE ON public.sale_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create view for comment counts per sale
CREATE OR REPLACE VIEW public.sale_comment_counts AS
SELECT
  sale_id,
  COUNT(*) as comment_count
FROM public.sale_comments
GROUP BY sale_id;

-- Grant access to the view
GRANT SELECT ON public.sale_comment_counts TO authenticated, anon;
