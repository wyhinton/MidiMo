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

  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });
  useEffect(() => {
    console.log(isDragActive);
  }, [isDragActive]);
  return (
    <div {...getRootProps()} className="App">
      {isDragActive && <DragPopup />}
      <Nav />
      <Container
        css={{
          width: "100%",
          paddingLeft: 0,
          gap: "0px",
          height: "100%",
          // backgroundColor: "$background",
        }}
      >
        <Container
          sm
          css={{
            py: "$xl",
            dflex: "center",
            gap: "$lg",
            flexFlow: "column  nowrap",
            height: "100%",
          }}
        >
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // reset the state of your app so the error doesn't happen again
            }}
          >
            <SetBpm
              onBpmChange={(bpm) => {
                console.log(bpm);
              }}
            />
            <MidiCheck>
              {(inputs, outputs) => {
                return (
                  <MidiSupply inputs={inputs} outputs={outputs}>
                    {(input, output) => {
                      return (
                        <div>
                          <Line />
                          <Body midiInput={input} midiOutput={output} />
                          <Line />
                        </div>
                      );
                    }}
                  </MidiSupply>
                );
              }}
            </MidiCheck>
          </ErrorBoundary>
        </Container>
      </Container>
    </div>
  );
}

export default App;
