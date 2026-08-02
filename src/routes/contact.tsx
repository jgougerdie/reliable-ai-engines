import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { Github, Linkedin, Briefcase, Calendar, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Book a Consultation with an AI Architect" },
      { name: "description", content: "Book a consultation, send an inquiry, or connect on GitHub, LinkedIn, or Upwork." },
      { property: "og:title", content: "Contact — AI Architect" },
      { property: "og:description", content: "Get in touch about your AI architecture, RAG, or agent system." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Valid email required").max(255),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Tell me a little more").max(2000),
});

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
  }

  return (
    <Section
      eyebrow="Contact"
      titleAs="h1"
      title="Let's design your AI system"
      description="Tell me what you're building. I'll respond with the questions I'd want answered before recommending an approach."
    >
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
        <form onSubmit={handleSubmit} className="card-glow rounded-2xl p-7 md:p-9 space-y-5">
          {sent ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[color:var(--brand)] mt-1" size={20}/>
              <div>
                <h3 className="text-lg font-semibold">Thanks — message received.</h3>
                <p className="text-sm text-muted-foreground mt-1">I'll reply within one business day.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Name" name="name" error={errors.name}/>
                <Field label="Email" name="email" type="email" error={errors.email}/>
              </div>
              <Field label="Company (optional)" name="company" error={errors.company}/>
              <div>
                <label className="text-sm font-medium">Project</label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="What are you building, and what's the current state?"
                  className="mt-2 w-full px-3 py-2 rounded-md bg-[var(--surface)] border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--brand)]/60"
                />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-primary">
                Send message
              </button>
            </>
          )}
        </form>

        <aside className="space-y-5">
          <a href="https://cal.com/" target="_blank" rel="noreferrer" className="card-glow rounded-2xl p-6 block">
            <div className="flex items-center gap-2 text-sm font-mono text-[color:var(--brand)]">
              <Calendar size={16}/> Book a consultation
            </div>
            <p className="mt-3 text-sm text-muted-foreground">60-minute architecture call to scope, de-risk, or review your AI system.</p>
          </a>
          <a href="mailto:hello@architect.systems" className="card-glow rounded-2xl p-6 block">
            <div className="flex items-center gap-2 text-sm font-mono text-[color:var(--brand)]">
              <Mail size={16}/> Email
            </div>
            <p className="mt-3 text-sm text-muted-foreground">hello@architect.systems</p>
          </a>
          <div className="card-glow rounded-2xl p-6">
            <div className="text-sm font-mono text-muted-foreground">Elsewhere</div>
            <div className="mt-4 flex gap-3">
              <a href="https://github.com/" aria-label="GitHub" className="p-2 rounded-md btn-ghost"><Github size={16}/></a>
              <a href="https://linkedin.com/" aria-label="LinkedIn" className="p-2 rounded-md btn-ghost"><Linkedin size={16}/></a>
              <a href="https://upwork.com/" aria-label="Upwork" className="p-2 rounded-md btn-ghost"><Briefcase size={16}/></a>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        className="mt-2 w-full px-3 py-2 rounded-md bg-[var(--surface)] border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--brand)]/60"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
