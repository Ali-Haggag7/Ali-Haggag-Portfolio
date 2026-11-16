export interface ContributionDay {
    date: string;
    count: number;
}

export interface GitHubStats {
    totalStars: number;
    totalCommits: number;
    totalRepos: number;
    contributions2026: number;
    currentStreak: number;
    longestStreak: number;
    topLanguages: { name: string; percentage: number }[];
    // Most recent ~84 days (12 weeks) of contribution activity for the heatmap.
    recentDays: ContributionDay[];
    // ISO timestamp set when this function actually executes (reflects cache freshness).
    lastSynced: string;
}

// Number of trailing days to surface to the heatmap widget (12 weeks).
const RECENT_DAYS_WINDOW = 84;

// Zero-filled trailing window so the heatmap never crashes on a fetch failure.
function getFallbackRecentDays(): ContributionDay[] {
    const days: ContributionDay[] = [];
    const today = new Date();
    for (let i = RECENT_DAYS_WINDOW - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() - i);
        days.push({ date: d.toISOString().split("T")[0], count: 0 });
    }
    return days;
}

function getFallbackStats(): GitHubStats {
    return {
        totalStars: 168,
        totalCommits: 1619,
        totalRepos: 17,
        contributions2026: 1646,
        currentStreak: 2,
        longestStreak: 60,
        topLanguages: [
            { name: "TypeScript", percentage: 58 },
            { name: "JavaScript", percentage: 26 },
            { name: "HTML", percentage: 9 },
            { name: "CSS", percentage: 7 },
        ],
        recentDays: getFallbackRecentDays(),
        lastSynced: new Date().toISOString(),
    };
}

function computeStreaksAndRecentDays(days: ContributionDay[]): {
    currentStreak: number;
    longestStreak: number;
    recentDays: ContributionDay[];
} {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];
    const sortedAsc = [...days]
        .filter((d) => d.date <= today)
        .sort((a, b) => a.date.localeCompare(b.date));
    const sortedDesc = [...sortedAsc].reverse();

    for (const day of sortedDesc) {
        // Don't break streak if today has 0 contributions so far
        if (day.date === today && day.count === 0) continue;
        if (day.count > 0) currentStreak++;
        else break;
    }

    for (const day of sortedAsc) {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    const recentDays = sortedAsc.slice(-RECENT_DAYS_WINDOW);
    return {
        currentStreak,
        longestStreak,
        recentDays: recentDays.length > 0 ? recentDays : getFallbackRecentDays(),
    };
}

interface PublicRestRepo {
    fork?: boolean;
    stargazers_count?: number;
    language?: string | null;
    size?: number;
}

interface PublicContributionsPayload {
    total?: Record<string, number>;
    contributions?: Array<{ date: string; count: number }>;
}

// Keyless live fallback using public GitHub REST + contributions API when GITHUB_TOKEN is missing or expired
async function fetchPublicGitHubStats(): Promise<GitHubStats> {
    try {
        const [reposRes, contribRes] = await Promise.all([
            fetch("https://api.github.com/users/Ali-Haggag7/repos?per_page=100", {
                headers: { "User-Agent": "portfolio-master" },
                next: { revalidate: 3600 },
            }),
            fetch("https://github-contributions-api.jogruber.de/v4/Ali-Haggag7?y=2026", {
                headers: { "User-Agent": "portfolio-master" },
                next: { revalidate: 3600 },
            }),
        ]);

        if (!reposRes.ok || !contribRes.ok) {
            return getFallbackStats();
        }

        const repos: PublicRestRepo[] = await reposRes.json();
        const contribData: PublicContributionsPayload = await contribRes.json();

        const totalStars = Array.isArray(repos)
            ? repos.reduce((acc, r) => acc + (r.stargazers_count ?? 0), 0)
            : 168;

        const langMap: Record<string, number> = {};
        for (const repo of Array.isArray(repos) ? repos : []) {
            if (!repo.fork && repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + Math.max(1, repo.size || 1);
            }
        }
        const totalSize = Object.values(langMap).reduce((a, b) => a + b, 0);
        const topLanguages =
            totalSize > 0
                ? Object.entries(langMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([name, size]) => ({
                        name,
                        percentage: Math.round((size / totalSize) * 100),
                    }))
                : getFallbackStats().topLanguages;

        const days: ContributionDay[] = (contribData.contributions ?? []).map((d) => ({
            date: d.date,
            count: d.count,
        }));

        const { currentStreak, longestStreak, recentDays } = computeStreaksAndRecentDays(days);
        const contributions2026 =
            contribData.total?.["2026"] ?? days.reduce((acc, d) => acc + d.count, 0);

        return {
            totalStars,
            totalCommits: contributions2026,
            totalRepos: Array.isArray(repos) ? repos.length : 17,
            contributions2026,
            currentStreak,
            longestStreak,
            topLanguages,
            recentDays,
            lastSynced: new Date().toISOString(),
        };
    } catch {
        return getFallbackStats();
    }
}

