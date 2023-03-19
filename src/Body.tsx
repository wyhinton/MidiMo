import { useEffect, useState } from "react";

import "./App.css";
import { Card, Container } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.css";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { Input, MIDIMessage, Output, useMIDIMessage } from "@react-midi/hooks";
import DragSection from "./DragSection";
import { FuncCarrier, MidiData, ModuleData, useStore } from "./store";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { getMessageType } from "./utils";
import "font-awesome/css/font-awesome.min.css";
import GlobalVars from "./GlobalVars";
import AddNewProcessor from "./AddNewProcessor";
import { brightColor } from "./theme";
import { Item, Menu } from "react-contexify";
import { cloneDeep } from "lodash";
import { useEffectOnce } from "usehooks-ts";

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
    outputDevice,
    setShowOutputIndicator,
    globals,
    updateGlobal,
  } = useStore();

  let smidi = {};
  useEffect(() => {
    //@ts-ignore
    if (midiInput) {
      // console.log(midiInput);
      midiInput.onmidimessage = (msg: any) => {
        // console.log(msg);
        smidi = {
          data: msg.data,
          deviceName: msg.srcElement.name,
          eventType: getMessageType(msg.data),
          blocked: false,
          eventTime: new Date(msg.timeStamp),
        } as MidiData;
        setCurrentMidiMessage(smidi as MidiData);
        const results = createFuncChain(smidi as MidiData, modules);
        setTChain(results);
        const finalOutput = results[results.length - 1];
        setShowAction(true);
        // console.log(outputDevice);
        if (finalOutput) {
          try {
            // outputDevice?.send([243, 0, 64]);
            if (midiOutput && !finalOutput.blocked) {
              // console.log(finalOutput);
              midiOutput?.send(finalOutput.data);
              setShowOutputIndicatorLocal(true);

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
        globals.forEach((g) => {
          //@ts-ignore
          // updateGlobal(g.id, window.midi[g.name]);
          //@ts-ignore
          // console.log("settings global ", g, window.midi[g.name]);
        });
        setFinalOutput(finalOutput);
      };
    }
  }, [midiInput, modules, outputDevice, setStartMessage]);

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
    console.log(result);
    if (!result.destination) {
      return;
    }
    console.log(result);
    reorder(result.source.index, result.destination.index);
  };
  return (
    <>
      <Container gap={5} css={{ padding: 0 }}>
        <Card css={{ overflow: "visible" }}>
          <Container
            alignItems="center"
            display="flex"
            justify="center"
            css={{
              padding: 0,
            }}
          >
            {/* <Text>{JSON.stringify(inputMidiMsg)}</Text> */}
            {/* <Text>{JSON.stringify(outputMidiMsg)}</Text> */}
          </Container>
          <div
            style={{
              // backgroundColor: showAction ? "green" : "red",
              padding: "10 10 0 0 ",
            }}
          >
            <AddNewProcessor />
            <GlobalVars />
            <div
              className="rounded-10 card"
              id="processor-container"
              style={{
                backgroundColor: brightColor,
                maxHeight: "50vh",
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
        </Card>
      </Container>
    </>
  );
}

export default Body;
