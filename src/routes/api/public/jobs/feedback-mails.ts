import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/jobs/feedback-mails")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { sendDueFeedbackMails } = await import("@/lib/feedback.server");
        const sent = await sendDueFeedbackMails();
        return Response.json({ success: true, sent });
      },
    },
  },
});
