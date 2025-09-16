// src/shared/components/layout/TopBar.tsx
import type { ReactNode } from "react";

type TopBarProps = { title: string; right?: ReactNode };

const TopBar: React.FC<TopBarProps> = ({ title, right }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <div className="header-controls">{right}</div>
    </header>
  );
};

export default TopBar;
