import React, { useState, useEffect, useRef } from "react";
import ScrollArea from "react-scrollbar";
import { Button, Table } from "@nextui-org/react";
import { MidiData, ModuleData } from "./store";
import { MessageType, ModuleProps } from "./types";
import { useStore } from "./store";
import useMidiChain from "./UseMidiChain";

const maxLogLength = 25;

function Logger({ moduleData, index }: ModuleProps) {
  const [logs, setLogs] = useState<MidiData[]>([]);
  const { moduleInputMidi } = useMidiChain(index);
  // console.log(moduleInputMidi);
  useEffect(() => {
    // console.log("UPDATING LOGER");
    // console.log(moduleInputMidi);
    if (moduleInputMidi && !moduleInputMidi.blocked) {
      setLogs(prevLogs => {
        let newLogArr = [...prevLogs, moduleInputMidi];
        if (newLogArr.length > maxLogLength) {
          newLogArr = newLogArr.slice(
            newLogArr.length - maxLogLength,
            newLogArr.length
          );
        }
        return newLogArr;
      });
      // console.log(moduleInputMidi);
      // let newLogArr = [...logs, moduleInputMidi];
      // if (newLogArr.length > maxLogLength) {
      //   newLogArr = newLogArr.slice(
      //     newLogArr.length - maxLogLength,
      //     newLogArr.length
      //   );
      // }
      // setLogs(newLogArr);
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
        {/* {logs.map((l, i)=>{
          return <div key={i}>{l.deviceName}</div>
        })} */}
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
              <Table.Column css={{ backgroundColor: "black", fontSize:"$md" }}>
                Data
              </Table.Column>
              <Table.Column css={{ backgroundColor: "black", fontSize:"$md"  }}>
                Device
              </Table.Column>
              <Table.Column css={{ backgroundColor: "black", fontSize:"$md"  }}>
                Event
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {logs.map((log: MidiData, index: number) => {
                return (
                  <Table.Row
                    css={{
                      padding: "$xs",
                      backgroundColor: index % 2 === 0 ? "#1f2224" : "",
                      textAlign: "left",
                    }}
                    key={index}
                  >
                    <Table.Cell css={{  }}>
                      {log.data[2]?`${log.data[0]}, ${log.data[1]}, ${log.data[2]}`:`${log.data[0]}, ${log.data[1]}`}
                    </Table.Cell>
                    <Table.Cell>
                      {log.deviceName}
                    </Table.Cell>
                    <Table.Cell>
                      {log.eventType}
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
