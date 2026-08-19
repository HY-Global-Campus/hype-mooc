import React, { useEffect, useMemo, useRef, useState } from 'react';
import './components.css';

type ShareCanvasLinkProps = {
  /** Canvas owner whose read-only view is linked; renders unavailable when null. */
  userId: string | null;
};

/** `attempt` distinguishes repeats of the same outcome; see the live region below. */
type CopyResult = { kind: 'copied' | 'failed'; attempt: number };

const RESET_DELAY_MS = 2000;

/**
 * The learner's own view-only canvas link, with a copy button.
 *
 * Renders the URL as selectable text so it can also be copied by hand, which is the
 * fallback when the clipboard API is unavailable. Only ever show this to the owner of
 * the canvas — it builds the link from the id it is given, not from the current route.
 */
const ShareCanvasLink: React.FC<ShareCanvasLinkProps> = ({ userId }) => {
  const [result, setResult] = useState<CopyResult | null>(null);
  const attemptsRef = useRef(0);
  const resetTimerRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(resetTimerRef.current), []);

  const shareUrl = useMemo(
    () => (userId ? `${window.location.origin}/view/${userId}` : ''),
    [userId]
  );

  const copyToClipboard = async () => {
    if (!shareUrl) {
      return;
    }

    // A timer left over from an earlier copy would otherwise clear this attempt's
    // message early, or wipe a failure the learner still has to act on.
    window.clearTimeout(resetTimerRef.current);
    const attempt = (attemptsRef.current += 1);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setResult({ kind: 'copied', attempt });
      resetTimerRef.current = window.setTimeout(() => setResult(null), RESET_DELAY_MS);
    } catch (error) {
      // navigator.clipboard is missing outside secure contexts, where a silent failure
      // would leave the button looking inert. Left on screen until the next attempt.
      console.error('Failed to copy share link', error);
      setResult({ kind: 'failed', attempt });
    }
  };

  return (
    <div className="share-canvas">
      <div className="share-canvas-head">
        <p className="share-canvas-label">Your view-only link</p>
        {/* The region stays mounted so it exists before the text appears, and the inner
            node is keyed per attempt so repeating an outcome still reads as a change and
            gets announced. */}
        <span
          className={`share-canvas-status${
            result?.kind === 'failed' ? ' share-canvas-status--failed' : ''
          }`}
          role="status"
        >
          {result && (
            <span key={result.attempt}>
              {result.kind === 'copied'
                ? 'Copied to clipboard'
                : 'Copy failed — copy it manually'}
            </span>
          )}
        </span>
      </div>
      <div className="share-canvas-row">
        <span className="share-canvas-url">{shareUrl || 'Share link unavailable'}</span>
        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!shareUrl}
          className="share-canvas-copy"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareCanvasLink;
