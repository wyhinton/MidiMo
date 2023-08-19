/* global midi */
import { Container } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Body from "./Body";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import DragSection from "./DragSection";
import MidiSupply from "./MidiSupply";
import MidiCheck from "./MidiCheck";
import Nav from "./Nav";
import ErrorFallback from "./ErrorFallback";
import { useDropzone } from "react-dropzone";
import DragPopup from "./DragPopup";
import useStore from "./store";
import SetBpm from "./SetBpm";
import { useEffectOnce } from "usehooks-ts";
import useKeyboardShortcut from "use-keyboard-shortcut";
import 'bootstrap/dist/css/bootstrap.css';
import SideBar from "./SideBar";
import "./styles.scss"

const Line = (): JSX.Element => {
  return (
    <Container>
      <div
        style={{
          width: "100%",
          // border: "1px solid red",
          height: 50,
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{ width: 2, backgroundColor: "white", height: "100%" }}
        ></div>
      </div>
    </Container>
  );
};

function App() {
  //@ts-ignore
  // console.log(MIDI);
  const { loadStore } = useStore();
  const onDrop = (files: File[]) => {
    console.log(files);
    console.log(
      files[0].text().then((f) => {
        console.log(f);
        let parsedSettings = JSON.parse(f);
        loadStore(parsedSettings);
        console.log(parsedSettings);
      })
    );
  };
  const [octave, setOctave] = useState(3)

  //MIDDLE C IS 60


  const note_values={
    "a": 0,
    "w": 1,
    "s": 2,
    "e": 3,
    "d": 4,
    "f": 5,
    "t": 6,
    "g": 7, 
    "y": 8,
    "h": 9,
    "u": 10,
    "j": 11,
    "k": 12,
    "o": 13,
    "l": 14,  
  }

  useEffectOnce(()=>{
    console.log("doing once")
    window.addEventListener("keydown", (e)=>{
        const root = 14*octave;
        //@ts-ignore
        const keyVal = note_values[e.key as string]
        const noteVal = root+keyVal
        console.log(keyVal)
        console.log(noteVal)
    })
  })

  useKeyboardShortcut(
    ["x"],
    (shortcutKeys) => {
      if (octave<7){
        setOctave(octave+1)
      }

    },
    {
      overrideSystem: true,
      ignoreInputFields: true,
    }
  );

  useKeyboardShortcut(
    ["z"],
    (shortcutKeys) => {
      if (octave>0){
        setOctave(octave-1)
      }

    },
    {
      overrideSystem: true,
      ignoreInputFields: true,
    }
  );
  
  useEffect(()=>{
    console.log(octave); 
  },[octave]);

  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });
  
  useEffect(() => {
    console.log(isDragActive);
  }, [isDragActive]);


  return (
    <div className="d-flex">
    <SideBar></SideBar>
    <div {...getRootProps()} className="App w-100">

      {isDragActive && <DragPopup />}

      <Nav />
        <div
        className="col-6 justify-content-center pt-5 m-auto"
        >
          

          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // reset the state of your app so the error doesn't happen again
            }}
          >
            {/* <SetBpm
              onBpmChange={(bpm) => {
                console.log(bpm);
              }}
            /> */}
            <MidiCheck>
              {(inputs, outputs) => {
                return (
                  <MidiSupply inputs={inputs} outputs={outputs}>
                    {(input, output) => {
                      return (
                        <>
                          <Line />
                          <Body midiInput={input} midiOutput={output} />
                          <Line />
                        </>
                      );
                    }}
                  </MidiSupply>
                );
              }}
            </MidiCheck>
          </ErrorBoundary>
        </div>
    </div>
    </div>
  );
}

export default App;
