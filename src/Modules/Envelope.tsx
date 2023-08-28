import {
  Container, Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { ModuleProps } from "../types";
import { useStore } from "../store";
import { FilterModuleData } from "./ModuleDefaults";
import EnvelopeGraph, { GraphPositions, PosUpdate } from "../Graph";
import { brightColor } from "../theme";

let styles = {
    line: {
      fill: "none",
      stroke: brightColor,
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
const ENVELOPE_DURATION = 15000
const EnvelopeModule = ({ moduleData, midiData }: ModuleProps): JSX.Element => {
  const { setModuleData, setProcessor, outputDevice } = useStore();
  const [filterModuleData, setfilterModuleData] = useState<FilterModuleData>(
    moduleData.data as FilterModuleData
  );
  const [currentValue, setCurrentValue] = useState(0)
  const [envelopePosition, setEnvelopePosition] = useState(0);
  const triggerEnvelope = () => {
    let startTime: number;
  
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / ENVELOPE_DURATION; // ENVELOPE_DURATION is the total duration for the envelope
      // console.log(progress)
      // console.log(progress)
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

  // useEffect(()=>{
  //   console.log(midiData);
  //   triggerEnvelope()
  // },[midiData]);


  
  const onPositionChange = (values: PosUpdate) =>{
    setCurrentValue(values.value)
  }


  useEffect(() => {
    setModuleData(moduleData.id, filterModuleData);
    setProcessor(moduleData.id, { func: (data)=>{
        // console.log("hello from filter")
        return data} });
  }, [filterModuleData]);

  //   console.log(moduleData.data);
  return (
    <Container gap={1}>
        <div>hello</div>
        <button onClick={triggerEnvelope}>Trigger Envelope</button>
        <div>{currentValue}</div>
        <div className="d-flex">
          <Input type={"number"} min={0} max={127}></Input>
          <Input className = {"ps-2"} type={"number"} min={0} max={127}></Input>
        </div>
        <EnvelopeGraph 
        time={envelopePosition}
        onPositionChange={onPositionChange}
        ya={1 - envelopePosition * 0.5}
        ys={envelopePosition * 0.5}
        defaultXa={1} defaultYa={1} defaultYs={1} defaultXd={1} defaultXr={1} styles= {styles}/>
    </Container>
  );
};

export default EnvelopeModule;
