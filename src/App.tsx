import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { buildScreen } from './core/screen';
import { TERM_COLS, TERM_ROWS, clamp } from './core/layout';
import { CATALOG_ROWS } from './core/data';

function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewport, setViewport] = useState({ cols: TERM_COLS, rows: TERM_ROWS });

  useEffect(() => {
    if (!mountRef.current || termRef.current) return;

    const term = new Terminal({
      cols: TERM_COLS,
      rows: TERM_ROWS,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.0,
      cursorBlink: false,
      convertEol: true,
      allowProposedApi: false,
      theme: {
        background: '#06090a',
        foreground: '#c8cecc',
        black: '#06090a',
        brightBlack: '#5f6766',
        cyan: '#4a9fa0',
        magenta: '#a866a8',
        green: '#76b270',
        white: '#d3d7d5',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(mountRef.current);
    fitAddon.fit();
    termRef.current = term;

    const syncViewport = () => {
      setViewport((prev) => {
        if (prev.cols === term.cols && prev.rows === term.rows) return prev;
        return { cols: term.cols, rows: term.rows };
      });
    };
    syncViewport();

    const keySub = term.onKey(({ domEvent }) => {
      if (domEvent.key === 'ArrowUp') {
        setSelectedIndex((v) => clamp(v - 1, 0, CATALOG_ROWS.length - 1));
        domEvent.preventDefault();
      } else if (domEvent.key === 'ArrowDown') {
        setSelectedIndex((v) => clamp(v + 1, 0, CATALOG_ROWS.length - 1));
        domEvent.preventDefault();
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      syncViewport();
    });
    resizeObserver.observe(mountRef.current);

    return () => {
      resizeObserver.disconnect();
      keySub.dispose();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    const screen = buildScreen(selectedIndex, viewport.cols, viewport.rows);
    term.write(`\x1b[2J\x1b[H${screen}`);
  }, [selectedIndex, viewport.cols, viewport.rows]);

  return (
    <div className="app-shell">
      <div className="terminal-frame" ref={mountRef} />
      <div className="hint">Use ↑/↓ to change selected record</div>
    </div>
  );
}

export default App;
