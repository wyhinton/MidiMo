import "bootstrap/dist/css/bootstrap.css";
import { useMIDI, Input, Output } from "@react-midi/hooks";
import { useEffect } from "react";

interface MidiSupplyProps {
  children: (inputs: Input[], outputs: Output[]) => JSX.Element | JSX.Element[];
}

const MidiCheck = ({ children }: MidiSupplyProps): JSX.Element => {
  const { inputs, outputs, hasMIDI } = useMIDI(); // Initially returns [[], []]

  // useEffect(() => {
  //   console.log(inputs, outputs);
  // }, [inputs, outputs]);
  return (
    <div>
      {hasMIDI && inputs.length > 0 && outputs.length > 0 ? (
        children(inputs, outputs)
      ) : (
        <div>No midi inputs/outputs/midi not suzported</div>
      )}
    </div>
  );
};

export default MidiCheck;
