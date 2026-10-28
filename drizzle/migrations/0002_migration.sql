ALTER TABLE public.vouchers
  ADD COLUMN feedback_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  ADD COLUMN feedback_sent_at timestamptz;
CREATE UNIQUE INDEX vouchers_feedback_token_key ON public.vouchers(feedback_token);

CREATE TABLE public.member_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id uuid NOT NULL UNIQUE REFERENCES public.vouchers(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  sterne integer NOT NULL,
  text text NOT NULL DEFAULT '',
  veroeffentlichen boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.member_feedback TO authenticated;
GRANT ALL ON public.member_feedback TO service_role;
ALTER TABLE public.member_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read feedback" ON public.member_feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.validate_member_feedback() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.sterne < 1 OR NEW.sterne > 5 THEN RAISE EXCEPTION 'sterne must be 1-5'; END IF;
  IF length(NEW.text) > 2000 THEN RAISE EXCEPTION 'text too long'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER member_feedback_validate BEFORE INSERT OR UPDATE ON public.member_feedback FOR EACH ROW EXECUTE FUNCTION public.validate_member_feedback();