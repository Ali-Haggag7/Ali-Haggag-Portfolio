export interface CognitiveStep {
    id: "observe" | "reason" | "plan" | "act" | "verify";
    number: number;
    title: string;
    description: string;
    inspectorData: {
        heading: string;
        codeSnippet: string;
        details: string;
    };
}

export const COGNITIVE_STEPS: readonly CognitiveStep[] = Object.freeze([
    {
        id: "observe",
        number: 1,
        title: "Observe",
        description: "Captures full DOM snapshot & extracts screening questions",
        inspectorData: {
            heading: "DOM Snapshot & Screening Question Extraction",
            codeSnippet: `[WorkerThread] Navigated to https://wellfound.com/jobs/apply/3941
[DOM] Extracting screening form fields:
  - Question: "Years of experience with NestJS/Node.js?" -> TYPE: numeric
  - Question: "Are you willing to work hybrid in Cairo?" -> TYPE: boolean_radio`,
            details: "Playwright isolates page navigation in worker_threads, sending DOM trees over worker IPC without freezing the main LLM thread.",
        },
    },
    {
        id: "reason",
        number: 2,
        title: "Reason",
        description: "Two-axis classifier & Groq Llama-3.3-70B reasoning",
        inspectorData: {
            heading: "Two-Axis Classification & Deterministic Answers",
            codeSnippet: `[Classifier] Deterministic DB lookup matched candidate profile:
  - "Years experience NestJS" -> 3 (from User Experience DB, 0 LLM cost)
[LLM Reasoner] Invoking Groq Llama-3.3-70B (BYOK fallback ready):
  - Reasoning: Candidate profile satisfies hybrid requirement. Proceed to Plan.`,
            details: "Deterministic-first lookup answers known questions at 0 LLM cost. Complex questions invoke Groq Llama-3.3-70B.",
        },
    },
    {
        id: "plan",
        number: 3,
        title: "Plan",
        description: "Constructs atomic action queue for execution",
        inspectorData: {
            heading: "Task Queue Assembly & REPLAN Guard",
            codeSnippet: `[TaskQueue] Plan generated (3 atomic steps):
  1. Fill numeric input #exp-nestjs -> "3"
  2. Select radio button #hybrid-willing -> true
  3. Prepare submission buffer -> PENDING_HUMAN_APPROVAL`,
            details: "Guarded against REPLAN loops by validating pending task queues before re-evaluating state.",
        },
    },
    {
        id: "act",
        number: 4,
        title: "Act",
        description: "Playwright action execution in isolated worker_threads",
        inspectorData: {
            heading: "Worker Execution & Live Observability Streaming",
            codeSnippet: `[Executor] Running in node:worker_threads (threadId: 4)
  - Executing: page.type("#exp-nestjs", "3") -> OK
  - Executing: page.click("#hybrid-willing") -> OK
  - Relaying 2 FPS browser frame buffer over Socket.io /dashboard`,
            details: "Browser actions execute inside isolated threads. If Playwright crashes, Executor.terminateAllWorkers() prevents zombie workers.",
        },
    },
    {
        id: "verify",
        number: 5,
        title: "Verify",
        description: "'Never Lie' verifier & mandatory Final Click Rule",
        inspectorData: {
            heading: "Claims Verifier & Mandatory Final Click Rule",
            codeSnippet: `[ClaimsVerifier] Verifying submitted answers against candidate PII... VERIFIED ✓
[EthicalGuardrail] FINAL CLICK RULE ENGAGED:
  - Application prepared 100%. Human approval required before submit.
  - Waiting for user click in Tauri control room...`,
            details: "Hard architectural ethical constraint: Scout can NEVER click the final submit button automatically.",
        },
    },
]);

export const ETHICAL_SHIELDS = Object.freeze([
    {
        name: "Final Click Rule",
        status: "ACTIVE",
        description: "Requires explicit human approval before any application is submitted",
    },
    {
        name: "Never Lie Verifier",
        status: "ENFORCED",
        description: "Fails & retries if an answer cannot be verified against true user PII",
    },
    {
        name: "Zero Mass Scraping",
        status: "ENFORCED",
        description: "No residential proxy rotation or anti-bot evasion infrastructure",
    },
    {
        name: "AES-256-GCM Field Encryption",
        status: "ACTIVE",
        description: "All stored CV data and personal credentials encrypted at rest",
    },
]);
