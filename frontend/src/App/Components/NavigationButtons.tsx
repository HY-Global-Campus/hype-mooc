import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/components.css';

interface NavigationButtonsProps {
  pages: { path: string; label: string; color: string }[];
  currentPage: number;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ pages, currentPage }) => {
  const navigate = useNavigate();

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      navigate(pages[currentPage - 1].path);
    }
  }, [currentPage, navigate, pages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      navigate(pages[currentPage + 1].path);
    }
  }, [currentPage, navigate, pages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Arrow keys must reach the caret in answer fields, which share this window
      // listener because nothing between them stops propagation.
      if (isEditable(event.target)) return;
      // Alt/Cmd+Arrow is the browser's own back/forward, so acting on it too moves the
      // learner two pages.
      if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;

      if (event.key === 'ArrowLeft') goToPreviousPage();
      else if (event.key === 'ArrowRight') goToNextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPreviousPage]);

  if (currentPage < 0) return null;

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < pages.length - 1;

  return (
    <div className="nav-buttons">
      {canGoPrevious && (
        <button
          type="button"
          className="nav-btn"
          onClick={goToPreviousPage}
        >
          Previous
        </button>
      )}
      {canGoNext && (
        <button
          type="button"
          className="nav-btn"
          onClick={goToNextPage}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
