import {
  Card,
  Checkbox,
  Container,
  Grid,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { midiMessageTypes, ModuleProps } from "../types";
import { MidiData, useStore } from "../store";
import { toTitleCase } from "../utils";
import { FilterModuleData } from "./ModuleDefaults";
import Sketch from "react-p5";
import EnvelopeGraph from "../Graph";

let styles = {
    line: {
      fill: "none",
      stroke: "rgb(221, 226, 232)",
      strokeWidth: "2"
    },
    dndBox: {
      fill: "none",
      stroke: "white",
      strokeWidth: 0.1,
      height: 0.75,
      width: 0.75
    },
    dndBoxActive: {
      fill: "none",
      stroke: "white",
      strokeWidth: 0.1
    },
    corners: {
      strokeWidth: 0.25,
      length: 1,
      stroke: "white"
    }
  };
const ENVELOPE_DURATION = 1
const EnvelopeModule = ({ moduleData, midiData }: ModuleProps): JSX.Element => {
  const { setModuleData, setProcessor } = useStore();
  const [filterModuleData, setfilterModuleData] = useState<FilterModuleData>(
    moduleData.data as FilterModuleData
  );
  const [envelopePosition, setEnvelopePosition] = useState(0);
  const triggerEnvelope = () => {
    let startTime: number;
  
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / ENVELOPE_DURATION; // ENVELOPE_DURATION is the total duration for the envelope
  
      if (progress < 1) {
        // Update the envelope position
        setEnvelopePosition(progress);
  
        // Continue animation
        requestAnimationFrame(animate);
      } else {
        // Envelope animation is complete
        setEnvelopePosition(0); // Reset the envelope position
      }
    };
  
    requestAnimationFrame(animate);
  };

  
  useEffect(() => {
    setModuleData(moduleData.id, filterModuleData);
    setProcessor(moduleData.id, { func: (data)=>{
        console.log("hello from filter")
        return data} });
  }, [filterModuleData]);

  //   console.log(moduleData.data);
  return (
    <Container gap={1}>
        <div>hello</div>
        <button onClick={triggerEnvelope}>Trigger Envelope</button>
        <EnvelopeGraph 
     ya={1 - envelopePosition * 0.5}
     ys={envelopePosition * 0.5}
        defaultXa={1} defaultYa={1} defaultYs={1} defaultXd={1} defaultXr={1} styles= {styles}/>
    </Container>
  );
};

export default EnvelopeModule;
