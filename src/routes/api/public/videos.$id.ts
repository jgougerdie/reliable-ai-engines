import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export const Route = createFileRoute("/api/public/videos/$id")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ params }) => {
        const parsed = ParamsSchema.safeParse(params);
        if (!parsed.success) {
          return Response.json({ error: "Invalid video id" }, { status: 400, headers: corsHeaders });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("videos")
          .select("id, title, description, tags, transcript, file_name, size_bytes, storage_path, ai_shared, created_at")
          .eq("id", parsed.data.id)
          .eq("ai_shared", true)
          .single();

        if (error || !data) {
          return Response.json({ error: "Video not found or not shared" }, { status: 404, headers: corsHeaders });
        }

        const { data: signed, error: signedError } = await supabaseAdmin.storage
          .from("videos")
          .createSignedUrl(data.storage_path, 3600);

        if (signedError) {
          console.error("[public/videos/$id] signed url error:", signedError);
          return Response.json({ error: "Unable to generate video URL" }, { status: 500, headers: corsHeaders });
        }

        return Response.json(
          {
            video: {
              id: data.id,
              title: data.title,
              description: data.description,
              tags: data.tags,
              transcript: data.transcript,
              file_name: data.file_name,
              size_bytes: data.size_bytes,
              created_at: data.created_at,
              signed_url: signed?.signedUrl ?? null,
              expires_in_seconds: 3600,
            },
          },
          { headers: corsHeaders },
        );
      },
    },
  },
});
