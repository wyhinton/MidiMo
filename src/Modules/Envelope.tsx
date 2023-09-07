import {
  Container, Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { ModuleProps } from "../types";
import { useStore } from "../store";
import { FilterModuleData } from "./ModuleDefaults";
import EnvelopeGraph, { GraphPositions, PosUpdate } from "../Graph";
import { brightColor } from "../theme";
import { useMIDIOutput } from "@react-midi/hooks";
import { map } from "../utils";

function generateControlChangeMessage(channel: number, controlNumber: number, controlValue: number): number[] {
  // Ensure valid values
  channel = Math.max(0, Math.min(15, channel)); // MIDI channels are 0-15
  controlNumber = Math.max(0, Math.min(127, controlNumber)); // Control numbers are 0-127
  controlValue = Math.max(0, Math.min(127, controlValue)); // Control values are 0-127

  // Calculate the status byte (0xB0 for Control Change, plus the channel)
  const statusByte = 0xB0 | channel;

  // Create the MIDI message as a Uint8Array
  const message = [statusByte, controlNumber, controlValue];

  return message;
}

interface GraphState{
  time: number;
  attackX: number;
  decayX: number;
  releaseX: number;
  minValue: number;
  maxValue: number;
}

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

const initialGraphState ={
  time: 0,
  attackX: 0,
  minValue: 0,
  maxValue: 127,
  releaseX: 1,
  decayX: 1,
}

const EnvelopeModule = ({ moduleData, midiData }: ModuleProps): JSX.Element => {
  const { setModuleData, setProcessor, outputDevice } = useStore();
  const [filterModuleData, setfilterModuleData] = useState<FilterModuleData>(
    moduleData.data as FilterModuleData
  );
  const [graphState, setGraphState] = useState<GraphState>(initialGraphState)

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
        setGraphState((gs)=>({...gs, time: progress}))
        // console.log(outputDevice)
        // const {minValue, maxValue}= graphState;
        if (outputDevice){
          outputDevice.send(generateControlChangeMessage(1, 2, map(progress, 0, 1, 0, 127)))
        }
        // Continue animation
        requestAnimationFrame(animate);
      } else {
        setGraphState((gs)=>({...gs, time: 0}))
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
          <Input type={"number"} onChange={(e)=>{setGraphState(gs=>({...gs, minValue: parseInt(e.target.value)}))}} min={0} max={127} value={graphState.minValue}></Input>
          <Input className = {"ps-2"} onChange={(e)=>{setGraphState(gs=>({...gs, maxValue: parseInt(e.target.value)}))}} type={"number"} value={graphState.maxValue} min={0} max={127}></Input>
          <Input onChange={(e)=>{setGraphState(gs=>({...gs, attackX: parseFloat(e.target.value)}))}} type={"number"} value={graphState.attackX} className = {"ps-2"}  step={.1} min={0} max={1}></Input>
          <Input onChange={(e)=>{setGraphState(gs=>({...gs, decayX: parseFloat(e.target.value)}))}} className = {"ps-2"} type={"number"} step={.1} min={0} max={1}></Input>
          <Input onChange={(e)=>{setGraphState(gs=>({...gs, releaseX: parseFloat(e.target.value)}))}} className = {"ps-2"} type={"number"} step={.1} min={0} max={1}></Input>
          <Input className = {"ps-2"} type={"number"} min={0} max={127}></Input>
        </div>
        <EnvelopeGraph 
        time={graphState.time}
        onPositionChange={onPositionChange}
        ya={1 - envelopePosition * 0.5}
        ys={envelopePosition * 0.5}
        attackX={graphState.attackX} 
        defaultYa={1}
        defaultYs={1}
        decayX={graphState.decayX}
        releaseX={graphState.releaseX}
        styles= {styles}/>
    </Container>
  );
};

export default EnvelopeModule;
