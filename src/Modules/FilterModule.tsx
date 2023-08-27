import {
  Card,
  Checkbox,
  Container,
  Grid,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { midiMessageTypes, ModuleProps } from "../types";
import { MidiData, useStore } from "../store";
import { toTitleCase } from "../utils";
import { FilterModuleData } from "./ModuleDefaults";

const FilterModule = ({ moduleData, midiData }: ModuleProps): JSX.Element => {
  const { setModuleData, setProcessor } = useStore();
  const [filterModuleData, setfilterModuleData] = useState<FilterModuleData>(
    moduleData.data as FilterModuleData
  );
  // console.log(moduleData);

  useEffect(() => {
    setModuleData(moduleData.id, filterModuleData);
    const messageTypesToFilter = Object.entries(filterModuleData)
      .filter((pair) => {
        return pair[1];
      })
      .map((p) => p[0]);
    // console.log(messageTypesToFilter);
    // console.log(messageTypesToFilter);
    const filterFunc = (midiData: MidiData) => {
      for (let i = 0; i < messageTypesToFilter.length; i++) {
        const mt = messageTypesToFilter[i];
        if (midiData.eventType.includes(mt)) {
          midiData.blocked = true;
          // console.log(`Blocked type ${mt}`);
        }
      }
      return midiData;
    };
    setProcessor(moduleData.id, { func: filterFunc });

    // const checkBoxStatuses = Object.entries(filterModuleData);
    // for (let i = 0; i < checkBoxStatuses.length; i++) {
    //   const element = checkBoxStatuses[i];
    //   console.log(element);
    // }
  }, [filterModuleData]);

  //   console.log(moduleData.data);
  return (
    <div className="d-flex flex-column p-3">
      <div>Checked items will be filtered</div>
      <div className="p-3 col-xl-7 m-auto d-flex justify-content-center">
        <Row gap={1}>
          <Card css={{ backgroundColor: "black" }}>
            <Grid.Container alignItems="center">
              {moduleData.expanded &&
                midiMessageTypes.map((m, i) => {
                  return (
                    <Grid xs={2} key={i}>
                      <Checkbox
                        disableAnimation
                        value={m}
                        isSelected={moduleData.data[m]}
                        onChange={(checked) => {
                          // console.log(m, checked);
                          let toChange = { ...filterModuleData };
                          toChange[m] = checked;
                          setfilterModuleData(toChange);
                        }}
                      ></Checkbox>
                      <Spacer x={0.5}></Spacer>
                      <Text css={{ marginBottom: 0 }}>{toTitleCase(m)}</Text>
                    </Grid>
                  );
                })}
            </Grid.Container>
          </Card>
        </Row>
      </div>
    </div>
  );
};

export default FilterModule;
