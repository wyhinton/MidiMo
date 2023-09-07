import { useState } from "react";
import useStore from "./store";
import useMidiChain from "./UseMidiChain";

type ModuleStatus = "active" | "error" | "inactive";

interface ToggleButtonProps {
  status: ModuleStatus;
  moduleIndex: number;
  onChange: (status: ModuleStatus) => void;
}

const getColor = (moduleStatus: string[], showProcessingIndicator: boolean) => {
  let color = "#6c757d";
  if (moduleStatus.includes("INACTIVE")) {
    return "#6c757d";
  }
  if (showProcessingIndicator) {
    return "#17C964";
  }
  if (moduleStatus.includes("CAUSED_BLOCK")) {
    return "yellow";
  }
};

const ToggleButton = ({ status, onChange, moduleIndex }: ToggleButtonProps) => {
  // const [isActive, setActive] = useState(active);
  const [curStatus, setcurStatus] = useState(status);
  const { moduleStatus } = useMidiChain(moduleIndex);
  const { showProcessingIndicator } = useStore();
  // console.log(moduleStatus);
  const size = 20;
  const boxShadowSize = 5;
  return (
    <button
      data-mappable={true}
      data-mappingid={`module_toggle_button_${moduleIndex}`}
      onClick={(e) => {
        onChange(curStatus);
      }}
      type="button"
      style={{
        width: size,
        height: size,
        padding: 0,
        backgroundColor: getColor(moduleStatus, showProcessingIndicator),
        boxShadow:
          moduleStatus.includes("ACTIVE") && showProcessingIndicator
            ? `0px 0px ${boxShadowSize}px ${boxShadowSize}px ${getColor(
                moduleStatus,
                showProcessingIndicator
              )}`
            : "",
        borderRadius: "100%",
      }}
      className={`btn btn-${status === "active" ? "primary" : "secondary"}`}
      // className={`btn btn-${status === "active" ? "primary" : "secondary"}`}
    ></button>
  );
};

export default ToggleButton;
