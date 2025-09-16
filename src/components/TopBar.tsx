// src/components/TopBar.tsx
import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  right?: ReactNode;
};

/**
 * Simple, reusable top navigation bar used across views.
 * Keeps layout consistent and avoids duplicating header markup/styles.
 */
const TopBar: React.FC<TopBarProps> = (props: TopBarProps) => {
  const { title, right } = props;
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <div className="header-controls">{right}</div>
    </header>
  );
};

export default TopBar;
