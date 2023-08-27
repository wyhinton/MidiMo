import {
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Input,
  Table,
  Text,
} from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import useStore, { GlobalVar, ModuleData } from "./store";
import _ from "lodash";
import { TableBody } from "@nextui-org/react/types/table/base";
import Portal from "./Portal";
import { Item, ItemParams, Menu, useContextMenu } from "react-contexify";
import { useOnClickOutside } from "usehooks-ts";
import { brightColor } from "./theme";

const updateGlobalVar = (v: GlobalVar) => {
  let w = window as any;
  if (!w.midi) {
    w.midi = {};
  }
  if (!w.midi[v.name]) {
    w[v.name] = v.value;
  }
  if (w.midi[v.name] !== v.value) {
    w.midi[v.name] = v.value;
  }
};
const MENU_ID = "GLOBAL_VARS";
const GlobalVars = (): JSX.Element => {
  const { globals, addGlobal, deleteGlobal } = useStore();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedGlobal, setSelectedGlobal] = useState<GlobalVar | undefined>(
    undefined
  );

  const [expanded, setExpanded] = useState(false);
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleContextMenu(event: any, globalVar: GlobalVar) {
    console.log("got context mneu");
    let menudiv = document.querySelector("#menuportal") as HTMLDivElement;
    menudiv.style.left = `${event.clientX}px`;
    menudiv.style.top = `${event.clientY}px`;
    menudiv.style.display = "block";
    console.log(globalVar);
    setSelectedGlobal(globalVar);
    show({
      event,
      props: {
        key: "value",
      },
    });
  }

  // const trackVisibility = (isVisible: boolean) => {
  //   console.log("Menu is", isVisible);
  // };

  const ref = useRef(null);
  // useOnClickOutside(ref, handleClickOutside);

  const handleClickOutside = () => {
    let menudiv = document.querySelector("#menuportal") as HTMLDivElement;
    menudiv.style.display = "none";
    setContextMenuVisible(false);
    // console.log("clicked outside");
  };

  const handleItemClick = ({ id, event, props }: ItemParams) => {
    console.log(id);
    if (id === "delete") {
      console.log("got delete");
      if (selectedGlobal) {
        console.log("deleting", selectedGlobal);
        deleteGlobal(selectedGlobal.id);
      }
    }
  };

  // useEffect(() => {
  //   // console.log(globals);
  //   for (let i = 0; i < globals.length; i++) {
  //     const gv = globals[i];
  //     updateGlobalVar(gv);
  //   }
  // }, []);
  return (
    <div style={{backgroundColor: brightColor}}>
      {/* <Portal visible={contextMenuVisible} divId="#menuportal">
        <Card ref={ref} css={{ pointerEvents: "all", height: "100%" }}>
          <Menu id={MENU_ID}>
            <div
              className="menu-item-container"
              onClick={(e) => {
                console.log(e);
              }}
            >
              <Item id="delete-global" onClick={handleItemClick}>
                <Text color="error">Delete Global</Text>
              </Item>
            </div>
            <div className="menu-item-container">
              <Item id="Map Block" onClick={handleItemClick}>
                <Text>item 2</Text>
              </Item>
            </div>
          </Menu>
        </Card>
      </Portal> */}
      <Container css={{ width: "100%" }}>
        <Collapse
          onChange={(e, i, v) => {
            console.log(v);
            if (v) {
              setExpanded(v);
            }
          }}
          bordered={false}
          id={"global-vars-collapse"}
          css={{ borderRadius: "0px", textAlign: "center" }}
          title={"Global Variables"}
        >
          {expanded && (
            <Table width={"100%"} css={{ padding: "0" }}>
              <Table.Header>
                <Table.Column>Name</Table.Column>
                <Table.Column>Value</Table.Column>
                <Table.Column>Default Value</Table.Column>
                <Table.Column>Delete</Table.Column>
              </Table.Header>
              <Table.Body>
                {globals.map((g, i) => {
                  return (
                    <Table.Row
                      css={{
                        textAlign: "left",
                        border:
                          g.id === selectedGlobal?.id ? "1px solid white" : "",
                          
                      }}
                    >
                      <Table.Cell>
                        <div onContextMenu={(e) => handleContextMenu(e, g)}>
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: "#0072F5",
                            }}
                          >
                            window.midi.
                          </span>
                          <Input
                            // onChange={(e) => {
                            //   console.log(e);
                            //   console.log(e.target.value);
                            // }}
                            underlined
                            initialValue={g.name}
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div>{_.toString(g.value)}</div>
                      </Table.Cell>
                      <Table.Cell>
                        <Input bordered initialValue={g.value?g.value.toString():""} />
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          onClick={(e) => {
                            deleteGlobal(g.id);
                            //@ts-ignore
                            delete window.midi[g.name];
                          }}
                          bordered
                          auto
                          icon={<i className={"fa fa-trash"}></i>}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}

          <Grid xs={12} justify="space-around">
            <Button
              onClick={(e) => {
                addGlobal({
                  name: `global${globals.length}`,
                  value: `global${globals.length}`,
                  defaultValue: `global${globals.length}`,
                  id: globals.length,
                });
                // console.log(e);
              }}
            >
              Add New Variable
            </Button>
          </Grid>
        </Collapse>
      </Container>
    </div>
  );
};

export default GlobalVars;
