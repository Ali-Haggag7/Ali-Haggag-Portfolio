export interface Certification {
    id: string;
    title: string;
    issuer: string;
    date: string;
    focus: string;
    verified: boolean;
}

export const CERTIFICATIONS_DATA: readonly Certification[] = Object.freeze([
    {
        id: "react-diploma",
        title: "Front-End Development Diploma",
        issuer: "Sef Academy",
        date: "2024",
        focus: "React.js, Tailwind CSS, State Management & Responsive Design",
        verified: true,
    },
    {
        id: "backend-training",
        title: "Back-End Development Training Program",
        issuer: "Web Masters",
        date: "2025",
        focus: "Node.js, Express RESTful APIs, MongoDB, JWT & Firebase Realtime",
        verified: true,
    },
    {
        id: "nodejs-diploma",
        title: "Back-End Development Diploma",
        issuer: "Sef Academy",
        date: "2025",
        focus: "Node.js, Express, Database Schema Optimization & RBAC Security",
        verified: true,
    },
    {
        id: "udemy-frontend",
        title: "The Web Frontend Learning Guide",
        issuer: "Udemy",
        date: "2024",
        focus: "JavaScript ES6+, DOM Engineering, & Web Standards",
        verified: true,
    },
]);
