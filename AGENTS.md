<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Admin newsletter previews render the registered email template locally in an isolated iframe and print that document for PDF saving; previewing never saves or sends a draft.
- Google Analytics loads only after recorded analytics consent, uses sanitized overview-page URLs without user data, disables advertising signals, and rechecks consent on navigation and cross-tab changes; keep sensitive member/admin/treatment-detail paths unmeasured.
- Academy feedback uses a fixed-height image stage with navigation outside the animated layer so different message sizes never move the arrows.
- Decode the shared bird before starting the intro and hand its visible silhouette directly to an identically sized reveal mask without an intermediate fade-out phase, preventing blank frames at the transition.
- Before/after comparisons use aligned, unretouched photo pairs on full-size layers; the slider clips the foreground without changing either image's dimensions or position.
- Treatment booking and analysis use a shared catalogue-backed menu with category navigation for booking and inline expandable analysis details; analysis actions book First Time rather than implying every offer is required.
- Direct-booking eligibility uses explicit catalogue provenance and a confirmed numeric total below the configured cap; unknown prices and unbounded starting prices are excluded to avoid misleading offers.
- Keep all contact information, the price-free treatment catalogue and Academy offerings in the shared data module so every page and assistant uses the same source.
- Use scoped semantic CSS tokens for the treatment, Academy and footer palettes to preserve consistent theming.
- Keep the assistant deterministic and device-local, cap history at 80 messages, and never submit chat data to a server.
- Callback forms prepare a WhatsApp message and explicitly require the visitor to send it; do not display a false delivery confirmation.
- Preserve published legacy treatment URLs using permanent redirects to the overview for retired offers and the current offer slug for retained aliases.
- Pages carry their SEO head (title, description, canonical, share image, JSON-LD) via the shared seoHead helper; the sitemap is built from the shared data module so new offers appear automatically.

- Bundle all font weights locally through package CSS imports so typography never requires a third-party font request.
- Use the same letter-free raster hummingbird for the intro, reveal mask, header, footer and app icons; scoped filters set its display color while preserving intro timing.
- Keep unfinished Member Club content explicitly marked as placeholders and excluded from indexing until real content is supplied; confirmed legal business terms live in the shared data module so published terms and rule tests stay consistent.

- Positioned non-video face hotspots use the base photograph for forward and reverse CSS zoom; only video hotspots load close-up assets, preventing requests for nonexistent photos.
- Member Club event emails use registered React Email templates and the managed Lovable sender inside server handlers with stable event idempotency keys; Lovable owns delivery and unsubscribe footers, and confirmation retries reuse existing vouchers to recover failed sends without duplicate codes.
- Member signup is double opt-in: signup only sends the member-confirm email with the confirmation link; the voucher is created and sent in confirmMember after the link is opened. Pending signups get the confirmation resent; confirmed or unsubscribed emails are rejected except the designated test address (not when unsubscribed); managed suppression remains enforced, and database unique indexes prevent duplicate members and vouchers.
- Member Club confirmation and unsubscribe leaves use trailing-underscore un-nesting so the signup page cannot hide them; preserve their public URLs and display confirmation separately from email-delivery failure.
