/* global midi */
import { useEffect, useState } from "react";
import Body from "./Body";
import { ErrorBoundary } from "react-error-boundary";
import MidiSupply from "./MidiSupply";
import MidiCheck from "./MidiCheck";
import ErrorFallback from "./ErrorFallback";
import { useDropzone } from "react-dropzone";
import DragPopup from "./DragPopup";
import useStore from "./store";
import { useEffectOnce } from "usehooks-ts";
import useKeyboardShortcut from "use-keyboard-shortcut";
import "./styles.scss"

import BottomToolbar from "./BottomToolbar";
import GlobalVars from "./GlobalVars";


function App() {
  //@ts-ignore
  // console.log(MIDI);
  const { loadStore, globals } = useStore();
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


  const ensureGlobalVars = () =>{
    //@ts-ignore
    if (!window.midi){
      //@ts-ignore
      window.midi = {}
      globals.map(g=>{
        //@ts-ignore
        window.midi[g.name] = g.value??g.defaultValue;
        
      })
    }
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
    ensureGlobalVars()
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
    //@ts-ignore
    console.log(window.midi)
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
    <div {...getRootProps()} className="App w-100 d-flex">
      {isDragActive && <DragPopup />}
      <div className = "col-3 h-100">
        <GlobalVars/>
      </div>
      <div className="col-9 position-relative h-100">
        <div
        className="justify-content-center m-auto position-relative h-100"
        >
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // reset the state of your app so the error doesn't happen again
            }}
          >
            <MidiCheck>
              {(inputs, outputs) => {
                return (
                  <MidiSupply inputs={inputs} outputs={outputs}>
                    {(input, output) => {
                      return (
                        <>
                          <Body midiInput={input} midiOutput={output} />
                        </>
                      );
                    }}
                  </MidiSupply>
                );
              }}
            </MidiCheck>
          </ErrorBoundary>
        </div>
        <BottomToolbar/>
      </div>
    </div>
  );
}

export default App;
