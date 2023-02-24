import { Card, Container, Text } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import useStore, { MidiData, ModuleData } from "./store";
import ToggleButton from "./ToggleButton";
import useMidiChain from "./UseMidiChain";

interface CollapseProps {
  module: ModuleData;
  children: JSX.Element | JSX.Element[];
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
  index: number;
}
const CollapseCustom = ({
  module,
  children,
  onClick,
  title,
  index,
}: CollapseProps): JSX.Element => {
  const { toggleCompletedState } = useStore();

  return (
    <>
      <div
        className="nextui-collapse-title nextui-collapse-view"
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
        {title}
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
