import React, { useMemo, useState } from 'react';
import './components.css';

type ShareCanvasLinkProps = {
  userId: string | null;
};

const ShareCanvasLink: React.FC<ShareCanvasLinkProps> = ({ userId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!userId) {
      return '';
    }

    return `${window.location.origin}/view/${userId}`;
  }, [userId]);

  const displayUrl = shareUrl;

  const copyToClipboard = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy share link', error);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={copyToClipboard}
        disabled={!shareUrl}
        className="share-canvas-btn"
      >
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#000' }}>
          View-only share link
        </div>
        <div
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#000',
            wordBreak: 'break-all',
          }}
          title={shareUrl}
        >
          {displayUrl || 'Share link unavailable'}
        </div>
        <div
          style={{
            fontSize: '14px',
            marginTop: '12px',
            color: copied ? '#1a5c1a' : '#333',
            fontWeight: 500,
          }}
        >
          {copied ? 'Copied to clipboard!' : 'Click to copy this link'}
        </div>
      </button>
    </div>
  );
};

export default ShareCanvasLink;
