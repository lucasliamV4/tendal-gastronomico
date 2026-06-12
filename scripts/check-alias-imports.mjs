#!/usr/bin/env node
/**
 * Falha se algum import "@/..." não resolver para arquivo/pasta existente
 * em src/, com a MESMA capitalização.
 *
 * Cobre: import/export estáticos, dynamic import("@/x"), assets (.png/.svg/.css/...).
 *
 * Uso:
 *   node scripts/check-alias-imports.mjs           # roda uma vez
 *   node scripts/check-alias-imports.mjs --watch   # observa src/ e revalida
 */
import { readdirSync, readFileSync, statSync, watch } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const ALIAS = "@";
const WATCH = process.argv.includes("--watch");

const SCRIPT_EXTS = [".ts", ".tsx", ".js", ".jsx"];
const ASSET_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".css",
  ".scss",
  ".sass",
  ".json",
  ".mp4",
  ".webm",
  ".mp3",
  ".wav",
  ".ogg",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".pdf",
  ".txt",
  ".md",
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) out.push(full);
  }
  return out;
}

function readDirSafe(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

// Walks `parts` from `baseDir`, requiring exact case match at every segment.
// Returns { ok: true, fullPath } or { ok: false, badSegment, badAtPath, siblings }.
function caseExactWalk(baseDir, parts) {
  let current = baseDir;
  const traversed = [];
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    const entries = readDirSafe(current);
    if (!entries.includes(seg)) {
      return { ok: false, badSegment: seg, badAtPath: traversed.join("/"), siblings: entries };
    }
    traversed.push(seg);
    current = join(current, seg);
  }
  return { ok: true, fullPath: current };
}

function fileExistsExact(dir, filename) {
  return readDirSafe(dir).includes(filename);
}

// Resolve "@/foo/bar" against src/, mimicking bundler resolution + case-sensitive.
function resolveAlias(importPath) {
  const parts = importPath.split("/").filter(Boolean);
  if (parts.length === 0) return { ok: false, badSegment: "", badAtPath: "", siblings: [] };

  // Last segment may be "name" (try extensions/index) or "name.ext" (literal).
  const last = parts[parts.length - 1];
  const parentParts = parts.slice(0, -1);

  // First, walk the parent directory case-exactly.
  const parentRes = caseExactWalk(SRC, parentParts);
  if (!parentRes.ok) return parentRes;
  const parentDir = parentRes.fullPath;

  const dotIdx = last.lastIndexOf(".");
  const hasExt = dotIdx > 0;
  const ext = hasExt ? last.slice(dotIdx).toLowerCase() : "";

  // Case A: explicit extension (asset or explicit script).
  if (hasExt && (ASSET_EXTS.has(ext) || SCRIPT_EXTS.includes(ext))) {
    if (fileExistsExact(parentDir, last)) return { ok: true };
    return {
      ok: false,
      badSegment: last,
      badAtPath: parentParts.join("/"),
      siblings: readDirSafe(parentDir),
    };
  }

  // Case B: bare module — try .ts/.tsx/.js/.jsx, then directory/index.*.
  for (const e of SCRIPT_EXTS) {
    if (fileExistsExact(parentDir, last + e)) return { ok: true };
  }
  if (fileExistsExact(parentDir, last)) {
    const dirPath = join(parentDir, last);
    if (statSync(dirPath).isDirectory()) {
      for (const e of SCRIPT_EXTS) {
        if (fileExistsExact(dirPath, "index" + e)) return { ok: true };
      }
    } else {
      // file with no extension — accept as literal
      return { ok: true };
    }
  }

  return {
    ok: false,
    badSegment: last,
    badAtPath: parentParts.join("/"),
    siblings: readDirSafe(parentDir),
  };
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

function suggestSibling(badSegment, siblings) {
  const target = badSegment.toLowerCase();
  // 1) case-insensitive exact match (typical "wrong case" case)
  const ci = siblings.find((s) => s.toLowerCase() === target);
  if (ci) return ci;
  // 2) case-insensitive match ignoring extension
  const ciNoExt = siblings.find((s) => s.toLowerCase().replace(/\.[^.]+$/, "") === target);
  if (ciNoExt) return ciNoExt;
  // 3) Levenshtein
  let best = null,
    bestDist = Infinity;
  for (const s of siblings) {
    const d = levenshtein(target, s.toLowerCase());
    if (d < bestDist) {
      bestDist = d;
      best = s;
    }
  }
  return bestDist <= Math.max(2, Math.floor(target.length / 3)) ? best : null;
}

// Captures: import/export ... from "@/x"; import "@/x"; import("@/x"); require("@/x").
const IMPORT_RE =
  /(?:from\s+|import\s+|import\s*\(\s*|require\s*\(\s*|export\s+[^"'\n]*from\s+)["'](@\/[^"']+)["']/g;

function runCheck() {
  let importsChecked = 0;
  const errors = [];
  const files = walk(SRC);

  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    let m;
    IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(text)) !== null) {
      const full = m[1]; // "@/foo/bar"
      const importPath = full.slice(2); // strip "@/"
      importsChecked++;
      const res = resolveAlias(importPath);
      if (!res.ok) {
        errors.push({
          file: relative(ROOT, file),
          full,
          badSegment: res.badSegment,
          badAtPath: res.badAtPath,
          suggestion: suggestSibling(res.badSegment, res.siblings),
          siblings: res.siblings,
        });
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n✖ ${errors.length} import(s) inválido(s) com alias @/...\n`);
    for (const e of errors) {
      const where = e.badAtPath ? `@/${e.badAtPath}/` : `@/`;
      console.error(`  ${e.file}`);
      console.error(`    import:    "${e.full}"`);
      console.error(`    problema:  "${e.badSegment}" não existe em ${where}`);
      if (e.suggestion) {
        const fixed = e.badAtPath ? `@/${e.badAtPath}/${e.suggestion}` : `@/${e.suggestion}`;
        console.error(`    sugestão:  "${fixed}"`);
      }
      const visible = e.siblings.filter((s) => !s.startsWith(".")).sort();
      if (visible.length > 0 && visible.length <= 40) {
        console.error(`    disponíveis em ${where}`);
        for (const s of visible) console.error(`      • ${s}`);
      }
      console.error("");
    }
    return false;
  }

  console.log(
    `✓ check-alias-imports: ${importsChecked} import(s) "@/..." ok em ${files.length} arquivo(s) sob src${sep}.`,
  );
  return true;
}

if (!WATCH) {
  process.exit(runCheck() ? 0 : 1);
} else {
  console.log(`👀 watch: observando ${relative(ROOT, SRC)}/ … (Ctrl+C para sair)\n`);
  runCheck();
  let timer = null;
  const schedule = (path) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.clear();
      console.log(`↻ revalidando após mudança em ${path}\n`);
      runCheck();
      console.log(`\n👀 aguardando próxima mudança…`);
    }, 150);
  };
  try {
    watch(SRC, { recursive: true }, (_e, filename) => {
      if (!filename) return;
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filename)) return;
      schedule(filename);
    });
  } catch (err) {
    console.error("✖ não foi possível ativar watch recursivo:", err.message);
    process.exit(1);
  }
}
