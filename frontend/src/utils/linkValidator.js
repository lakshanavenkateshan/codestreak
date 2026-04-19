// ── Allowed coding platforms ──────────────────────
const ALLOWED_DOMAINS = [
  "leetcode.com",
  "hackerrank.com",
  "codeforces.com",
  "geeksforgeeks.org",
  "codechef.com",
  "github.com",
  "gitlab.com",
  "interviewbit.com",
  "topcoder.com",
  "atcoder.jp",
  "spoj.com",
  "hackerearth.com",
  "neetcode.io",
  "codingninjas.com",
  "practice.geeksforgeeks.org",
];

// Returns { valid: true } or { valid: false, message: "..." }
export function validateProblemLink(link) {
  // Empty link is OK — proof is optional
  if (!link || link.trim() === "") {
    return { valid: true, optional: true };
  }

  const trimmed = link.trim();

  // Must start with http:// or https://
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return {
      valid: false,
      message: "Link must start with https:// (example: https://leetcode.com/problems/two-sum)",
    };
  }

  // Must be a valid URL
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return { valid: false, message: "That does not look like a valid URL." };
  }

  // Must be from an allowed coding platform
  const hostname = url.hostname.replace(/^www\./, "");
  const isAllowed = ALLOWED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith("." + domain)
  );

  if (!isAllowed) {
    return {
      valid: false,
      message: `Link must be from a coding platform like LeetCode, HackerRank, Codeforces, GeeksForGeeks, GitHub, etc.`,
    };
  }

  return { valid: true };
}

// Detect platform name from URL
export function detectPlatform(link) {
  if (!link) return null;
  try {
    const hostname = new URL(link).hostname.replace(/^www\./, "");
    if (hostname.includes("leetcode"))      return "LeetCode";
    if (hostname.includes("hackerrank"))    return "HackerRank";
    if (hostname.includes("codeforces"))    return "Codeforces";
    if (hostname.includes("geeksforgeeks")) return "GeeksForGeeks";
    if (hostname.includes("codechef"))      return "CodeChef";
    if (hostname.includes("github"))        return "GitHub";
    if (hostname.includes("atcoder"))       return "AtCoder";
    if (hostname.includes("interviewbit"))  return "InterviewBit";
    if (hostname.includes("neetcode"))      return "NeetCode";
    if (hostname.includes("hackerearth"))   return "HackerEarth";
  } catch { /* ignore */ }
  return null;
}