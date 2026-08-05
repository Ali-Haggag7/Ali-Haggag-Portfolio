export interface DeploymentNode {
    id: string;
    location: string;
    lat: number;
    lng: number;
    provider: "DigitalOcean" | "Vercel" | "Cloudflare" | "Sevalla";
    projects: string[];
    status: "ACTIVE" | "ONLINE";
}

export const DEPLOYMENT_NODES: readonly DeploymentNode[] = Object.freeze([
    {
        id: "do-frankfurt",
        location: "Frankfurt, Germany",
        lat: 50.1109,
        lng: 8.6821,
        provider: "DigitalOcean",
        projects: ["Logic Arena v3.6.5 (NestJS + Redis + Docker)"],
        status: "ACTIVE",
    },
    {
        id: "vercel-us",
        location: "Washington DC, USA (iad1)",
        lat: 38.9072,
        lng: -77.0369,
        provider: "Vercel",
        projects: ["Scout AI Dashboard", "Flurry Super-App", "Blog Pro", "Ali Haggag Portfolio"],
        status: "ONLINE",
    },
    {
        id: "cloudflare-uk",
        location: "London, UK (lhr)",
        lat: 51.5074,
        lng: -0.1278,
        provider: "Cloudflare",
        projects: ["CS Arena", "Arshivi CDN"],
        status: "ONLINE",
    },
    {
        id: "sevalla-eu",
        location: "Amsterdam, Netherlands",
        lat: 52.3676,
        lng: 4.9041,
        provider: "Sevalla",
        projects: ["Auxiliary Microservices"],
        status: "ONLINE",
    },
]);
