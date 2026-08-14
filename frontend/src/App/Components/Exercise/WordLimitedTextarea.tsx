import React, { forwardRef, useId } from 'react';
import { acceptsWordLimitedEdit, countWords } from './wordLimit';

type WordLimitedTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange'
> & {
  value: string;
  /** Words the field accepts; omit for an unlimited field, which shows no counter. */
  wordLimit?: number;
  /** Called only with changes the limit accepts. */
  onValueChange: (next: string) => void;
  wrapperClassName?: string;
};

/**
 * Answer textarea that caps input at `wordLimit` and shows a live `n / limit words`
 * counter, which doubles as the textarea's accessible description.
 *
 * Rejected changes leave `value` untouched, so the caller must render it as a
 * controlled textarea. Values already over the limit are never truncated; they can
 * still be edited as long as the edit does not add words. Render this only for
 * editable fields — readonly pages show saved text instead.
 */
const WordLimitedTextarea = forwardRef<HTMLTextAreaElement, WordLimitedTextareaProps>(
  function WordLimitedTextarea(
    { value, wordLimit, onValueChange, wrapperClassName, ...textareaProps },
    ref
  ) {
    const counterId = useId();
    const wordCount = countWords(value);
    const isOverLimit = wordLimit !== undefined && wordCount > wordLimit;

    return (
      <div
        className={`exercise-answer-field${wrapperClassName ? ` ${wrapperClassName}` : ''}`}
      >
        <textarea
          {...textareaProps}
          ref={ref}
          value={value}
          aria-describedby={wordLimit === undefined ? undefined : counterId}
          onChange={(e) => {
            const next = e.target.value;
            if (acceptsWordLimitedEdit(value, next, wordLimit)) onValueChange(next);
          }}
        />
        {wordLimit !== undefined && (
          <>
            <span
              id={counterId}
              className={`exercise-word-count${
                isOverLimit ? ' exercise-word-count--over' : ''
              }`}
            >
              {wordCount} / {wordLimit} words
            </span>
            {/* Announcing the running count would talk over every keystroke, so this stays
                empty until the limit, the point where input starts being refused. */}
            <span className="exercise-sr-only" aria-live="polite">
              {wordCount < wordLimit
                ? ''
                : isOverLimit
                  ? `Over the ${wordLimit} word limit: ${wordCount} words`
                  : `Word limit reached: ${wordLimit} words`}
            </span>
          </>
        )}
      </div>
    );
  }
);

export default WordLimitedTextarea;
