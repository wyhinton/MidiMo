import { useEffect, useRef, useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import "../App.css";
import AceEditor from "react-ace";
import {
  Grid,
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
import "ace-builds/webpack-resolver";
import d, {Ace} from 'ace-builds';
import { ModuleProps } from "../types";
import {
  FuncCarrier,
  useStore,
} from "../store";
import useKeyboardShortcut from "use-keyboard-shortcut";
import Portal from "../Portal";
import { CodeModuleData } from "./ModuleDefaults";
import ace from "brace";
import snippet from "./codeSnippets";
import ReactAce from "react-ace/lib/ace";
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';
//@ts-ignore
ace.define("ace/snippets/json", ["require", "exports", "module"], (e, t, n) => {

  //@ts-ignore
    // eslint-disable-next-line
  (t.snippetText = snippet), (t.scope = "json");
});

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
  const [fontSize, setFontSize] = useState(18);
  const [fullScreen, setFullScreen] = useState(false);

  useKeyboardShortcut(
    ["Shift", "+"],
    (shortcutKeys) => setFontSize(fontSize + 2),
    {
      overrideSystem: true,
      ignoreInputFields: true,
    }
  );
  useKeyboardShortcut(
    ["Shift", "-"],
    (shortcutKeys) => setFontSize(fontSize - 2),
    {
      overrideSystem: true,
      ignoreInputFields: true,
    }
  );
  useKeyboardShortcut(["Escape"], (shortcutKeys) => setFullScreen(false), {
    // overrideSystem: true,
    ignoreInputFields: false,
  });


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
    // console.log(funcToExec);
    if (funcToExec) {
      setProcessor(moduleData.id, funcToExec as FuncCarrier);
    }
  }, [funcToExec]);

  useEffect(()=>{
    if (editorRef.current){
      const langTools = d.require('ace/ext/language_tools');
      console.log(langTools)
      // data stub:
      const sqlTables = [
          { name: 'users', description: 'Users in the system' },
          { name: 'userGroups', description: 'User groups to which users belong' },
          { name: 'customers', description: 'Customer entries' },
          { name: 'companies', description: 'Legal entities of customers' },
          { name: 'loginLog', description: 'Log entries for user log-ins' },
          { name: 'products', description: 'Products offered in the system' },
          { name: 'productCategories', description: 'Different product categories' },
      ];

      const sqlTablesCompleter = {
          getCompletions: (
              editor: Ace.Editor,
              session: Ace.EditSession,
              pos: Ace.Point,
              prefix: string,
              callback: Ace.CompleterCallback
          ): void => {
              callback(
                  null,
                  sqlTables.map((table) => {
                    console.log("here")
                    return {
                      caption: `${table.name}: ${table.description}`,
                      value: table.name,
                      meta: 'Table',
                  } as Ace.Completion
                })
              );
          },
      };
      langTools.addCompleter(sqlTablesCompleter);
      // console.log(editorRef.current)
      // console.log(editorRef.current.editor.getSession().getMode())
      // let mode = editorRef.current.editor.getSession().getMode();
      // //@ts-ignore
      // const func = (state, session, pos, prefix)=>{
      //   var completions: any[] = [];
                            
      //   ["example1", "example2"].forEach(function (w) {

      //       completions.push({
      //           value: w,
      //           meta: "my completion",
      //           snippet: `@{${w || ""}}`,
      //           caption: w || ""

      //       });
      //   });
      //   console.log("HERE")
      //   return completions;

      // }
      // mode.getCompletions = func;
      // editorRef.current.editor.getSession().setMode(mode)
      // console.log(editorRef)
    }
  },[])

  const sharedProps = {
    placeholder: "Placeholder Text",
    mode: "javascript",
    theme: "tomorrow_night_bright",
    name: "blah2",
    fontSize: fontSize,
    showPrintMargin: true,
    showGutter: true,
    highlightActiveLine: true,
    // value:{inputFunc},
    width: "100%",
    setOptions: {
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      showLineNumbers: true,
      useWorker: true,

      tabSize: 2,
    },
  };

  const editorRef = useRef<ReactAce>(null);

  return (
    <div style={{height: 500}}>
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

      <Portal animate={true} visible={fullScreen} divId="#fullScreenPortal">
        <Container
          xl
          css={{
            height: "100%",
            width: "100%",
            // backgroundColor: "red",
            backdropFilter: "blur(10px)",
          }}
          display="flex"
          justify="center"
          alignItems="center"
        >
          <Card
            css={{
              height: "90%",
              width: "80%",
              // backgroundColor: "red",
            }}
          >
            <Button
              bordered
              css={{ position: "absolute", zIndex: 100, top: 0, right: 10 }}
              onClick={(e) => {
                setFullScreen(!fullScreen);
              }}
              auto
              icon={<i className="fa fa-expand"></i>}
            ></Button>
            {moduleData.active && (
              <AceEditor
                placeholder="Placeholder Text"
                mode="javascript"
                theme="tomorrow_night_bright"
                name="blah2"
                onChange={(val, e) => {
                  // if (fullScreen) {
                  onChange(val, e);
                  setModuleData(moduleData.id, {
                    codeText: val,
                  } as CodeModuleData);
                  console.log(val);
                  // }
                }}
                onLoad={(editor)=>{
                  console.log("HELLO")
                  var mode = editor.getSession().getMode();
                  // mode.getCompletions = ()
                  //@ts-ignore
                  mode.getCompletions = (state, session, pos, prefix, callback) => {
                    console.log(state)
                      var completions: any[] = [];
                      ["example1", "example2"].forEach(function (w) {
                          completions.push({
                              value: w,
                              meta: "my completion",
                              snippet: `@{${w || ""}}`,
                              caption: w || ""
                          });
                      });
                      return completions;
                    
                  }

                  editor.getSession().setMode(mode);

                  console.log("EDITOR");
                  //@ts-ignore
                  console.log(editor.getSession().getMode().getCompletions());


                }}
                fontSize={fontSize}
                showPrintMargin={true}
                ref={editorRef}
                // showPrintMargin={true}
                // showGutter={false}
                showGutter={true}
                highlightActiveLine={true}
                value={inputFunc}
                height={"100%"}
                width={"100%"}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            )}
          </Card>
        </Container>
      </Portal>
      <Card className = 'h-100' css={{ position: "relative" }}>
        <Button
          bordered
          css={{ position: "absolute", zIndex: 100, top: 0, right: 10 }}
          onClick={(e) => {
            setFullScreen(!fullScreen);
          }}
          auto
          icon={<i className="fa fa-expand"></i>}
        ></Button>
        {moduleData.active && (
          <AceEditor
            {...sharedProps}
            ref={editorRef}
            onChange={(val, e) => {
              onChange(val, e);
              setModuleData(moduleData.id, { codeText: val } as CodeModuleData);
              // console.log(editorRef);
              // console.log(val);
            }}
            onValidate={(annotations) => {
              // console.log(annotations);
            }}
            value={inputFunc}
            height={"100%"}
          />
        )}
      </Card>
    </div>
  );
}

export default CodeModule;
