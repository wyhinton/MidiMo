import React, { useEffect, useState } from "react";
import { Container, Text, Dropdown, Card, Spacer } from "@nextui-org/react";
import { Connection, Input, Output } from "@react-midi/hooks";
import useInterval from "../UseInterval";
import { useStore, MidiData } from "../store";
import { map } from "../utils";
import NewMidiSelector from "../NewMidiSelector";


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

interface MidiSelectorProps {
  midiItems: Input[] | Output[];
  noItemsMessage: string;
  label: string;
  activeItem: Input | Output | undefined;
  midiType: "input" | "output";
  onSelectionChange: (connection: Connection) => any;
  selectedKeys: (string | undefined)[];
  isProcessing?: boolean;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

const emptyColor = "rgba(23,201,100,0)";
export const MidiSelector = ({
  midiItems,
  label,
  onSelectionChange,
  isProcessing,
  selectedKeys,
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
    const alpha = easeOutCubic(map(value, 0, 100, 0, 1));
    setbgColor(`rgba(23,201,100,${alpha})`);
    if (isProcessing) {
      setbgColor(`rgba(23,201,100,${0})`);
    } else {
    }
  }, [value, isProcessing]);

  return (
    <Card
      className = {"w-100 rounded-0"}
      css={{
        justifyContent: "center",
        padding: 10,
        // backgroundColor: bgColor,
        backgroundColor: isProcessing ? "green" : "",
        boxShadow: "box-shadow: 0px 10px 57px -17px #17C964",
      }}
    >

      {/* <div>{value}</div> */}
      {/* <div>{debouncedValue}</div> */}
      <Showcase label={label + ":"}>
        <Dropdown>
          <Dropdown.Button rounded flat>
            {selectedKeys[0]}
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
                console.log(keys);
                setSelected(keys as Set<string>);
                if (selectedMidiItem) {
                  onSelectionChange(selectedMidiItem);
                }
              }}
              //@ts-ignore
              selectedKeys={selectedKeys}
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
    </Card>
  );
};

export default MidiSelector;
