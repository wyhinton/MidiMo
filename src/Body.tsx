import { useEffect, useState } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Input, Output } from "@react-midi/hooks";
import DragSection from "./DragSection";
import { FuncCarrier, MidiData, ModuleData, useStore } from "./store";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { getMessageType } from "./utils";
import "font-awesome/css/font-awesome.min.css";
import { brightColor } from "./theme";
import { cloneDeep } from "lodash";

interface BodyProps {
  midiInput: Input;
  midiOutput: Output;
}

const INDICATOR_LENGTH = 10;

const createFuncChain = (
  startMidi: MidiData,
  modules: ModuleData[]
): MidiData[] => {
  const allFuncs = modules.map((m) => m.processor) as FuncCarrier[];
  let processChain: MidiData[] = [];
  try {
    for (let index = 0; index < allFuncs.length; index++) {
      let curFunc = allFuncs[index];
      if (curFunc && modules[index].active) {
        startMidi = allFuncs[index].func(startMidi);
      } else {
        startMidi = startMidi;
      }
      // console.log(startMidi);
      // processChain[index] = startMidi;
      processChain[index] = cloneDeep(startMidi);
      // processChain[index] = JSON.parse(JSON.stringify(startMidi));
      if (startMidi.blocked) {
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return processChain;
};

function Body({ midiInput, midiOutput }: BodyProps) {
  const [currentMidiMessage, setCurrentMidiMessage] = useState<
    MidiData | undefined
  >();

  const [tChain, setTChain] = useState<MidiData[]>([]);
  const [finalOutput, setFinalOutput] = useState<MidiData>();
  const [showAction, setShowAction] = useState(false);
  const [showOutputIndicatorLocal, setShowOutputIndicatorLocal] =
    useState(false);

  const {
    modules,
    reorder,
    setMidiChainData,
    setStartMessage,
    setShowProcessingIndicator,
    setShowOutputIndicator,
    updateAllGlobals,
    // globals,
  } = useStore();

  useEffect(() => {
    //@ts-ignore
    if (midiInput) {
      midiInput.onmidimessage = (msg: any) => {

        const newMidiMessage = {
          data: msg.data,
          deviceName: msg.srcElement.name,
          eventType: getMessageType(msg.data),
          blocked: false,
          eventTime: new Date(msg.timeStamp),
        } as MidiData;
        if (newMidiMessage.eventTime?.toISOString() !== currentMidiMessage?.eventTime?.toISOString()){
          setCurrentMidiMessage(newMidiMessage as MidiData);
          const results = createFuncChain(newMidiMessage as MidiData, modules);
          setTChain(results);
          const finalOutput = results[results.length - 1];
          setShowAction(true);
          // // console.log(outputDevice);
          if (finalOutput) {
            try {
              // outputDevice?.send([243, 0, 64]);
              if (midiOutput && !finalOutput.blocked) {
                // console.log(finalOutput);
                midiOutput?.send(finalOutput.data);
                setShowOutputIndicatorLocal(true);
                setFinalOutput(finalOutput)
                const hideOutputIndicatorTimer = setTimeout(() => {
                  // console.log("running output desc");
                  if (showOutputIndicatorLocal) {
                    setShowOutputIndicatorLocal(false);
                  }
                }, INDICATOR_LENGTH);
                // return () => clearTimeout(hideOutputIndicatorTimer);
              }
            } catch (e) {
              console.error(e);
              console.error(
                `could send midi message ${JSON.stringify(finalOutput)}`
              );
            }
          }
        }
        // updateAllGlobals()
        // const z = ()=>{updateAllGlobals()}
        // z()
      };

    }
  }, [midiInput, finalOutput]);

  useEffect(()=>{
    console.log("here")
    updateAllGlobals()
    // console.log(finalOutput);
  },[finalOutput]);
  // }, [midiInput, modules, outputDevice, setStartMessage]);

  useEffect(() => {
    // console.log(tChain);
    setMidiChainData(tChain);
  }, [tChain]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showAction) {
        setShowAction(false);
      }
    }, INDICATOR_LENGTH);
    return () => clearTimeout(timer);
  }, [showAction, currentMidiMessage]);

  useEffect(() => {
    setShowProcessingIndicator(showAction);
  }, [showAction]);

  useEffect(() => {
    if (currentMidiMessage) {
      setStartMessage(currentMidiMessage);
    }
  }, [currentMidiMessage]);

  useEffect(() => {
    // console.log(showOut);
    setShowOutputIndicator(showOutputIndicatorLocal);
  }, [showOutputIndicatorLocal]);

  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) {
      return;
    }
    reorder(result.source.index, result.destination.index);
  };
  return (
    <div
      id="effects"
      className="col-12 align-items-center justify-center overflow-auto"
    >
      <div
        className="rounded-10 card"
        id="processor-container"
        style={{
          backgroundColor: brightColor,
          overflowY: "auto",
        }}
      >
        <DragDropContext
          onDragStart={(start, provided) => {
            console.log(start);
            console.log(provided);
          }}
          onDragEnd={onDragEnd}
        >
          <DragSection midiData={currentMidiMessage} />
        </DragDropContext>
      </div>
    </div>
  );
}

export default Body;
