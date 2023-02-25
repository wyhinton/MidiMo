import React, { useState, useEffect, useRef } from "react";
import ScrollArea from "react-scrollbar";
import { Button, Table } from "@nextui-org/react";
import { MidiData, ModuleData } from "./store";
import { MessageType, ModuleProps } from "./types";
import { useStore } from "./store";
import useMidiChain from "./UseMidiChain";
import { getNoteEnglishName, isNote } from "./utils";
import _ from "lodash";
const maxLogLength = 50;
function Logger({ moduleData, index }: ModuleProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const { moduleInputMidi } = useMidiChain(index);
  // console.log(moduleInputMidi);
  useEffect(() => {
    // console.log("UPDATING LOGER");
    // console.log(moduleInputMidi);
    if (moduleInputMidi && !moduleInputMidi.blocked) {
      // console.log(moduleInputMidi);
      let noteName = "";
      if (isNote(moduleInputMidi.data)) {
        let nameToLookup = getNoteEnglishName(moduleInputMidi.data);
        if (nameToLookup) {
          noteName = nameToLookup;
        }
      }
      let newLogArr = [...logs, { ...moduleInputMidi, noteName } as any];
      if (newLogArr.length > maxLogLength) {
        newLogArr = newLogArr.slice(
          newLogArr.length - maxLogLength,
          newLogArr.length
        );
      }
      setLogs(newLogArr);
    }
  }, [JSON.stringify(moduleInputMidi)]);

  return (
    <div>
      <Button
        icon={<i className="fa fa-trash"></i>}
        size={"xs"}
        // bordered
        animated={false}
        color="error"
        flat
        css={{
          width: "100%",
          borderRadius: 0,
        }}
        onClick={(e) => {
          setLogs([]);
        }}
      >
        Clear
      </Button>
      <ScrollArea
        speed={0.8}
        className="logger-scroll"
        contentClassName="content"
        horizontal={false}
      >
        {moduleData.expanded && (
          <Table
            aria-label="Example table with static content"
            striped
            css={{
              height: "auto",
              minWidth: "100%",
              padding: 0,
              minHeight: "200px",
              borderRadius: 0,
            }}
          >
            <Table.Header>
              <Table.Column css={{ backgroundColor: "black" }}>
                Data
              </Table.Column>
              <Table.Column css={{ backgroundColor: "black" }}>
                Event
              </Table.Column>
              <Table.Column css={{ backgroundColor: "black" }}>
                Info
              </Table.Column>
              <Table.Column css={{ backgroundColor: "black" }}>
                Device
              </Table.Column>
              {/* <Table.Column></Table.Column> */}
              {/* <Table.Column>STATUS</Table.Column> */}
            </Table.Header>
            <Table.Body>
              {logs.map((log: any, index: number) => {
                // const dateString =
                // log.eventTime.getHours() +
                // ":" +
                // log.time.getMinutes() +
                // ":" +
                // log.time.getSeconds();
                return (
                  <Table.Row
                    css={{
                      padding: "$xs",
                      backgroundColor: index % 2 === 0 ? "#1f2224" : "",

                      textAlign: "left",
                    }}
                    key={index}
                  >
                    <Table.Cell css={{ fontSize: "$xs" }}>
                      {_.toString(log.data)}
                    </Table.Cell>
                    <Table.Cell css={{ fontSize: "$xs" }}>
                      {log.eventType}
                    </Table.Cell>
                    <Table.Cell css={{ fontSize: "$xs" }}>
                      {log.noteName}
                    </Table.Cell>
                    <Table.Cell css={{ fontSize: "$xs" }}>
                      {log.deviceName}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
}

export default Logger;
