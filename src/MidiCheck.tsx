import "bootstrap/dist/css/bootstrap.css";
import { useMIDI, Input, Output } from "@react-midi/hooks";
import { useEffect, useState } from "react";
import useStore from "./store";

interface MidiSupplyProps {
  children: (inputs: Input[], outputs: Output[]) => JSX.Element | JSX.Element[];
}

const MidiCheck = ({ children }: MidiSupplyProps): JSX.Element => {
  const { inputs, outputs, hasMIDI } = useMIDI(); // Initially returns [[], []]

  return (
    <>
      {hasMIDI && inputs.length > 0 && outputs.length > 0 ? (
        children(inputs, outputs)
      ) : (
        <div>No midi inputs/outputs/midi not suzported</div>
      )}
    </>
  );
};

export default MidiCheck;
