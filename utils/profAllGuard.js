/**
 * profAllGuard is used to block ALL profanity (not used) with two modes
 * mode: "dump" → only block spam dumping
 * mode: "any" → block if any blacklisted word appears (strict)
 * @param {*} input 
 * @param {*} opts 
 * @returns 
 */
export async function assertNoProfanityDump(input, opts = {}) {
  const {
    mode = 'dump',// 'dump' | 'any'
    maxTotalHits = 6,
    maxConsecutiveHits = 3,
    minWordCount = 30,
  } = opts;

  const blacklist = await getBlacklistSet();

  if (!blacklist || blacklist.size === 0) {
    if (!warnedEmpty) {
      console.warn('[profanityGuard] blacklist empty; allowing content');
      warnedEmpty = true;
    }
    return;
  }
  const words = tokenizeWords(input);
  if (words.length < minWordCount && mode === 'dump') return;

  let totalHits = 0;
  let consecutiveHits = 0;
  let worstConsecutive = 0;

  for (const w of words) {
    if (blacklist.has(w)) {
      totalHits++;
      consecutiveHits++;
      if (consecutiveHits > worstConsecutive) worstConsecutive = consecutiveHits;

      if (mode === 'any') {
        const err = new Error('Content rejected: profanity detected');
        err.code = 'PROFANITY_ANY';
        err.meta = { word: w };
        throw err;
      }
    } else {
      consecutiveHits = 0;
    }

    if (mode === 'dump' && (totalHits > maxTotalHits || worstConsecutive > maxConsecutiveHits)) {
      const err = new Error('Content rejected: profanity dump detected');
      err.code = 'PROFANITY_DUMP';
      err.meta = { totalHits, worstConsecutive, wordCount: words.length };
      throw err;
    }
  }
}
