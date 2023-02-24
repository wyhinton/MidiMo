import { useEffect, useState } from "react";
import useStore, { MidiData } from "./store";

export default function useMidiChain(moduleIndex: number) {
  const { midiChain, startMessage, modules } = useStore();
  const [moduleInputMidi, setInputMidi] = useState<MidiData>();
  const [moduleOutputMidi, setOutputMidi] = useState<MidiData>();
  const [moduleDidBlock, setmoduleDidBlock] = useState(false);
  const [moduleStatus, setModuleStatus] = useState(["active"]);
  const [curModule, setCurModule] = useState(modules[moduleIndex]);

  useEffect(() => {
    // console.log(midiChain);
    setOutputMidi(midiChain[moduleIndex]);
    if (moduleIndex === 0) {
      setInputMidi(startMessage);
    } else {
      setInputMidi(midiChain[moduleIndex - 1]);
    }
  }, [midiChain, startMessage]);

  useEffect(() => {
    // console.log(moduleOutputMidi);

    if (moduleOutputMidi?.blocked) {
      setmoduleDidBlock(true);
    } else {
      setmoduleDidBlock(false);
    }
  }, [moduleOutputMidi]);

  useEffect(() => {
    console.log(curModule);

    let codes = [];
    if (curModule.active) {
      codes.push("ACTIVE");
    } else {
      codes.push("INACTIVE");
    }
    if (moduleOutputMidi?.blocked) {
      codes.push("CAUSED_BLOCK");
    }
    setModuleStatus(codes);
  }, [curModule, moduleOutputMidi?.blocked]);

  return {
    moduleInputMidi,
    moduleOutputMidi,
    moduleDidBlock,
    moduleStatus,
  };
}
