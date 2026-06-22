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
        totalStars: 180,
        totalCommits: 373,
        totalRepos: 18,
        contributions2026: 408,
        currentStreak: 18,
        longestStreak: 16,
        topLanguages: [
            { name: "JavaScript", percentage: 48 },
            { name: "TypeScript", percentage: 24 },
            { name: "HTML", percentage: 14 },
            { name: "CSS", percentage: 12 },
        ],
        recentDays: getFallbackRecentDays(),
        lastSynced: new Date().toISOString(),
    };
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
            console.error(`GitHub GraphQL API error: Status ${graphqlRes.status} ${graphqlRes.statusText}`);
            const errorText = await graphqlRes.text().catch(() => "");
            console.error("GitHub GraphQL response body:", errorText);
            return getFallbackStats();
        }

        const gql: GraphQLResponse = await graphqlRes.json();
        if (gql?.errors) {
            console.error("GitHub GraphQL query errors:", JSON.stringify(gql.errors, null, 2));
            return getFallbackStats();
        }

        const user = gql?.data?.user;
        if (!user) return getFallbackStats();

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

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date().toISOString().split("T")[0];
        const sortedDesc = [...days].sort((a, b) => b.date.localeCompare(a.date));

        for (const day of sortedDesc) {
            if (day.date > today) continue;
            if (day.count > 0) currentStreak++;
            else break;
        }

        for (const day of days) {
            if (day.count > 0) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        const todayStr = new Date().toISOString().split("T")[0];
        const recentDays = [...days]
            .filter((day) => day.date <= todayStr)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-RECENT_DAYS_WINDOW);

        return {
            totalStars,
            totalCommits,
            totalRepos: user.repositories?.totalCount ?? nodes.length ?? 10,
            contributions2026,
            currentStreak,
            longestStreak,
            topLanguages,
            recentDays:
                recentDays.length > 0 ? recentDays : getFallbackRecentDays(),
            lastSynced: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error fetching GitHub stats, returning fallback:", error);
        return getFallbackStats();
    }
}