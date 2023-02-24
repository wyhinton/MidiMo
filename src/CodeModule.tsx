import { useEffect, useState } from "react";

import { useMap, MapOrEntries } from "usehooks-ts";
import "./App.css";
import AceEditor from "react-ace";
import {
  Grid,
  Text,
  Badge,
  Container,
  Tooltip,
  Button,
  Card,
} from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright.js";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import { ModuleProps } from "./types";
import { FuncCarrier, MidiData, MidiProcessor, useStore } from "./store";

type VarMap = Omit<Map<string, any>, "set" | "clear" | "delete">;

interface ExecFunc {
  func: Function;
}

const defaultVars: MapOrEntries<string, any> = [
  ["test1", '"first"'],
  ["test2", '"second"'],
];

const makeDefaultFunc = (vm: VarMap): string => {
  const invars = Array.from(vm)
    .map((v) => v[0])
    .join(",");
  return `
    data.data[0] += 10
    return data
`;
};

interface VarButtonData {
  label: string;
  color: string;
  tooltip: string;
  dataType: string;
}

interface VarListProps {
  onVarClick: (data: VarButtonData) => void;
}

const vars = [
  {
    label: "eventType",
    color: "white",
    tooltip:
      "The type of Midi Message. I.e. Options include Note On, Note Off, Pitch Bend, CC",
    dataType: "string",
  },
  {
    label: "channel",
    color: "white",
    tooltip: "Number of the Midi Channel the message was sent over",
    dataType: "int",
  },
  {
    label: "deviceName",
    color: "white",
    tooltip: "The device name which created the message",
    dataType: "string",
  },
  {
    label: "timeCreated",
    color: "white",
    tooltip: "does something",
    dataType: "Date",
  },
  {
    label: "data",
    color: "white",
    tooltip: "does something",
    dataType: "number[]",
  },
  {
    label: "velocity",
    color: "white",
    tooltip: "does something",
    dataType: "number",
  },
];

const VarList = ({ onVarClick }: VarListProps): JSX.Element => {
  // const vars = ["Message Type", "Channel", "Source Name", "Time Created"];

  return (
    <Grid.Container gap={2} justify={"space-evenly"}>
      {vars.map((v) => {
        return (
          <Grid>
            <Tooltip content={v.tooltip}>
              <Button
                onClick={(e) => {
                  // console.log(e);
                  onVarClick(v);
                }}
                css={{ fontFamily: "monospace" }}
                bordered
                size={"xs"}
              >
                {v.label}
              </Button>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid.Container>
  );
};

interface CodeModuleData {
  codeText: string;
}

function CodeModule({ moduleData, midiData, index }: ModuleProps) {
  const onChange = (value: string, event: any) => {
    setInputFunc(value);
  };

  const { setProcessor, setModuleData } = useStore();

  const [map] = useMap<string, string>(defaultVars);
  const [inputFunc, setInputFunc] = useState<string>(
    (moduleData.data as CodeModuleData).codeText
  );
  const [funcStatus, setFuncStatus] = useState<string>("no function");
  const [funcToExec, setFuncToExec] = useState<ExecFunc | undefined>();

  useEffect(() => {
    try {
      let func = new Function("data", inputFunc);
      // console.log(func);
      setFuncToExec({ func: func });
      try {
        // setOutput(JSON.stringify(test));
      } catch (e: any) {
        setFuncStatus(e.message);
      }
      setFuncStatus("good");
    } catch (e: any) {
      setFuncStatus(e.message);
    }
  }, [inputFunc, map, funcStatus]);

  useEffect(() => {
    try {
      // const duplicate = JSON.parse(JSON.stringify(midiData));
      // setOutput(funcToExec?.func(duplicate));
    } catch (e: any) {
      setFuncStatus(e.message);
    }
  }, [funcToExec, midiData]);

  useEffect(() => {
    console.log(funcToExec);
    if (funcToExec) {
      setProcessor(moduleData.id, funcToExec as FuncCarrier);
    }
  }, [funcToExec]);

  return (
    <Grid.Container gap={2} justify="center">
      {/* <Text b>{funcStatus}</Text>
      <Text>{JSON.stringify(midiData)}</Text>
      <br></br>
      <Text>Output</Text>
      <Text>{JSON.stringify(funcOutput)}</Text> */}
      <VarList
        onVarClick={(v) => {
          // console.log(v);
        }}
      />
      <Card>
        {moduleData.active && (
          <AceEditor
            placeholder="Placeholder Text"
            mode="javascript"
            theme="tomorrow_night_bright"
            name="blah2"
            onChange={(val, e) => {
              onChange(val, e);
              setModuleData(moduleData.id, { codeText: val } as CodeModuleData);
              console.log(val);
            }}
            fontSize={14}
            showPrintMargin={true}
            // showPrintMargin={true}
            showGutter={false}
            // showGutter={true}
            highlightActiveLine={true}
            value={inputFunc}
            height={"200px"}
            width={"100%"}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        )}
      </Card>
    </Grid.Container>
  );
}

export default CodeModule;
