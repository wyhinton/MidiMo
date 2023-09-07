import { MidiSelector } from "./Menues/MidiSelector";
import React, { useEffect, useState } from "react";
import { useMap, MapOrEntries, useEffectOnce } from "usehooks-ts";
import "bootstrap/dist/css/bootstrap.css";
import { useMIDI, Input, Output, useMIDIMessage } from "@react-midi/hooks";
import { useStore } from "./store";
import { motion, useAnimationControls } from "framer-motion";
import { setTimeout } from "timers/promises";
import NewMidiSelector from "./NewMidiSelector";

interface MidiSupplyProps {
  inputs: Input[];
  outputs: Output[];
  children: (input: Input, output: Output, activeInputs: Input[]) => JSX.Element | JSX.Element[];
}

const MidiSupply = ({
  children,
  inputs,
  outputs,
}: MidiSupplyProps): JSX.Element => {
  const {
    setOutputDevice,
    showOutputIndicator,
    inputDeviceName,
    outputDeviceName,
    setOutputDeviceName,
    inputDevices,
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

  const [activeInputs, setActiveInputs] = useState<Input[]>([])

  useEffect(()=>{
    console.log(inputDevices)
    const active = inputs.filter(i=>inputDevices.includes(i.id))
    setActiveInputs(active)
    inputs.map(i=>{
      if (!inputDevices.includes(i.id)){
        console.log("should remove")
        console.log(i.name)
        i.onmidimessage = (msg) => {}
      }
    })
  },[inputDevices, inputs]);

  return (
    <>
      {/* <motion.div animate={controls}> */}
      <NewMidiSelector items={inputs} storeItems={inputDevices}></NewMidiSelector>
      {/* <MidiSelector
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
      /> */}
      {/* </motion.div> */}
      {activeInput && activeOutput ? (
        children(activeInput, activeOutput, activeInputs)
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
    </>
  );
};

export default MidiSupply;
