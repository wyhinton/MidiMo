import { Container, Spacer } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { useInterval } from "usehooks-ts";
import { MidiData } from "./store";
import { map } from "./utils";

interface ChannelIndicatorProps {
  midiData: MidiData | undefined;
}

const ChannelIndicator = ({ midiData }: ChannelIndicatorProps): JSX.Element => {
  const channels = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const size = 10;
  if (midiData) {
    // console.log(midiData.eventType.split(" ")[1]);
  }
  const [ledValue, setledValue] = useState(0);
  const defaultColor = "rgba(0,0,0,1)";
  // const defaultColor = "rgba(245,165,35,0)";
  const [ledBgColor, setLedBgColor] = useState("rgba(245,165,35,0)");
  useEffect(() => {
    if (ledValue < 100) {
      setledValue(ledValue + 50);
    }
  }, [midiData]);

  useEffect(() => {
    const alpha = map(ledValue, 0, 100, 0, 1);
    //   const alpha = easeOutCubic(map(ledValue, 0, 100, 0, 1));
    setLedBgColor(`rgba(245,165,35,${alpha})`);
  }, [ledValue]);

  useInterval(
    () => {
      // Your custom logic here
      if (ledValue > 0) {
        setledValue(ledValue - 5);
      }
    },
    // Delay in milliseconds or null to stop it
    10
  );

  return (
    <Container display="flex" justify="center" alignItems="baseline">
      {channels.map((c, i) => {
        return (
          <>
            <div
              style={{
                width: size,
                height: size,
                // border: "1px solid white",
                backgroundColor:
                  midiData && midiData.eventType.split(" ")[1] === c.toString()
                    ? ledBgColor
                    : defaultColor,
                borderRadius: "100%",
              }}
            >
              {/* {c} */}
            </div>
            <Spacer x={0.1} />
          </>
        );
      })}
    </Container>
  );
};

export default ChannelIndicator;
