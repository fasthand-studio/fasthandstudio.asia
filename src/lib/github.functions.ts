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

export const getRepos = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(
    `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&sort=pushed`,
    { headers: { Accept: "application/vnd.github+json", "User-Agent": "fasthandstudio.asia" } },
  );
  if (!res.ok) {
    console.error(`GitHub request failed [${res.status}]: ${await res.text()}`);
    return { repos: [] as Repo[], error: `GitHub returned ${res.status}` };
  }
  const data = (await res.json()) as any[];
  const repos: Repo[] = data
    .filter((r) => !r.private && !r.archived)
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.pushed_at ?? r.updated_at,
      topics: r.topics ?? [],
    }));
  return { repos, error: null as string | null };
});
