import React, { useRef } from 'react';
import NavigationButtons from './NavigationButtons';
import '../Pages/pages.css';
import { useElementHeightVar, useViewportHeightVar } from '../hooks/useViewportVars';

const layoutRootStyle: React.CSSProperties = {
  height: 'var(--app-height, 100dvh)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  height: '100%',
  overflow: 'auto',
  paddingBottom: 'calc(var(--app-footer-height, 72px) + 24px + env(safe-area-inset-bottom, 0px))',
};

interface AppLayoutProps {
  children: React.ReactNode;
  pages: { path: string; label: string; color: string }[];
  currentPageIndex: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, pages, currentPageIndex }) => {
  const footerRef = useRef<HTMLElement>(null);

  useViewportHeightVar();
  useElementHeightVar(footerRef, '--app-footer-height');

  return (
    <div style={layoutRootStyle}>
      <main style={mainStyle}>
        {children}
      </main>
      <footer
        ref={footerRef}
        className={`app-footer${currentPageIndex === 0 ? ' app-footer--dark' : ''}`}
      >
        <NavigationButtons pages={pages} currentPage={currentPageIndex} />
      </footer>
    </div>
  );
};

export default AppLayout;
