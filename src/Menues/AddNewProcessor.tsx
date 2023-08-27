import { Dropdown } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { EffectType } from "../types";
import { useStore } from "../store";
import { brightColor } from "../theme";
import { moduleDefaultsDict } from "../Modules/ModuleDefaults";

const AddNewProcessor = (): JSX.Element => {
  const { addModule } = useStore();
  return (
    <Dropdown>
      <Dropdown.Button
        // animated={false}
        css={{
          width: "100%",
          backgroundColor: "transparent",
          color: "white",
          textAlign: "left",
          borderRadius: "5px 5px 0px 0px",
        }}
        id="add-processor-button"
        // icon={<i className="fa fa-plus" aria-hidden="true"></i>}
        flat
      >
        Add
      </Dropdown.Button>
      <Dropdown.Menu
        selectionMode="single"
        onSelectionChange={(keys) => {
          const first = Array.from(keys)[0];
          addModule(first as string, first as EffectType);
        }}
        aria-label="Static Actions"
      >
        <Dropdown.Item key="Code">Code</Dropdown.Item>
        <Dropdown.Item key="Logger">Logger</Dropdown.Item>
        <Dropdown.Item key="Filter">Filter</Dropdown.Item>
        <Dropdown.Item key="Envelope">Envelope</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AddNewProcessor;
