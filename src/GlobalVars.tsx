import { Button, Grid } from "@nextui-org/react";
import { useState } from "react";
import useStore, { GlobalVar } from "./store";
import _ from "lodash";
import { useContextMenu } from "react-contexify";
import { brightColor } from "./theme";
import GlobalVarItem from "./GlobalVarItem";
import { FcGlobe } from "react-icons/fc";
import MidiMapping from "./MidiMapping";
import Debugger from "./Debugger";
const MENU_ID = "GLOBAL_VARS";
const GlobalVars = (): JSX.Element => {
  const { globals, addGlobal, showMidiMap } = useStore();
  const [selectedGlobal, setSelectedGlobal] = useState<GlobalVar | undefined>(
    undefined
  );

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

  return (
    <>
      <div className="h-50">
        <div
          className="d-flex align-items-center"
          style={{ backgroundColor: brightColor, padding: 10, height: 60 }}
        >
          Globals
          <FcGlobe />
        </div>
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(50vh - 60px)" }}
        >
          {globals.map((g, i) => {
            return (
              <GlobalVarItem
                key={i}
                globalVar={g}
                selected={selectedGlobal?.id === g.id}
                onContextMenu={handleContextMenu}
              />
            );
          })}
          <Grid xs={12} justify="space-around">
            <Button
              onClick={() => {
                addGlobal({
                  name: `global${globals.length}`,
                  value: `global${globals.length}`,
                  defaultValue: `global${globals.length}`,
                  id: globals.length,
                });
                // console.log(e);
              }}
              className="w-100 rounded-0"
            >
              Add New Variable
            </Button>
          </Grid>
        </div>
      </div>
      <div className="h-50">
        {!showMidiMap && <Debugger />}
        <MidiMapping />
      </div>
    </>
  );
};

export default GlobalVars;
