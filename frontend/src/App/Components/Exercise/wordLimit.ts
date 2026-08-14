/**
 * Number of words in an answer: whitespace-separated non-empty tokens.
 *
 * Script-agnostic — any run of Unicode whitespace separates words, so Finnish
 * and other non-ASCII answers count the same as English ones.
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((token) => token.length > 0).length;
}

/**
 * Whether a word-limited field may accept `next` in place of `current`.
 *
 * `wordLimit` is a maximum word count; `undefined` means the field is unlimited
 * and every change is accepted.
 */
export function acceptsWordLimitedEdit(
  current: string,
  next: string,
  wordLimit?: number
): boolean {
  if (wordLimit === undefined) return true;
  const nextCount = countWords(next);
  // Answers saved before the limit existed can exceed it; allowing any edit that
  // does not add words keeps those editable instead of truncating stored text.
  return nextCount <= wordLimit || nextCount <= countWords(current);
}
