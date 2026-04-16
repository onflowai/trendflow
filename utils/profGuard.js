import { getBlacklist } from './blacklisted.js';
/**
 * profGuard uses blacklisted which is blacklisted word to scan markdown for prof
 * main function: assertNoProfDump
 */
let cachedSet = null;
let warnedEmpty = false;
//let cachedLoadedAt = 0;

function stripMarkdownCodeAndUrls(input) {
  let s = String(input || '');
  s = s.replace(/```[\s\S]*?```/g, ' ');// strip fenced code blocks ```...```
  s = s.replace(/`[^`]*`/g, ' ');// strip inline code `...`
  s = s.replace(/https?:\/\/\S+/gi, ' ');// strip urls so they don't tokenize into garbage
  return s;
}

function tokenizeWords(text) {
  return String(text || '')
    .toLowerCase()
    // keep letters/numbers and apostrophes; convert the rest to spaces
    .replace(/[^a-z0-9']+/g, ' ')
    .split(' ')
    .map((w) => w.trim())
    .filter(Boolean);
}

// async function getBlacklistSet() {
//   const TTL_MS = 30 * 60 * 1000;// reload every 30 minutes just in case remote list changes
//   const now = Date.now();

//   if (cachedSet && now - cachedLoadedAt < TTL_MS) return cachedSet;

//   const list = await getBlacklist();
//   const arr = Array.isArray(list) ? list : [];

//   cachedSet = new Set(arr.filter(Boolean).map(w => String(w).trim().toLowerCase()));
//   cachedLoadedAt = now;
//   return cachedSet;
// }

async function getBlacklistSet() {
  if (cachedSet) return cachedSet;// build once per process lifetime
  const list = await getBlacklist();// uses your cachedBlacklist internally
  const arr = Array.isArray(list) ? list : [];
  cachedSet = new Set(
    arr
      .filter(Boolean)
      .map((w) => String(w).trim().toLowerCase())
  );
  return cachedSet;
}

/**
 * Not a perfect profanity detection however throws if content looks like profanity dumping/spam
 * blocks bulk dumping: many hits high ratio repeated profanity
 * does NOT try to censor normal writing as only admins will be able to edit trends if prof used
 * it can be minimal
 * @param {string} input
 * @param {object} opts
 * @param {number} opts.maxTotalHits - total blacklisted hits allowed before blocking
 * @param {number} opts.maxConsecutiveHits - consecutive blacklisted hits allowed before blocking
 * @param {number} opts.minWordCount - only enforce if content is at least this long
 */
export async function assertNoProfDump(input, opts = {}) {
  const {
    maxTotalHits = 6,//allow a few, block dumps
    maxConsecutiveHits = 3,// block "word word word ..."
    minWordCount = 30,// only enforce full rules when longer
    shortConsecutiveHits = 3,// still block if short but very repetitive
    minShortWords = 8,// if fewer than this, ignore to avoid overreacting
  } = opts;

  const blacklist = await getBlacklistSet();

  if (!blacklist || blacklist.size === 0) {
    if (!warnedEmpty) {
      console.warn('[profanityGuard] blacklist empty; allowing content');
      warnedEmpty = true;
    }
    return;
  } // fail-open

  const cleaned = stripMarkdownCodeAndUrls(input);// use the stripper you already wrote
  const words = tokenizeWords(cleaned);

  if (words.length < minShortWords) return;// too tiny to be meaningful

  let totalHits = 0;
  let consecutiveHits = 0;
  let worstConsecutive = 0;

  for (const w of words) {
    if (blacklist.has(w)) {
      totalHits++;
      consecutiveHits++;
      if (consecutiveHits > worstConsecutive) worstConsecutive = consecutiveHits;
    } else {
      consecutiveHits = 0;
    }

    if (words.length < minWordCount && worstConsecutive >= shortConsecutiveHits) {
      const err = new Error('Content rejected: profanity repetition detected');
      err.code = 'PROFANITY_REPEAT_SHORT';
      err.meta = { worstConsecutive, wordCount: words.length, totalHits };
      throw err;
    }// SHORT CONTENT: if it's short but has obvious repeated profanity, block

    if (totalHits > maxTotalHits || worstConsecutive > maxConsecutiveHits) {
      const err = new Error('Content rejected: profanity dump detected');
      err.code = 'PROFANITY_DUMP';
      err.meta = { totalHits, worstConsecutive, wordCount: words.length };
      throw err;
    }// LONG CONTENTstandard dump thresholds
  }
}