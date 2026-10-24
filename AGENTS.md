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
- Keep all contact information, the price-free treatment catalogue and Academy offerings in the shared data module so every page and assistant uses the same source.
- Use scoped semantic CSS tokens for the treatment, Academy and footer palettes to preserve consistent theming.
- Keep the assistant deterministic and device-local, cap history at 80 messages, and never submit chat data to a server.
- Callback forms prepare a WhatsApp message and explicitly require the visitor to send it; do not display a false delivery confirmation.
- Preserve published legacy treatment URLs using permanent redirects to the overview for retired offers and the current offer slug for retained aliases.
- Pages carry their SEO head (title, description, canonical, share image, JSON-LD) via the shared seoHead helper; the sitemap is built from the shared data module so new offers appear automatically.

- Bundle all font weights locally through package CSS imports so typography never requires a third-party font request.
- Reuse the intro raster hummingbird for header/footer with scoped filters, and render app icons from its traced vector for sharp edges without changing the intro.
- Keep unfinished Member Club and AGB content explicitly marked as placeholders, with Member Club excluded from indexing until real content is supplied.

- Positioned non-video face hotspots use the base photograph for forward and reverse CSS zoom; only video hotspots load close-up assets, preventing requests for nonexistent photos.
- Member Club event emails use registered React Email templates and the managed Lovable sender inside server handlers with stable event idempotency keys; Lovable owns delivery and unsubscribe footers, and confirmation retries reuse existing vouchers to recover failed sends without duplicate codes.
- Member signup is double opt-in: signup only sends the member-confirm email with the confirmation link; the voucher is created and sent in confirmMember after the link is opened. Pending signups get the confirmation resent; confirmed or unsubscribed emails are rejected except the designated test address (not when unsubscribed); managed suppression remains enforced, and database unique indexes prevent duplicate members and vouchers.
