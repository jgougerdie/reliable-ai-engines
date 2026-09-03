/**
 * Curated portfolio of Javad Gougerdie's own video work.
 *
 * Every entry here is real work from the creator's YouTube channel:
 * https://www.youtube.com/@JavadGougerdie
 *
 * A project can be backed by:
 *   1. a YouTube video      -> youtubeUrl
 *   2. a directly hosted MP4 -> videoUrl   (takes priority for inline playback)
 *   3. an uploaded asset     -> videoUrl   (same field, any absolute/relative URL)
 *
 * To add new work, append an object below. No component changes required.
 */

export type VideoProject = {
  title: string;
  category: string;
  year?: string;
  description?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
};

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@JavadGougerdie";

/** Ordered categories used by the filter UI. Only categories present in the work below. */
export const workCategories = [
  "All",
  "Cinematic",
  "Motion Graphics",
  "Design",
  "Editing",
  "Studies",
] as const;

export const videoProjects: VideoProject[] = [
  {
    title: "Cinematic Horisantal Talk — Dutch",
    category: "Cinematic",
    year: "2026",
    description:
      "Dialogue-led cinematic piece cut for pacing and presence: long-held framing, restrained transitions, and grading that keeps the subject the focus.",
    youtubeUrl: "https://www.youtube.com/watch?v=KUoQqEzQ1Ak",
    thumbnailUrl: "https://i.ytimg.com/vi/KUoQqEzQ1Ak/maxresdefault.jpg",
    featured: true,
  },
  {
    title: "Cinematic Horisantal Talk",
    category: "Cinematic",
    year: "2026",
    description:
      "Companion cut of the horizontal talk format — same visual language, different rhythm in the edit.",
    youtubeUrl: "https://www.youtube.com/watch?v=21xQPVqTyP0",
    thumbnailUrl: "https://i.ytimg.com/vi/21xQPVqTyP0/maxresdefault.jpg",
    featured: true,
  },
  {
    title: "Premium Cinematic Portrait Piece",
    category: "Cinematic",
    year: "2026",
    description:
      "A short, premium-feel portrait sequence built around light, texture and slow motion rather than cuts.",
    youtubeUrl: "https://www.youtube.com/watch?v=PvW_3LiZmtw",
    thumbnailUrl: "https://i.ytimg.com/vi/PvW_3LiZmtw/maxresdefault.jpg",
    featured: true,
  },
  {
    title: "Behind the Scenes — Cinematic",
    category: "Cinematic",
    year: "2026",
    description:
      "Behind-the-scenes storytelling: observational coverage assembled into a compact narrative arc.",
    youtubeUrl: "https://www.youtube.com/watch?v=tCnQGFKKxG0",
    thumbnailUrl: "https://i.ytimg.com/vi/tCnQGFKKxG0/maxresdefault.jpg",
  },
  {
    title: "Professional High-End Video Edit",
    category: "Editing",
    year: "2026",
    description:
      "High-end edit showcase — timing, transitions and sound-led cuts carrying the sequence.",
    youtubeUrl: "https://www.youtube.com/watch?v=zGKTtGOsCLk",
    thumbnailUrl: "https://i.ytimg.com/vi/zGKTtGOsCLk/maxresdefault.jpg",
    featured: true,
  },
  {
    title: "Visual Effects & Post-Production",
    category: "Editing",
    year: "2026",
    description:
      "Compositing and post work integrated into live footage so the effect never announces itself.",
    youtubeUrl: "https://www.youtube.com/watch?v=1vlKd7bd1VM",
    thumbnailUrl: "https://i.ytimg.com/vi/1vlKd7bd1VM/maxresdefault.jpg",
  },
  {
    title: "Motion Design Blueprint — Part 1",
    category: "Motion Graphics",
    year: "2026",
    description:
      "Motion design study: type, easing and layout choreography built as a repeatable system.",
    youtubeUrl: "https://www.youtube.com/watch?v=L8BWyifryUI",
    thumbnailUrl: "https://i.ytimg.com/vi/L8BWyifryUI/maxresdefault.jpg",
    featured: true,
  },
  {
    title: "Motion Design Blueprint — Part 3",
    category: "Motion Graphics",
    year: "2026",
    description:
      "Continuation of the blueprint series, pushing composition and transition logic further.",
    youtubeUrl: "https://www.youtube.com/watch?v=SnOeYTHTh10",
    thumbnailUrl: "https://i.ytimg.com/vi/SnOeYTHTh10/maxresdefault.jpg",
  },
  {
    title: "Pastries Effect",
    category: "Motion Graphics",
    year: "2026",
    description:
      "Product-style motion piece — texture, timing and a single clean effect idea carried end to end.",
    youtubeUrl: "https://www.youtube.com/watch?v=QdycpqEO4No",
    thumbnailUrl: "https://i.ytimg.com/vi/QdycpqEO4No/maxresdefault.jpg",
  },
  {
    title: "Final Scene",
    category: "Motion Graphics",
    year: "2026",
    description: "Closing-scene animation exercise focused on resolve and exit timing.",
    youtubeUrl: "https://www.youtube.com/watch?v=yGYww_ZZOaQ",
    thumbnailUrl: "https://i.ytimg.com/vi/yGYww_ZZOaQ/maxresdefault.jpg",
  },
  {
    title: "Intro",
    category: "Motion Graphics",
    year: "2026",
    description: "Short animated intro / channel ident.",
    youtubeUrl: "https://www.youtube.com/watch?v=gL7nKK9b_oU",
    thumbnailUrl: "https://i.ytimg.com/vi/gL7nKK9b_oU/maxresdefault.jpg",
  },
  {
    title: "Swiss Graphic Design",
    category: "Design",
    year: "2026",
    description:
      "Swiss-style design work translated into motion: grid discipline, type hierarchy, negative space.",
    youtubeUrl: "https://www.youtube.com/watch?v=PBB6i5rACcA",
    thumbnailUrl: "https://i.ytimg.com/vi/PBB6i5rACcA/maxresdefault.jpg",
  },
  {
    title: "Swiss Graphic Poster Design",
    category: "Design",
    year: "2026",
    description: "Poster-led design sequence built on the same Swiss typographic system.",
    youtubeUrl: "https://www.youtube.com/watch?v=YXN_SdsBAnw",
    thumbnailUrl: "https://i.ytimg.com/vi/YXN_SdsBAnw/maxresdefault.jpg",
  },
  {
    title: "Scene Study 0818",
    category: "Studies",
    year: "2026",
    description: "Short scene study from the ongoing daily edit series.",
    youtubeUrl: "https://www.youtube.com/watch?v=8oOUyPyTlYk",
    thumbnailUrl: "https://i.ytimg.com/vi/8oOUyPyTlYk/maxresdefault.jpg",
  },
  {
    title: "Scene Study 0819",
    category: "Studies",
    year: "2026",
    description: "Short scene study from the ongoing daily edit series.",
    youtubeUrl: "https://www.youtube.com/watch?v=ILdJdOM-oqQ",
    thumbnailUrl: "https://i.ytimg.com/vi/ILdJdOM-oqQ/maxresdefault.jpg",
  },
  {
    title: "Scene Study 0821",
    category: "Studies",
    year: "2026",
    description: "Short scene study from the ongoing daily edit series.",
    youtubeUrl: "https://www.youtube.com/watch?v=MEehQDx5Ou0",
    thumbnailUrl: "https://i.ytimg.com/vi/MEehQDx5Ou0/maxresdefault.jpg",
  },
];

/** The piece used as the showreel / hero anchor. */
export const showreel: VideoProject =
  videoProjects.find((p) => p.title === "Professional High-End Video Edit") ?? videoProjects[0];

export const featuredProjects = videoProjects.filter((p) => p.featured);

export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function posterFor(p: VideoProject): string | undefined {
  if (p.thumbnailUrl) return p.thumbnailUrl;
  const id = youtubeId(p.youtubeUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}