interface GraphQLRepoNode {
    name: string;
    isFork: boolean;
    stargazerCount: number;
    languages: {
        edges: {
            size: number;
            node: {
                name: string;
            };
        }[];
    };
}

interface GraphQLContributionsCollection {
    totalCommitContributions: number;
    restrictedContributionsCount: number;
    totalIssueContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    contributionCalendar: {
        totalContributions: number;
        weeks: {
            contributionDays: {
                contributionCount: number;
                date: string;
            }[];
        }[];
    };
}

interface GraphQLResponse {
    data?: {
        user?: {
            repositories?: {
                totalCount: number;
                nodes: GraphQLRepoNode[];
            };
            contributionsCollection?: GraphQLContributionsCollection;
        };
    };
    errors?: { message: string }[];
}

export async function getGitHubStats(): Promise<GitHubStats> {
    try {
        const headers = {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        };

        const graphqlRes = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers,
            body: JSON.stringify({
                query: `query {
                    user(login: "Ali-Haggag7") {
                        repositories(first: 100, ownerAffiliations: [OWNER], privacy: PUBLIC) {
                            totalCount
                            nodes {
                                name
                                isFork
                                stargazerCount
                                languages(first: 10) {
                                    edges {
                                        size
                                        node {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                        contributionsCollection(
                            from: "2025-12-31T22:00:00Z"
                            to: "2026-12-31T21:59:59Z"
                        ) {
                            totalCommitContributions
                            restrictedContributionsCount
                            totalIssueContributions
                            totalPullRequestContributions
                            totalPullRequestReviewContributions
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        date
                                    }
                                }
                            }
                        }
                    }
                }`,
            }),
            next: { revalidate: 3600 },
        });

        if (!graphqlRes.ok) {
            console.warn(
                `GitHub GraphQL API returned ${graphqlRes.status} (${graphqlRes.statusText}); falling back to public live endpoints.`
            );
            return fetchPublicGitHubStats();
        }

        const gql: GraphQLResponse = await graphqlRes.json();
        if (gql?.errors) {
            console.warn("GitHub GraphQL query errors; falling back to public live endpoints.");
            return fetchPublicGitHubStats();
        }

        const user = gql?.data?.user;
        if (!user) return fetchPublicGitHubStats();

        const nodes = user.repositories?.nodes || [];
        const totalStars = nodes.reduce(
            (acc: number, r: GraphQLRepoNode) => acc + r.stargazerCount,
            0
        );

        const langMap: Record<string, number> = {};
        const ownRepos = nodes.filter((r: GraphQLRepoNode) => !r.isFork);

        for (const repo of ownRepos) {
            const edges = repo.languages?.edges || [];
            for (const edge of edges) {
                const langName = edge.node?.name;
                const size = edge.size || 0;
                if (langName) {
                    langMap[langName] = (langMap[langName] || 0) + size;
                }
            }
        }

        const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
        const topLanguages = totalBytes > 0
            ? Object.entries(langMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([name, bytes]) => ({
                    name,
                    percentage: Math.round((bytes / totalBytes) * 100),
                }))
            : [];

        const collection = user.contributionsCollection;

        const totalCommits =
            (collection?.totalCommitContributions ?? 0) +
            (collection?.restrictedContributionsCount ?? 0);

        const contributions2026 =
            collection?.contributionCalendar?.totalContributions ?? 0;

        const days: ContributionDay[] =
            collection?.contributionCalendar?.weeks?.flatMap(
                (w) =>
                    w.contributionDays.map((d) => ({
                        date: d.date,
                        count: d.contributionCount,
                    }))
            ) ?? [];

        const { currentStreak, longestStreak, recentDays } = computeStreaksAndRecentDays(days);

        return {
            totalStars,
            totalCommits,
            totalRepos: user.repositories?.totalCount ?? nodes.length ?? 17,
            contributions2026,
            currentStreak,
            longestStreak,
            topLanguages,
            recentDays,
            lastSynced: new Date().toISOString(),
        };
    } catch (error) {
        console.warn("Error fetching GitHub GraphQL stats, using public live fallback:", error);
        return fetchPublicGitHubStats();
    }
}