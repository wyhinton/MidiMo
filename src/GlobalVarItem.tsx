import { Button, Input } from "@nextui-org/react";
import _ from "lodash";
import React, { useState, useEffect, useRef } from "react";
import { FaBox } from "react-icons/fa";
import useStore, { GlobalVar } from "./store";
import { FiX } from "react-icons/fi";
interface GlobalVarProps {
  globalVar: GlobalVar;
  selected: boolean;
  onContextMenu: (event: any, globalVar: GlobalVar) => void;
}

const GlobalVarItem = ({
  globalVar,
  selected,
  onContextMenu,
}: GlobalVarProps): JSX.Element => {
  const { globals, addGlobal, deleteGlobal } = useStore();
  return (
    <div className="w-100">
      <div className="d-flex border-bottom border-secondary px-3 py-2 bg-dark justify-content-between">
        <div>
          <span className="text-blue text-monospace">window.midi.</span>
          <Input underlined initialValue={globalVar.name} />
        </div>
        <div
          onClick={(e) => {
            deleteGlobal(globalVar.id);
            //@ts-ignore
            delete window.midi[globalVar.name];
          }}
        >
          <FiX />
        </div>
        {/* <IoMdClose/> */}
      </div>
      <div className="bg-black d-flex flex-column text-left p-3">
        <div
          onContextMenu={(e) => {
            onContextMenu(e, globalVar);
          }}
        ></div>
        <div className = "d-flex pb-3">
         <div className = "d-flex align-items-center pe-3">Default:</div>
          <Input
            bordered
            initialValue={globalVar.value ? globalVar.value.toString() : ""}
          />
        </div>
        <div className = "d-flex">
         <div className = "d-flex align-items-center pe-3">Type:</div>
          <Input
            bordered
            initialValue={globalVar.value ? globalVar.value.toString() : ""}
          />
        </div>
        <div className = "pt-3">
          <div className = "text-left">{_.toString(globalVar.value)}</div>
        </div>

      </div>
    </div>
  );
};

export default GlobalVarItem;
