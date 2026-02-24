import { useEffect, useRef, useState } from 'react';
import { startRenderer } from './core/render';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [showSpectrum, setShowSpectrum] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    const stop = startRenderer(canvasRef.current, {
      crtEnabled: () => crtEnabled,
      showSpectrum: () => showSpectrum,
    });
    return () => stop();
  }, [crtEnabled, showSpectrum]);

  return (
    <div className="app-root">
      <canvas ref={canvasRef} className="screen" />
      <div className="overlay">
        <label>
          <input type="checkbox" checked={crtEnabled} onChange={(e) => setCrtEnabled(e.target.checked)} />
          CRT effects
        </label>
        <label>
          <input type="checkbox" checked={showSpectrum} onChange={(e) => setShowSpectrum(e.target.checked)} />
          Show spectrum
        </label>
      </div>
    </div>
  );
}

export default App;
