export interface GitHubStats {
    totalStars: number;
    totalCommits: number;
    totalRepos: number;
    contributions2026: number;
    currentStreak: number;
    longestStreak: number;
    topLanguages: { name: string; percentage: number }[];
}

export async function getGitHubStats(): Promise<GitHubStats> {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
    };

    const userRes = await fetch("https://api.github.com/users/Ali-Haggag7", {
        headers,
        next: { revalidate: 3600 },
    });
    const user = await userRes.json();

    const reposRes = await fetch(
        "https://api.github.com/users/Ali-Haggag7/repos?per_page=100",
        { headers, next: { revalidate: 3600 } }
    );
    const repos = await reposRes.json();

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
            }).then((r) => r.json())
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

    const gql = await graphqlRes.json();
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
}