import React, {  } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import EditableText from "./EditableText";
import useStore, { ModuleData } from "./store";
import ToggleButton from "./ToggleButton";

interface CollapseProps {
  module: ModuleData;
  children: JSX.Element | JSX.Element[];
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
  index: number;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}
const CollapseCustom = ({
  module,
  children,
  onClick,
  title,
  index,
  dragHandleProps,
}: CollapseProps): JSX.Element => {
  const { toggleCompletedState, setModuleDescription } = useStore();

  return (
    <>
      <div

        {...dragHandleProps}
        style={{
          cursor: "auto",
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
          padding: "var(--nextui-space-lg)",
          backgroundColor: "var(--nextui-colors-backgroundContrast)",
          opacity: module.active ? "1" : ".5", 
        }}
      >
        <ToggleButton
          onChange={() => {
       
            toggleCompletedState(module.id);
          }}
          moduleIndex={index}
          status={module.active ? "active" : "inactive"}
        />
        <EditableText 
        onChange={(e)=>{
          console.log(module)
          console.log(e.target.value)
          setModuleDescription(module.id, e.target!.value ?? "")
        }}
        initialText={module.description}/>
        <div
          style={{
            minWidth: "30px",
          }}
          onClick={(e) => {
            //@ts-ignore
            onClick(e);
          }}
        >
          <i
            className={
              module.expanded
                ? "fa fa-angle-up fa-lg"
                : "fa fa-angle-down fa-lg"
            }
          ></i>
        </div>
      </div>
      <div
        className={module.expanded ? "collapse.show" : "collapse"}
        id="collapseExample"
      >
        <div style={{ backgroundColor: "black" }}>{children}</div>
      </div>
    </>
  );
};

export default CollapseCustom;
