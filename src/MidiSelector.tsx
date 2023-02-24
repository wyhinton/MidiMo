import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  Dropdown,
  styled,
  Card,
  Spacer,
} from "@nextui-org/react";
import { Connection, Input, Output } from "@react-midi/hooks";
import Box from "./Box";
import { motion, useAnimationControls } from "framer-motion";
import useDebounce from "./useDebounce";
import useInterval from "./UseInterval";
import { useStore, MidiData } from "./store";

function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

interface ChannelIndicatorProps {
  midiData: MidiData | undefined;
}

function hasNumber(myString: string) {
  return /\d/.test(myString);
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
    const alpha = easeOutCubic(map(ledValue, 0, 100, 0, 1));
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

function map(
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  const mapped: number =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

function Showcase({
  label,
  children,
}: {
  label: string;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Container display="flex" justify="space-around" alignItems="center">
      <Text b css={{ textAlign: "left" }}>
        {label}
      </Text>
      <Spacer x={1} />
      <div>{children}</div>
    </Container>
  );
}
const ease = (t: number, b: number, _c: number, d: number): number => {
  var c = _c - b;
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t + b;
  } else {
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  }
};

interface MidiSelectorProps {
  midiItems: Input[] | Output[];
  noItemsMessage: string;
  label: string;
  activeItem: Input | Output | undefined;
  midiType: "input" | "output";
  onSelectionChange: (connection: Connection) => any;
  isProcessing?: boolean;
}
function getTween(b: number, e: number, i: number) {
  return b + (i / 99) * (e - b);
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

const emptyColor = "rgba(23,201,100,0)";
export const MidiSelector = ({
  midiItems,
  noItemsMessage,
  label,
  activeItem,
  midiType,
  onSelectionChange,
  isProcessing,
}: MidiSelectorProps) => {
  const [hasItems, sethasItems] = useState(false);
  const [selected, setSelected] = React.useState<Set<string> | undefined>(
    undefined
  );
  const [bgColor, setbgColor] = useState(emptyColor);
  // Dynamic delay
  const [delay, setDelay] = useState<number>(5);
  const [value, setValue] = useState<number>(0);
  const [isPlaying, setPlaying] = useState<boolean>(true);
  useEffect(() => {
    console.log(midiItems);
    if (midiItems.length > 0) {
      sethasItems(true);
    } else {
      sethasItems(false);
    }
    // console.log(midiItems);
  }, [midiItems]);

  useInterval(
    () => {
      // Your custom logic here
      if (value > 0) {
        setValue(value - 1);
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null
  );

  const { startMessage } = useStore();
  useEffect(() => {
    // console.log(activeItem);
    // if (activeItem && midiType == "input") {
    //   activeItem = activeItem as Input;
    //   // if (!activeItem.messageListeners.trig) {
    //   activeItem.messageListeners = {
    //     ...activeItem?.messageListeners,
    //     trig: (msg) => {
    //       console.log("ADDING TO VALUE");
    //       setValue(value + 5);
    //     },
    //   };
    //   // }
    // }
    // setValue(value + 5);
  }, [startMessage, value]);

  useEffect(() => {
    const alpha = easeOutCubic(map(value, 0, 100, 0, 1));
    setbgColor(`rgba(23,201,100,${alpha})`);
    if (isProcessing) {
      setbgColor(`rgba(23,201,100,${0})`);
    } else {
    }
  }, [value, isProcessing]);

  return (
    <Card
      css={{
        justifyContent: "center",
        padding: 10,
        // backgroundColor: bgColor,
        // backgroundColor: isProcessing ? "green" : "red",
        border: "1px solid white",
        boxShadow: "box-shadow: 0px 10px 57px -17px #17C964",
      }}
    >
      {/* <div>{value}</div> */}
      {/* <div>{debouncedValue}</div> */}
      <Showcase label={label + ":"}>
        <Dropdown>
          <Dropdown.Button rounded flat>
            {hasItems && selected
              ? (Array.from(selected.entries())[0][0] as string)
              : noItemsMessage}
          </Dropdown.Button>
          {hasItems && (
            <Dropdown.Menu
              selectionMode="single"
              onSelectionChange={(keys) => {
                const asSet = keys as Set<string>;
                const arr = Array.from(asSet);
                const asConnections = midiItems as Connection[];
                const selectedMidiItem = asConnections.find(
                  (item) => item.name === (arr[0] as string)
                );
                setSelected(keys as Set<string>);
                if (selectedMidiItem) {
                  onSelectionChange(selectedMidiItem);
                }
              }}
              selectedKeys={selected}
              aria-label="Static Actions"
            >
              {midiItems.map((item) => {
                return (
                  <Dropdown.Item key={item.name}>{item.name}</Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          )}
        </Dropdown>
      </Showcase>
      {/* <ChannelIndicator midiData={startMessage} /> */}
    </Card>
  );
};

export default MidiSelector;
