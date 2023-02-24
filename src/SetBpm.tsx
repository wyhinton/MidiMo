import React, { useState } from "react";

interface Props {
  onBpmChange: (bpm: number) => void;
}

const SetBpm: React.FC<Props> = ({ onBpmChange }) => {
  const [bpm, setBpm] = useState(120);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const handleTap = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    const startTime = Date.now();
    let beats = 0;

    setIntervalId(
      window.setInterval(() => {
        const timeElapsed = Date.now() - startTime;

        if (timeElapsed >= 60000) {
          //@ts-ignore
          clearInterval(intervalId as number);
          setIntervalId(null);
          setBpm(beats);
          onBpmChange(beats);
          return;
        }

        beats += 1;
      }, 100)
    );
  };

  return (
    <div>
      <h2>BPM: {bpm}</h2>
      <button onClick={handleTap}>
        {intervalId !== null ? "Stop" : "Tap"}
      </button>
    </div>
  );
};

export default SetBpm;
