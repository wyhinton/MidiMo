import { useEffect, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
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
import useKeyboardShortcut from "use-keyboard-shortcut";
SyntaxHighlighter.registerLanguage("javascript", js);
interface ExecFunc {
  func: Function;
}

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

const InterfacePopup = (): JSX.Element => {
  return (
    <div style={{ width: 200, height: 100 }}>
      {/* <SyntaxHighlighter language="javascript"> */}
            
      {`export interface MidiData {
  data: number[];
  deviceName: string;
  eventType: MessageType;
  blocked?: boolean;
  eventTime?: Date;
}`}
          
      {/* </SyntaxHighlighter> */}
    </div>
  );
};

const VarList = ({ onVarClick }: VarListProps): JSX.Element => {
  // const vars = ["Message Type", "Channel", "Source Name", "Time Created"];

  return (
    <Grid.Container gap={2} justify={"space-evenly"}>
      {vars.map((v, i) => {
        return (
          <Grid key={i}>
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

  const [inputFunc, setInputFunc] = useState<string>(
    (moduleData.data as CodeModuleData).codeText
  );
  const [funcStatus, setFuncStatus] = useState<string>("no function");
  const [funcToExec, setFuncToExec] = useState<ExecFunc | undefined>();
  const [fontSize, setFontSize] = useState(14);
  useKeyboardShortcut(
    ["Shift", "+"],
    (shortcutKeys) => setFontSize(fontSize + 2),
    {
      overrideSystem: true,
      ignoreInputFields: false,
    }
  );
  useKeyboardShortcut(
    ["Shift", "-"],
    (shortcutKeys) => setFontSize(fontSize - 2),
    {
      overrideSystem: true,
      ignoreInputFields: false,
    }
  );

  useEffect(() => {
    try {
      let func = new Function("data", inputFunc);
      // console.log(func);
      setFuncToExec({ func: func });
      try {
      } catch (e: any) {
        setFuncStatus(e.message);
      }
      setFuncStatus("good");
    } catch (e: any) {
      setFuncStatus(e.message);
    }
  }, [inputFunc, funcStatus]);

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
      {/* <VarList
        onVarClick={(v) => {
          // console.log(v);
        }}
      /> */}
      {/* {`
        export interface MidiData {
          data: number[];
          deviceName: string;
          eventType: MessageType;
          blocked?: boolean;
          eventTime?: Date;
        }`} */}
      {/* <span>inputs:</span>
        <code>data</code>
        {`inputs: data`}
        {`MUST return data object`} */}
      <code
        style={{
          borderBottom: "1px solid white",
          width: "100%",
          textAlign: "left",
          display: "flex",
        }}
      >
        function(data: <Tooltip content={<InterfacePopup />}>MidiData</Tooltip>
        ): MidiData
      </code>
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
            fontSize={fontSize}
            showPrintMargin={true}
            // showPrintMargin={true}
            // showGutter={false}
            showGutter={true}
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
