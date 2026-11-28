import { createServerFn } from "@tanstack/react-start";

export const GITHUB_ORG = "FastHand-Studio";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

const OK_TTL = 5 * 60 * 1000;
const FAIL_TTL = 60 * 1000;

let good: { at: number; repos: Repo[] } | null = null;
let failedAt = 0;

async function fetchRepos(): Promise<{ repos: Repo[]; error: string | null }> {
  const token = process.env["GITHUB_TOKEN"];
  const res = await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&sort=pushed`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "fasthandstudio.asia",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  if (!res.ok) {
    console.error(`GitHub request failed [${res.status}]: ${(await res.text()).slice(0, 200)}`);
    return { repos: [] as Repo[], error: `GitHub returned ${res.status}` };
  }
  const data = (await res.json()) as Record<string, unknown>[];
  const repos: Repo[] = data
    .filter((r) => !r["private"] && !r["archived"] && !String(r["name"]).startsWith("."))
    .map((r) => ({
      id: Number(r["id"]),
      name: String(r["name"]),
      description: (r["description"] as string | null) ?? null,
      url: String(r["html_url"]),
      language: (r["language"] as string | null) ?? null,
      stars: Number(r["stargazers_count"]),
      forks: Number(r["forks_count"]),
      updatedAt: String(r["pushed_at"] ?? r["updated_at"]),
      topics: (r["topics"] as string[] | undefined) ?? [],
    }));
  return { repos, error: null as string | null };
}

// Unauthenticated GitHub traffic is capped at 60 requests/hour per egress IP, which a
// shared host burns through quickly: cache successes and back off after failures.
export const getRepos = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (good && now - good.at < OK_TTL) return { repos: good.repos, error: null };
  if (now - failedAt < FAIL_TTL) {
    return good
      ? { repos: good.repos, error: null }
      : { repos: [] as Repo[], error: "GitHub is throttling us" };
  }

  const fresh = await fetchRepos();
  if (fresh.error) {
    failedAt = now;
    return good ? { repos: good.repos, error: null } : fresh;
  }
  good = { at: now, repos: fresh.repos };
  return fresh;
});
