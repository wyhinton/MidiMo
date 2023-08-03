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

const EnvelopeModule = ({ moduleData, midiData }: ModuleProps): JSX.Element => {
  const { setModuleData, setProcessor } = useStore();
  const [filterModuleData, setfilterModuleData] = useState<FilterModuleData>(
    moduleData.data as FilterModuleData
  );
  // console.log(moduleData);

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
        <EnvelopeGraph defaultXa={1} defaultYa={1} defaultYs={1} defaultXd={1} defaultXr={1} styles= {styles}/>
    </Container>
  );
};

export default EnvelopeModule;
