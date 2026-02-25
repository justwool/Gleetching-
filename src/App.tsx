import { useEffect, useMemo, useState } from 'react';
import { AnsiUp } from 'ansi_up';
import { CATALOG_ROWS, getRisk } from './core/data';
import { TERM_COLS, TERM_ROWS, clamp } from './core/layout';
import { buildScreen } from './core/screen';

const MOBILE_BREAKPOINT = 700;

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [mobileCols, setMobileCols] = useState(Math.max(32, Math.min(72, Math.floor(window.innerWidth / 9))));

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      setMobileCols(Math.max(32, Math.min(72, Math.floor(window.innerWidth / 9))));
    };
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

  const selected = CATALOG_ROWS[selectedIndex];
  const divider = '-'.repeat(mobileCols);
  const distribution = 'distribution |..:--==++**###==--:..|';

  return (
    <div className="viewport">
      <div className="m-screen">
        <pre className="divider">{divider}</pre>

        <pre className="line h1">INTERNAL SYSTEM - SENSITIVE INFORMATION</pre>
        <pre className="line h2">RESTRICTED ACCESS | PRIVILEGED USERS ONLY</pre>
        <pre className="line">Catalog &gt; Unexplained Phenomena</pre>
        <pre className="line h1">Catalog: Unexplained Phenomena  /visible/images  523 Records</pre>
        <pre className="line">Privacy note: Internal trace logging active.</pre>
        <pre className="line h1">VISUAL SIGNATURE CATALOG / DESCRIPTION</pre>
        <pre className="line">Internal reference only. Contact records@research-gov for record requests.</pre>
        <pre className="line">Last Updated 04/19/2023 by jhansen</pre>
        <pre className="line distribution">{distribution}</pre>

        <pre className="divider">{divider}</pre>

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
              <pre className="nameLine">{`${isSelected ? '> ' : '  '}${row.name}`}</pre>
              <pre className="contentsLine">{`  ${row.contents}`}</pre>
              <pre className="metaLine">{`  ${row.date} • ${row.code} • ${row.filesCount} files`}</pre>
            </button>
          );
        })}

        <pre className="focusTitle">FOCUS</pre>
        <pre className="focusBody">{`code:${selected.code}  date:${selected.date}  files:${selected.filesCount}`}</pre>
        <pre className="focusBody">{`tag:${selected.tag}  risk:${getRisk(selected.filesCount)}`}</pre>

        <pre className="divider">{divider}</pre>

        <pre className="line footer">REFm on Use | Signal Access Policy | System Summaries | Version 0.4</pre>
        <pre className="line footer">Remote: Submitting a ticket</pre>
        <pre className="line footer">Page 1 of 2</pre>
      </div>
    </div>
  );
}

export default App;
