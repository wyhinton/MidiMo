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
import { useEffectOnce } from "usehooks-ts";
import Module from "module";
import _ from "lodash";

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
      processChain[index] = cloneDeep(startMidi);
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
  const {setOutputDevice, piano, setPianoState} = useStore()

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

  useEffectOnce(()=>{
    console.log("here")
    const myFunc = (data: MidiData)=>{
      console.log(data)
      setCurrentMidiMessage(data)
      const results = createFuncChain(data as MidiData, modules);
      setTChain(results);
      const finalOutput = results[results.length - 1];
      // setShowAction(true);
      console.log(finalOutput)
      console.log(midiOutput)

    };

    // piano.onNoteEnd = myFunc;
    setPianoState({onNoteEnd: myFunc})
    // console.log(piano.onNoteEnd)
    // setOutputDevice(midiOutput)
  })

  useEffect(()=>{
    const myFunc = (data: MidiData)=>{
      console.log(data)
      setCurrentMidiMessage(data)
      const results = createFuncChain(data as MidiData, modules);
      setTChain(results);
      if (data.eventTime?.toISOString() !== currentMidiMessage?.eventTime?.toISOString()){
        const finalOutput = results[results.length - 1];
        // setShowAction(true);
        setFinalOutput(finalOutput)
        console.log('here')
        console.log(modules)
        midiOutput?.send(finalOutput.data);
      }
  
    };

    // piano.onNoteEnd = myFunc;
    setPianoState({onMessage: myFunc})
  }, [midiInput, finalOutput]);

  useEffect(() => {
    //@ts-ignore
    if (midiInput) {
      midiInput.onmidimessage = (msg: any) => {
        console.log(JSON.stringify(msg.data))
        const newMidiMessage = {
          data: msg.data,
          deviceName: msg.srcElement.name,
          eventType: getMessageType(msg.data),
          blocked: false,
          eventTime: new Date(msg.timeStamp),
        } as MidiData;
        if (newMidiMessage.eventTime?.toISOString() !== currentMidiMessage?.eventTime?.toISOString()){
          setCurrentMidiMessage(_.cloneDeep(newMidiMessage) as MidiData);
          // setCurrentMidiMessage(newMidiMessage as MidiData);
          console.log(JSON.stringify(newMidiMessage.data))
          const results = createFuncChain(newMidiMessage as MidiData, modules);
          console.log(results)
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
                setTimeout(() => {
                  if (showOutputIndicatorLocal) {
                    setShowOutputIndicatorLocal(false);
                  }
                }, INDICATOR_LENGTH);
              }
            } catch (e) {
              console.error(e);
              console.error(
                `could send midi message ${JSON.stringify(finalOutput)}`
              );
            }
          }
        }
      };

    }
  }, [midiInput, finalOutput]);

  useEffect(()=>{
    updateAllGlobals()
  },[finalOutput]);

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
