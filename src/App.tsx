import { useEffect, useMemo, useState } from 'react';
import { AnsiUp } from 'ansi_up';
import { buildScreen } from './core/screen';
import { CATALOG_ROWS } from './core/data';
import { TERM_COLS, TERM_ROWS, clamp } from './core/layout';

const MOBILE_BREAKPOINT = 700;

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  if (!isMobile) {
    return (
      <div className="viewport">
        <pre className="screen" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  return (
    <div className="viewport">
      <div className="m-screen">
        <div className="line h1">INTERNAL SYSTEM - SENSITIVE INFORMATION</div>
        <div className="line h2">RESTRICTED ACCESS | PRIVILEGED USERS ONLY</div>
        <div className="line">Catalog &gt; Unexplained Phenomena</div>
        <div className="line h1">Catalog: Unexplained Phenomena  /visible/images  523 Records</div>
        <div className="line">Privacy note: Internal trace logging active.</div>
        <div className="line h1">VISUAL SIGNATURE CATALOG / DESCRIPTION</div>
        <div className="line">Internal reference only. Contact records@research-gov for record requests.</div>
        <div className="line">Last Updated 04/19/2023 by jhansen</div>

        <div className="controls">
          <button type="button" onClick={() => setSelectedIndex((v) => clamp(v - 1, 0, CATALOG_ROWS.length - 1))}>
            Prev
          </button>
          <button type="button" onClick={() => setSelectedIndex((v) => clamp(v + 1, 0, CATALOG_ROWS.length - 1))}>
            Next
          </button>
        </div>

        {CATALOG_ROWS.map((row, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              type="button"
              key={row.code}
              className={`record ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedIndex(idx)}
            >
              <div className={`name ${isSelected ? 'selected' : ''}`}>{`${isSelected ? '> ' : '  '}${row.name}`}</div>
              <div className="contents">{row.contents}</div>
              <div className="meta">{`${row.date} • ${row.code} • ${row.filesCount} files`}</div>
            </button>
          );
        })}

        <div className="line footer">REFm on Use | Signal Access Policy | System Summaries | Version 0.4</div>
        <div className="line footer">Remote: Submitting a ticket</div>
        <div className="line footer">Page 1 of 2</div>
      </div>
    </div>
  );
}

export default App;
