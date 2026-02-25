import { useEffect, useMemo, useState } from 'react';
import { AnsiUp } from 'ansi_up';
import { buildScreen } from './core/screen';
import { CATALOG_ROWS } from './core/data';
import { TERM_COLS, TERM_ROWS, clamp } from './core/layout';

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((v) => clamp(v - 1, 0, CATALOG_ROWS.length - 1));
        e.preventDefault();
      }

      if (e.key === 'ArrowDown') {
        setSelectedIndex((v) => clamp(v + 1, 0, CATALOG_ROWS.length - 1));
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const html = useMemo(() => {
    const ansi = buildScreen(selectedIndex, TERM_COLS, TERM_ROWS);
    const ansiUp = new AnsiUp();
    return ansiUp.ansi_to_html(ansi);
  }, [selectedIndex]);

  return (
    <div className="viewport">
      <pre className="screen" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default App;
