import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
  id: string;
  stepCount: number;
  automatic?: boolean;
  canAdvance?: (position: number) => boolean;
  onRestart?: () => void;
  children: (position: number, restartVersion: number) => ReactNode;
}

export default function SimulationPlayer({
  id,
  stepCount,
  automatic = false,
  canAdvance = () => true,
  onRestart,
  children,
}: Props) {
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(
    () => automatic && !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [delay, setDelay] = useState(3000);
  const [restartVersion, setRestartVersion] = useState(0);
  const last = position === stepCount - 1;
  const blocked = !canAdvance(position);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const stopForReducedMotion = () => {
      if (preference.matches) setPlaying(false);
    };
    preference.addEventListener("change", stopForReducedMotion);
    return () => preference.removeEventListener("change", stopForReducedMotion);
  }, []);

  useEffect(() => {
    if (!playing || last || blocked) return;
    const timer = window.setTimeout(() => {
      setPosition((current) => current + 1);
      if (position + 1 === stepCount - 1) setPlaying(false);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [playing, last, blocked, position, stepCount, delay]);

  function restart() {
    setPosition(0);
    setPlaying(
      automatic && !matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setRestartVersion((current) => current + 1);
    onRestart?.();
  }

  return (
    <div className="simulation-player">
      <p>
        Step {position + 1} of {stepCount}
        {automatic
          ? ` · ${playing && !last ? "Playing" : "Paused"}`
          : " · Your turn"}
      </p>
      <div>{children(position, restartVersion)}</div>
      {blocked && !last && (
        <p role="note">
          Answer all questions correctly to unlock the next step. You can still
          review previous steps.
        </p>
      )}
      <div
        className="playback-controls"
        role="group"
        aria-label={`${id} playback`}
      >
        {automatic && (
          <button
            type="button"
            disabled={last}
            onClick={() => setPlaying((current) => !current)}
          >
            {playing && !last ? "Pause" : "Play"}
          </button>
        )}
        <button
          type="button"
          disabled={position === 0}
          onClick={() => {
            setPlaying(false);
            setPosition((current) => current - 1);
          }}
        >
          Previous step
        </button>
        <button
          type="button"
          disabled={last || blocked}
          onClick={() => {
            setPlaying(false);
            setPosition((current) => current + 1);
          }}
        >
          Next step
        </button>
        <button type="button" onClick={restart}>
          Restart
        </button>
        {automatic && (
          <label htmlFor={`${id}-speed`}>
            Speed{" "}
            <select
              id={`${id}-speed`}
              value={delay}
              onChange={(event) => setDelay(Number(event.target.value))}
            >
              <option value={4000}>Slow</option>
              <option value={3000}>Normal</option>
              <option value={1200}>Fast</option>
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
