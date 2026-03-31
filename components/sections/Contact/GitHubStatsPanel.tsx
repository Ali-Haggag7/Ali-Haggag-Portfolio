// components/GitHubStatsPanel.tsx
import { getGitHubStats } from "@/lib/github";
import { GitHubStatsClient } from "./GitHubStatsClient";

export async function GitHubStatsPanel() {
    const stats = await getGitHubStats();
    return <GitHubStatsClient stats={stats} />;
}