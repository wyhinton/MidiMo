import React, { useState, useEffect, useRef} from "react";
import { FcProcess } from "react-icons/fc";
import useStore, { MidiData } from "./store";
import { brightColor } from "./theme";

const Debugger = (): JSX.Element =>{

  const {
    modules,
    startMessage,
    midiChain,
  } = useStore();


  useEffect(()=>{
    console.log(midiChain);
  },[midiChain]);
  return(

    <div>
      <div
      className="h5 d-flex align-items-center bg-secondary p-4 m-0"
      // style={{ backgroundColor: brightColor, padding: 10, height: 60 }}
        >
      Debug
      <FcProcess />
      </div>
      <div className="d-flex flex-column overflow-auto"      style={{ maxHeight: "calc(50vh - 72px)" }}>
        <DebugStep title="start" midiData={startMessage}/>
        {modules.map((m, i)=>
          {
          return <DebugStep title={m.description} midiData={midiChain[i]} key = {i}/>
          })
        }
      </div>

    </div>
  )
}


interface DebugStepProps{
  title: string;
  midiData?: MidiData;
}
const DebugStep = ({midiData, title}: DebugStepProps): JSX.Element =>{
  const display = (midiMsg?: number[]) =>{
    if (midiMsg){
      return   midiMsg[2]?`${midiMsg[0]}, ${midiMsg[1]}, ${midiMsg[2]}`:`${midiMsg[0]}, ${midiMsg[1]}`
    }
  }


  const items = (d?: MidiData) =>{
    let time = ""

    if (d?.eventTime){
        time = JSON.stringify(d.eventTime)
    }
    return {
      Message: display(d?.data)??"",
      DeviceName: d?.deviceName??"",
      Time: time,
      "Event Type": midiData?.eventType??"",
      Blocked: midiData?.blocked ? "true" : "false"
    }
  }
  return(
    <div className="d-flex flex-column text-left align-items-start bg-dark-blue">
      <div className="semi-bold d-flex bg-black w-100 text-left text-left p-2">{title}</div>
      <div className = "p-3 text-left d-flex flex-column align-items-start">
        <DisplayItem dict={items(midiData)}></DisplayItem>
        {/* <div>Message: {display(data)}</div>
        <div>Device Name: {midiData?.deviceName}</div>
        <div>Time: {midiData?.eventTime?.toISOString()}</div>
        <div>EventType: {midiData?.eventType}</div>
        <div>Blocked: {midiData?.blocked ?? "false"}</div> */}
      </div>
    </div>
  )
}

interface DisplayItemProps{
  dict: {[key: string]: string} 
}
const DisplayItem = ({dict}: DisplayItemProps): JSX.Element =>{

  return(
    <div>
      {Object.keys(dict).map(k=>{
        return ( 
        <div className = "d-flex pb-1">
          <div>{k}:</div> <div className = "text-monospace text-blue ps-2" >{dict[k]}</div>
        </div>)
      })}
    </div>
  )
}

export default Debugger
