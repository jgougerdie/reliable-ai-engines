import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
  offset: z.coerce.number().int().min(0).default(0),
});

export const Route = createFileRoute("/api/public/videos")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const parsed = QuerySchema.safeParse({
          limit: searchParams.get("limit"),
          offset: searchParams.get("offset"),
        });
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400, headers: corsHeaders });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error, count } = await supabaseAdmin
          .from("videos")
          .select(
            "id, title, description, tags, transcript, file_name, size_bytes, ai_shared, created_at",
            { count: "exact" },
          )
          .eq("ai_shared", true)
          .order("created_at", { ascending: false })
          .range(parsed.data.offset, parsed.data.offset + parsed.data.limit - 1);

        if (error) {
          console.error("[public/videos] list error:", error);
          return Response.json({ error: "Unable to fetch videos" }, { status: 500, headers: corsHeaders });
        }

        return Response.json(
          {
            videos: data ?? [],
            pagination: {
              limit: parsed.data.limit,
              offset: parsed.data.offset,
              total: count ?? 0,
            },
          },
          { headers: corsHeaders },
        );
      },
    },
  },
});
