import { MidiSelector } from "./MidiSelector";
import React, { useEffect, useState } from "react";
import { useMap, MapOrEntries, useEffectOnce } from "usehooks-ts";
import "bootstrap/dist/css/bootstrap.css";
import { useMIDI, Input, Output, useMIDIMessage } from "@react-midi/hooks";
import { useStore } from "./store";
import { motion, useAnimationControls } from "framer-motion";
import { setTimeout } from "timers/promises";

interface MidiSupplyProps {
  inputs: Input[];
  outputs: Output[];
  children: (input: Input, output: Output) => JSX.Element | JSX.Element[];
}

const MidiSupply = ({
  children,
  inputs,
  outputs,
}: MidiSupplyProps): JSX.Element => {
  const {
    setOutputDevice,
    showOutputIndicator,
    setInputDeviceName,
    inputDeviceName,
    inputDevice,
    outputDevice,
    outputDeviceName,
    setOutputDeviceName,
  } = useStore();
  const [activeInput, setactiveInput] = useState<Input | undefined>(
    inputs.find((i) => i.name === inputDeviceName)
  );
  useEffect(() => {
    console.log(inputDeviceName);
    setactiveInput(inputs.find((i) => i.name === inputDeviceName));
  }, [inputDeviceName, inputs]);
  const [activeOutput, setactiveOutput] = useState<Output | undefined>(
    outputs[0] ?? undefined
  );

  return (
    <div>
      {/* <motion.div animate={controls}> */}
      <MidiSelector
        midiType="input"
        activeItem={activeInput}
        selectedKeys={[inputDeviceName]}
        onSelectionChange={(connection) => {
          setactiveInput(connection as Input);
          setInputDeviceName(connection.name);
        }}
        midiItems={inputs}
        noItemsMessage="No Midi Inputs Detected"
        label="Input Device"
      />
      {/* </motion.div> */}
      {activeInput && activeOutput ? (
        children(activeInput, activeOutput)
      ) : (
        <div>input or output is missing</div>
      )}
      <MidiSelector
        midiType="output"
        activeItem={activeOutput}
        onSelectionChange={(connection) => {
          setactiveOutput(connection as Output);
          setOutputDevice(connection as Output);
          setOutputDeviceName(connection.name);
          console.log(connection);
        }}
        selectedKeys={[outputDeviceName]}
        midiItems={outputs}
        noItemsMessage="No Outputs Detected"
        isProcessing={showOutputIndicator}
        label="Output Device"
      />
    </div>
  );
};

export default MidiSupply;
