/**
 * AliScript v2.4 — Browser-side Playground Interpreter (Subset)
 *
 * Grammar implemented:
 *   IF   cond THEN  ...  [ELSE ...]  END
 *   WHILE cond DO   ...  END
 *   FOR  id = n TO m DO  ...  END
 *   Commands: MOVE  FIRE  BURST_FIRE  PATHFIND  SCAN  STOP  WAIT  SET
 *
 * Fully deterministic: enforces the 2,000-ops/tick TLE quota described
 * in the AliScript v4.0 specification.
 */

export interface RobotState {
    x: number;            // 0..7 (arena column)
    y: number;            // 0..7 (arena row)
    dir: 0 | 1 | 2 | 3;  // 0=North  1=East  2=South  3=West
    energy: number;       // 0..100
    hp: number;           // 0..100
    laserFired: boolean;
    laserTarget?: { x: number; y: number };
}

export interface TargetState {
    x: number;
    y: number;
    hp: number;
}

export interface ExecutionStep {
    robot: RobotState;
    target: TargetState;
    opsUsed: number;
    log: string;
    error?: string;
}

export const MAX_OPS_QUOTA = 2000;

// ─────────────────────────────────────────────────────────────────────────────
// Preset Scripts  (read-only — correct AliScript v4.0 syntax)
// ─────────────────────────────────────────────────────────────────────────────
export const PRESET_SCRIPTS = [
    {
        id: "target-hunt",
        title: "Target Hunt",
        description: "Advance & eliminate",
        icon: "🎯",
        complexity: "O(N)",
        code: `// AliScript v2.4 — Target Hunt
// Close the gap then fire on sight

WHILE distance > 1 DO
  IF CAN_SEE_ENEMY THEN
    FIRE
  END
  PATHFIND
END

FIRE`,
    },
    {
        id: "patrol-perimeter",
        title: "Perimeter Patrol",
        description: "4-sector sweep",
        icon: "🔄",
        complexity: "O(1)",
        code: `// Sweep all 4 sectors of the arena
// Scanning for targets along the perimeter

FOR i = 0 TO 3 DO
  MOVE
  MOVE
  IF CAN_SEE_ENEMY THEN
    FIRE
  END
  SCAN
END`,
    },
    {
        id: "tactical-combat",
        title: "Tactical Engagement",
        description: "Smart offense + BURST",
        icon: "⚡",
        complexity: "O(1)",
        code: `// Smart engagement protocol
// Prioritizes offense, repositions if blind

IF CAN_SEE_ENEMY THEN
  SET rotation = ATAN2(NEAREST_VISIBLE_Y - POSITION_Y, NEAREST_VISIBLE_X - POSITION_X)
  FIRE
  BURST_FIRE
ELSE
  SCAN
  IF CAN_SEE_ENEMY THEN
    FIRE
  END
  PATHFIND
END`,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Interpreter
// ─────────────────────────────────────────────────────────────────────────────
export function runAliScript(code: string): ExecutionStep[] {
    const steps: ExecutionStep[] = [];

    let robot: RobotState = {
        x: 1, y: 6,
        dir: 0,         // Facing North
        energy: 100, hp: 100,
        laserFired: false,
    };
    let target: TargetState = { x: 1, y: 1, hp: 100 };
    let opsCount = 0;

    const recordStep = (log: string, error?: string) =>
        steps.push({ robot: { ...robot }, target: { ...target }, opsUsed: opsCount, log, error });

    recordStep("Script execution initialized");

    // ── Tokenize: strip comments & blank lines ───────────────────────────────
    const lines: string[] = code
        .split("\n")
        .map((l) => l.replace(/\/\/.*$/, "").trim())
        .filter(Boolean);

    if (lines.length === 0) {
        recordStep("No executable statements found.");
        return steps;
    }

    // ── Block-structure pre-pass ─────────────────────────────────────────────
    //  blockEnd[openerIdx] = index of matching END
    //  elseIdx[ifIdx]      = index of ELSE (when present)
    //  elseToIf[elseIdx]   = index of the owning IF
    const blockEnd:  Record<number, number> = {};
    const elseIdx:   Record<number, number> = {};
    const elseToIf:  Record<number, number> = {};
    const stk: number[] = [];

    for (let i = 0; i < lines.length; i++) {
        const u = lines[i].toUpperCase();
        if (u.startsWith("WHILE ") || u.startsWith("FOR ") || u.startsWith("IF ")) {
            stk.push(i);
        } else if (u === "ELSE") {
            const top = stk[stk.length - 1];
            if (top !== undefined) { elseIdx[top] = i; elseToIf[i] = top; }
        } else if (u === "END") {
            const opener = stk.pop();
            if (opener !== undefined) blockEnd[opener] = i;
        }
    }

    // ── Sensor helpers ───────────────────────────────────────────────────────
    const DX        = [ 0,  1, 0, -1]; // N  E  S  W
    const DY        = [-1,  0, 1,  0];
    const DIR_NAMES = ["North", "East", "South", "West"];

    /** True when target is in line-of-sight along robot.dir */
    const canSeeEnemy = (): boolean => {
        let nx = robot.x + DX[robot.dir];
        let ny = robot.y + DY[robot.dir];
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (nx === target.x && ny === target.y && target.hp > 0) return true;
            nx += DX[robot.dir];
            ny += DY[robot.dir];
        }
        return false;
    };

    const distance = (): number =>
        Math.abs(robot.x - target.x) + Math.abs(robot.y - target.y);

    /** Evaluate a boolean condition from an IF/WHILE header line */
    const evalCond = (line: string): boolean => {
        const u = line.toUpperCase();
        if (u.includes("NOT CAN_SEE_ENEMY")) return !canSeeEnemy();
        if (u.includes("CAN_SEE_ENEMY"))     return canSeeEnemy();
        if (u.includes("DISTANCE > 1"))      return distance() > 1;
        if (u.includes("DISTANCE > 0"))      return distance() > 0;
        if (u.includes("DISTANCE >= 1"))     return distance() >= 1;
        if (u.includes("HEALTH < 50"))       return robot.hp < 50;
        return false;
    };

    // ── Command handlers ─────────────────────────────────────────────────────
    const doFire = () => {
        robot.laserFired = true;
        robot.energy = Math.max(0, robot.energy - 8);
        if (canSeeEnemy()) {
            target.hp = Math.max(0, target.hp - 25);
            robot.laserTarget = { x: target.x, y: target.y };
            recordStep(`FIRE → Direct hit! Target HP: ${target.hp}`);
        } else {
            recordStep("FIRE → Shot missed (no line-of-sight)");
        }
    };

    const doBurstFire = () => {
        robot.laserFired = true;
        robot.energy = Math.max(0, robot.energy - 18);
        if (canSeeEnemy()) {
            target.hp = Math.max(0, target.hp - 24);
            robot.laserTarget = { x: target.x, y: target.y };
            recordStep(`BURST_FIRE → 3-shot burst! Target HP: ${target.hp}`);
        } else {
            recordStep("BURST_FIRE → Burst missed (no line-of-sight)");
        }
    };

    const doMove = () => {
        const nx = robot.x + DX[robot.dir];
        const ny = robot.y + DY[robot.dir];
        robot.laserFired = false;
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            robot.x = nx;
            robot.y = ny;
            recordStep(`MOVE → Pos (${robot.x}, ${robot.y}) · Facing ${DIR_NAMES[robot.dir]}`);
        } else {
            recordStep("MOVE → Blocked by arena wall");
        }
    };

    /**
     * PATHFIND — A* simplified: step one cell toward target along the dominant axis.
     * Also updates robot.dir to face the target.
     */
    const doPathfind = () => {
        robot.laserFired = false;
        const ddx = target.x - robot.x;
        const ddy = target.y - robot.y;
        if (Math.abs(ddx) >= Math.abs(ddy))
            robot.dir = (ddx > 0 ? 1 : 3) as 0 | 1 | 2 | 3;   // East or West
        else
            robot.dir = (ddy > 0 ? 2 : 0) as 0 | 1 | 2 | 3;   // South or North

        const nx = robot.x + DX[robot.dir];
        const ny = robot.y + DY[robot.dir];
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) { robot.x = nx; robot.y = ny; }
        recordStep(`PATHFIND → Pos (${robot.x}, ${robot.y}) · Target @ (${target.x}, ${target.y})`);
    };

    /**
     * SCAN — rotates the robot's FOV cone +90° (simulated as a dir rotation).
     * In the full engine this only rotates the FOV cone, not the body.
     */
    const doScan = () => {
        robot.dir = ((robot.dir + 1) % 4) as 0 | 1 | 2 | 3;
        robot.laserFired = false;
        recordStep(`SCAN → FOV cone rotated · Now facing ${DIR_NAMES[robot.dir]}`);
    };

    // ── FOR loop iteration counters ──────────────────────────────────────────
    const forCounters: Record<number, number> = {};

    // ── Main execution loop ──────────────────────────────────────────────────
    let pc    = 0;
    let guard = 0;
    const MAX_GUARD = 600; // safety net against infinite interpretation

    while (pc < lines.length && guard < MAX_GUARD) {
        guard++;
        opsCount += 5; // every statement costs 5 ops (mirrors real TLE quota)

        if (opsCount > MAX_OPS_QUOTA) {
            recordStep("[FATAL] TLE: 2,000 Ops Quota Exceeded", "TLE Quota Exceeded");
            break;
        }
        if (target.hp <= 0) {
            recordStep("TARGET DESTROYED! Mission Accomplished! 🎯");
            break;
        }

        const line  = lines[pc];
        const upper = line.toUpperCase().trim();

        // ── Simple action commands ───────────────────────────────────────────
        if      (upper === "FIRE")                { doFire();       pc++; }
        else if (upper === "BURST_FIRE")          { doBurstFire();  pc++; }
        else if (upper === "MOVE")                { doMove();       pc++; }
        else if (upper === "PATHFIND")            { doPathfind();   pc++; }
        else if (upper === "SCAN")                { doScan();       pc++; }
        else if (upper === "STOP")                { recordStep("STOP → Robot halted"); pc++; }
        else if (upper.startsWith("WAIT"))        { recordStep("WAIT → Tick suspension"); pc++; }
        else if (upper.startsWith("SET "))        { recordStep(`SET → ${line.slice(4).trim()}`); pc++; }

        // ── WHILE cond DO … END ──────────────────────────────────────────────
        else if (upper.startsWith("WHILE ")) {
            if (evalCond(line))
                pc++;                                       // enter loop body
            else
                pc = (blockEnd[pc] ?? pc) + 1;             // skip to after END
        }

        // ── FOR id = n TO m DO … END ─────────────────────────────────────────
        else if (upper.startsWith("FOR ")) {
            const m = upper.match(/FOR\s+\w+\s*=\s*(\d+)\s+TO\s+(\d+)\s+DO/);
            if (m) {
                const endVal = parseInt(m[2]);
                if (!(pc in forCounters)) forCounters[pc] = parseInt(m[1]);

                if (forCounters[pc] <= endVal)
                    pc++;                                   // enter loop body
                else {
                    delete forCounters[pc];
                    pc = (blockEnd[pc] ?? pc) + 1;         // exit loop
                }
            } else {
                pc++;
            }
        }

        // ── IF cond THEN … [ELSE …] END ─────────────────────────────────────
        else if (upper.startsWith("IF ")) {
            if (evalCond(line)) {
                pc++;                                       // enter THEN branch
            } else {
                const elseI = elseIdx[pc];
                const endI  = blockEnd[pc];
                pc = elseI !== undefined ? elseI + 1 : (endI ?? pc) + 1;
            }
        }

        // ── ELSE ────────────────────────────────────────────────────────────
        // Reaching ELSE means the THEN branch just finished — jump past END
        else if (upper === "ELSE") {
            const ownerIf = elseToIf[pc];
            pc = (blockEnd[ownerIf] ?? pc) + 1;
        }

        // ── END ─────────────────────────────────────────────────────────────
        // Decide whether to loop back (WHILE/FOR) or continue (IF block close)
        else if (upper === "END") {
            let whileOwner = -1;
            let forOwner   = -1;

            for (const [opIdxStr, endI] of Object.entries(blockEnd)) {
                if (endI === pc) {
                    const opIdx   = parseInt(opIdxStr);
                    const opUpper = lines[opIdx].toUpperCase().trim();
                    if      (opUpper.startsWith("WHILE ")) whileOwner = opIdx;
                    else if (opUpper.startsWith("FOR "))   forOwner   = opIdx;
                    break;
                }
            }

            if      (whileOwner >= 0) { pc = whileOwner; }              // re-evaluate WHILE
            else if (forOwner   >= 0) { forCounters[forOwner]++; pc = forOwner; } // increment + re-evaluate FOR
            else                      { pc++; }                          // IF block closed — continue
        }

        else { pc++; } // unknown token — skip
    }

    if (steps.length <= 1) recordStep("Script completed with no visible actions.");
    return steps;
}
