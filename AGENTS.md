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
- Keep all contact information, treatment pricing and Academy offerings in the shared data module so every page and assistant uses the same source.
- Use scoped semantic CSS tokens for the treatment, Academy and footer palettes to preserve consistent theming.
- Keep the assistant deterministic and device-local, cap history at 80 messages, and never submit chat data to a server.
- Callback forms prepare a WhatsApp message and explicitly require the visitor to send it; do not display a false delivery confirmation.
- Preserve published legacy detail URLs using permanent redirects to the current offer slug.
