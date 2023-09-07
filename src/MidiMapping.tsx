import React, { useState, useEffect, useRef } from "react";
import { useEffectOnce } from "usehooks-ts";
import Portal from "./Portal";
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import useStore from "./store";

const getAllMappable = (): NodeList => {
  return document.querySelectorAll('[data-mappable="true"]');
};


const MidiMapping = (): JSX.Element => {

    const [rects, setRects] = useState<DOMRect[]>([])
const {showMidiMap} = useStore()

  useEffectOnce(() => {
    setTimeout(()=>{
        const t = getAllMappable();
        const rects = Array.from(t).map((t: Node)=>{
            const asHtml = t as HTMLElement;
            return asHtml.getBoundingClientRect()
        })
        setRects(rects)
    }, 1000)

  });

  useEffect(()=>{
    const t = getAllMappable();
    const rects = Array.from(t).map((t: Node)=>{
        const asHtml = t as HTMLElement;
        return asHtml.getBoundingClientRect()
    })
    setRects(rects)
  },[showMidiMap]);
  useEffect(()=>{
    console.log(rects);
  },[rects]);
  return <div>

    <Portal animate={true} visible={showMidiMap} divId="#midiMappingPortal">
        <Stage 
        onKeyPress={(e: Event) =>{
            console.log(e)
        }}
        width={window.innerWidth} height={window.innerHeight} color>
        <Layer o>
            <Text text="Try click on rect" />
            {
                rects.map((r, i)=>{
                return(      
                    <Rect
                    key = {i}
                    x={r.x}
                    y={r.y}
                    width={r.width}
                    height={r.height}
                    opacity={.6}
                    // y={20}
                    // width={50}
                    // height={50}
                    fill={"#ffc107"}
                    // {...r}
                    // shadowBlur={5}
                    // onClick={handleClick}
                  />)
                })
            }
        </Layer>
        </Stage>
    </Portal>
  </div>;
};

export default MidiMapping;
