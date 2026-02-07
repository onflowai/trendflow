/**
 * 
 * stringGuard against garbage / spam content
 * - repeated characters: "aaaaaaa...." for ONLY letters/numbers
 * - repeated same word: "rust rust rust ..."
 * - repeated phrases: "ass hole ass hole ..."
 * - super low unique ratio: "word word word ..."
 * - "one huge word" blobs: base64 / random strings
 * @param {*} text 
 * @returns 
 */

function tokenizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, ' ')
    .split(' ')
    .map((w) => w.trim())
    .filter(Boolean);
}

function stripForCharRunCheck(input) {
  let s = String(input || '');
  s = s.replace(/```[\s\S]*?```/g, ' ');// remove fenced code blocks entirely (often contain long separators)  
  s = s.replace(/(^|\n)\s*[-|:\s]{10,}(\n|$)/g, '\n');// remove markdown separator/table-ish lines made of -,|,: and spaces "-----"
  s = s.replace(/(^|\n)\s*([-_*])\2{2,}\s*(\n|$)/g, '\n');// remove horizontal rules like "---" or "___" (3+ chars) 
  return s;
}//strip things that create false positives for char-run checks

function maxRunLengthAlphaNum(str) {
  const s = String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ''); 

  let max = 0;
  let run = 0;
  let prev = '';
  for (const ch of s) {
    if (ch === prev) run++;
    else run = 1;
    prev = ch;
    if (run > max) max = run;
  }
  return max;
}//run-length check ONLY on alphanumerics so "--------" doesn't trip it


function maxRepeatedNgramRun(words, n = 2) {
  if (!Array.isArray(words) || words.length < n * 2) return 1;

  let best = 1;
  let run = 1;

  for (let i = n; i <= words.length - n; i++) {
    let same = true;
    for (let j = 0; j < n; j++) {
      if (words[i - n + j] !== words[i + j]) {
        same = false;
        break;
      }
    }

    if (same) {
      run++;
      if (run > best) best = run;
      i += n - 1;
    } else {
      run = 1;
    }
  }
  return best;
}

export function assertNoLongStringAbuse(input, opts = {}) {
  const {
    minChars = 40,
    maxSingleTokenLen = 80,
    maxCharRun = 25,//applies to alphanumerics only 
    maxSameWordRun = 10,
    minUniqueWordRatio = 0.2,
    minWordCount = 25,
    maxSameBigramRun = 6,
    maxSameTrigramRun = 5,
  } = opts;

  const raw = String(input || '');
  if (raw.length < minChars) return;
  const cleanedForRun = stripForCharRunCheck(raw);//character run check ONLY alphanumerics 
  const run = maxRunLengthAlphaNum(cleanedForRun); 
  if (run > maxCharRun) {
    const err = new Error('Content rejected: excessive repeated characters');
    err.code = 'LONGSTRING_CHAR_RUN';
    err.meta = { maxCharRun, actual: run };
    throw err;
  }
  const words = tokenizeWords(raw);//token checks
  if (words.length < minWordCount) return;
  for (const w of words) {
    if (w.length > maxSingleTokenLen) {
      const err = new Error('Content rejected: suspicious long token detected');
      err.code = 'LONGSTRING_BIG_TOKEN';
      err.meta = { maxSingleTokenLen, actual: w.length };
      throw err;
    }
  } //huge token

  let sameRun = 1;
  let worstSameRun = 1;
  for (let i = 1; i < words.length; i++) {
    if (words[i] === words[i - 1]) {
      sameRun++;
      if (sameRun > worstSameRun) worstSameRun = sameRun;
      if (worstSameRun > maxSameWordRun) {
        const err = new Error('Content rejected: excessive repeated words');
        err.code = 'LONGSTRING_WORD_RUN';
        err.meta = { maxSameWordRun, actual: worstSameRun };
        throw err;
      }
    } else {
      sameRun = 1;
    }
  }  //repeated same word run
  const worstBigram = maxRepeatedNgramRun(words, 2);
  if (worstBigram > maxSameBigramRun) {
    const err = new Error('Content rejected: excessive repeated phrase');
    err.code = 'LONGSTRING_BIGRAM_RUN';
    err.meta = { maxSameBigramRun, actual: worstBigram };
    throw err;
  }  //epeated phrases (bigrams/trigrams)

  const worstTrigram = maxRepeatedNgramRun(words, 3);
  if (worstTrigram > maxSameTrigramRun) {
    const err = new Error('Content rejected: excessive repeated phrase');
    err.code = 'LONGSTRING_TRIGRAM_RUN';
    err.meta = { maxSameTrigramRun, actual: worstTrigram };
    throw err;
  }
  const unique = new Set(words).size;
  const ratio = unique / words.length;
  if (ratio < minUniqueWordRatio) {
    const err = new Error('Content rejected: low unique-word ratio (spam/gibberish)');
    err.code = 'LONGSTRING_LOW_UNIQUE';
    err.meta = { minUniqueWordRatio, actual: ratio, unique, total: words.length };
    throw err;
  }  //low unique word ratio
}