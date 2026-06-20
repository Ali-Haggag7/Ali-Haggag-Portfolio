export interface GitHubStats {
    totalStars: number;
    totalCommits: number;
    totalRepos: number;
    contributions2026: number;
    currentStreak: number;
    longestStreak: number;
    topLanguages: { name: string; percentage: number }[];
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
    };
}

export async function getGitHubStats(): Promise<GitHubStats> {
    try {
        const headers = {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        };

        const userRes = await fetch("https://api.github.com/users/Ali-Haggag7", {
            headers,
            next: { revalidate: 3600 },
        });
        if (!userRes.ok) {
            console.error(`GitHub User API error: Status ${userRes.status} ${userRes.statusText}`);
            const errorText = await userRes.text().catch(() => "");
            console.error("GitHub User API response body:", errorText);
            return getFallbackStats();
        }
        const user = await userRes.json();
        if (!user || user.message) return getFallbackStats();

        const reposRes = await fetch(
            "https://api.github.com/users/Ali-Haggag7/repos?per_page=100",
            { headers, next: { revalidate: 3600 } }
        );
        if (!reposRes.ok) {
            console.error(`GitHub Repos API error: Status ${reposRes.status} ${reposRes.statusText}`);
            const errorText = await reposRes.text().catch(() => "");
            console.error("GitHub Repos API response body:", errorText);
            return getFallbackStats();
        }
        const repos = await reposRes.json();
        if (!Array.isArray(repos)) return getFallbackStats();

        const totalStars = repos.reduce(
            (acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count,
            0
        );

        const langMap: Record<string, number> = {};
        const ownRepos = repos.filter((r: { fork: boolean }) => !r.fork);

        const langResults = await Promise.all(
            ownRepos.map((repo: { languages_url: string }) =>
                fetch(repo.languages_url, {
                    headers,
                    next: { revalidate: 3600 },
                }).then(async (r) => {
                    if (!r.ok) {
                        console.error(`GitHub Languages API error for ${repo.languages_url}: Status ${r.status} ${r.statusText}`);
                        return {};
                    }
                    return r.json().catch(() => ({}));
                })
            )
        );

        for (const langData of langResults) {
            for (const [lang, bytes] of Object.entries(langData)) {
                langMap[lang] = (langMap[lang] || 0) + (bytes as number);
            }
        }

        const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
        const topLanguages = Object.entries(langMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, bytes]) => ({
                name,
                percentage: Math.round((bytes / totalBytes) * 100),
            }));

        const graphqlRes = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers,
            body: JSON.stringify({
                query: `{
                    user(login: "Ali-Haggag7") {
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

        const gql = await graphqlRes.json();
        if (gql?.errors) {
            console.error("GitHub GraphQL query errors:", JSON.stringify(gql.errors, null, 2));
            return getFallbackStats();
        }

        const collection = gql?.data?.user?.contributionsCollection;

        const totalCommits =
            (collection?.totalCommitContributions ?? 0) +
            (collection?.restrictedContributionsCount ?? 0);

        const contributions2026 =
            collection?.contributionCalendar?.totalContributions ?? 0;

        const days: { date: string; count: number }[] =
            collection?.contributionCalendar?.weeks?.flatMap(
                (w: { contributionDays: { date: string; contributionCount: number }[] }) =>
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

        return {
            totalStars,
            totalCommits,
            totalRepos: user.public_repos ?? 10,
            contributions2026,
            currentStreak,
            longestStreak,
            topLanguages,
        };
    } catch (error) {
        console.error("Error fetching GitHub stats, returning fallback:", error);
        return getFallbackStats();
    }
}