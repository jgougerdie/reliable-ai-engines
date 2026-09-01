import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, UploadCloud, Video as VideoIcon } from "lucide-react";

type VideoRow = {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  transcript: string | null;
  storage_path: string;
  file_name: string | null;
  size_bytes: number | null;
  ai_shared: boolean;
  created_at: string;
};

export const Route = createFileRoute("/videos")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Video Library — Architect.systems" },
      {
        name: "description",
        content:
          "Private video library: upload talks, demos and walkthroughs with transcripts so the site AI assistant can answer from them.",
      },
      { property: "og:title", content: "Video Library — Architect.systems" },
      {
        property: "og:description",
        content: "Upload videos with metadata and transcripts as grounding data for the AI assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VideosPage,
});

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function VideosPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<VideoRow[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [transcript, setTranscript] = useState("");
  const [aiShared, setAiShared] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
      return;
    }
    const list = (data ?? []) as VideoRow[];
    setRows(list);
    const signed: Record<string, string> = {};
    await Promise.all(
      list.map(async (r) => {
        const { data: s } = await supabase.storage
          .from("videos")
          .createSignedUrl(r.storage_path, 3600);
        if (s?.signedUrl) signed[r.id] = s.signedUrl;
      }),
    );
    setUrls(signed);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      setReady(true);
      if (uid) void load();
    });
    return () => {
      active = false;
    };
  }, [load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !userId) return;
    setBusy(true);
    setError(null);
    setStatus("Uploading video…");
    setProgress(15);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("videos")
        .upload(path, file, { contentType: file.type || "video/mp4", upsert: false });
      if (upErr) throw upErr;
      setProgress(75);
      setStatus("Saving details…");
      const { error: insErr } = await supabase.from("videos").insert({
        user_id: userId,
        title: title.trim() || file.name,
        description: description.trim() || null,
        transcript: transcript.trim() || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        storage_path: path,
        file_name: file.name,
        size_bytes: file.size,
        ai_shared: aiShared,
      });
      if (insErr) throw insErr;
      setProgress(100);
      setStatus("Uploaded.");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setTranscript("");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus(null);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 800);
    }
  }

  async function toggleShared(row: VideoRow) {
    await supabase.from("videos").update({ ai_shared: !row.ai_shared }).eq("id", row.id);
    await load();
  }

  async function remove(row: VideoRow) {
    await supabase.storage.from("videos").remove([row.storage_path]);
    await supabase.from("videos").delete().eq("id", row.id);
    await load();
  }

  if (!ready) {
    return (
      <Section title="Video Library" titleAs="h1">
        <p className="text-muted-foreground">Loading…</p>
      </Section>
    );
  }

  if (!userId) {
    return (
      <Section
        eyebrow="Private"
        title="Video Library"
        titleAs="h1"
        description="Sign in to upload videos and manage the transcripts your AI assistant can answer from."
      >
        <Button onClick={() => navigate({ to: "/auth", search: { next: "/videos" } })}>
          Sign in to continue
        </Button>
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Private workspace"
      title="Video Library"
      titleAs="h1"
      description="Upload talks, demos and walkthroughs. Videos stay private to your account; the title, description, tags and transcript become grounding data your on-site AI assistant can answer from."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        <form
          onSubmit={handleUpload}
          className="glass rounded-xl border border-border p-6 space-y-4 h-fit"
        >
          <div className="space-y-2">
            <Label htmlFor="video-file">Video file</Label>
            <Input
              id="video-file"
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""));
              }}
              required
            />
            <p className="text-xs text-muted-foreground">MP4, WebM or MOV up to 500 MB.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input id="video-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-desc">Description</Label>
            <Textarea
              id="video-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this video covers and who it's for."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-tags">Tags (comma separated)</Label>
            <Input
              id="video-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="rag, langgraph, case study"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-transcript">Transcript</Label>
            <Textarea
              id="video-transcript"
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste the full transcript here so the AI can answer from the content."
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <Label htmlFor="video-ai" className="text-sm font-normal">
              Let the AI assistant use this
            </Label>
            <Switch id="video-ai" checked={aiShared} onCheckedChange={setAiShared} />
          </div>
          {progress > 0 && (
            <div className="h-1 w-full overflow-hidden rounded bg-[var(--surface)]">
              <div
                className="h-full bg-[var(--brand)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {status && <p className="text-xs text-muted-foreground">{status}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={busy || !file} className="w-full">
            <UploadCloud size={16} className="mr-2" />
            {busy ? "Uploading…" : "Upload video"}
          </Button>
        </form>

        <div className="space-y-6">
          {rows.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <VideoIcon className="mx-auto mb-3 opacity-60" />
              No videos yet. Upload your first one on the left.
            </div>
          )}
          {rows.map((r) => (
            <article key={r.id} className="glass rounded-xl border border-border overflow-hidden">
              <div className="aspect-video bg-black">
                {urls[r.id] ? (
                  <video src={urls[r.id]} controls preload="metadata" className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Preparing preview…
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold tracking-tight">{r.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()} · {formatSize(r.size_bytes)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(r)}
                    aria-label={`Delete ${r.title}`}
                    className="p-2 rounded-md btn-ghost text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {r.transcript ? "Transcript attached" : "No transcript — AI has metadata only"}
                  </span>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    AI access
                    <Switch checked={r.ai_shared} onCheckedChange={() => toggleShared(r)} />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
