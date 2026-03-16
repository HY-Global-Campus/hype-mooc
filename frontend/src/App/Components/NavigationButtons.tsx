import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/components.css';

interface NavigationButtonsProps {
  pages: { path: string; label: string; color: string }[];
  currentPage: number;
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
      <button
        className="nav-btn nav-btn-prev"
        onClick={goToPreviousPage}
        disabled={!canGoPrevious}
      >
        Previous
      </button>
      <button
        className="nav-btn nav-btn-next"
        onClick={goToNextPage}
        disabled={!canGoNext}
      >
        Next
      </button>
    </div>
  );
};

export default NavigationButtons;
