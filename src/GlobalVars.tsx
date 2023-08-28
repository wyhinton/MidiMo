import { Button, Grid } from "@nextui-org/react";
import { useState, useRef } from "react";
import useStore, { GlobalVar } from "./store";
import _ from "lodash";
import { ItemParams, useContextMenu } from "react-contexify";
import { brightColor } from "./theme";
import GlobalVarItem from "./GlobalVarItem";
import { FcGlobe } from "react-icons/fc";
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
    <div>
      <div
        className="h5 d-flex align-items-center"
        style={{ backgroundColor: brightColor, padding: 10, height: 60 }}
      >
        Globals
        <FcGlobe />
      </div>
      <div style={{maxHeight: "calc(100vh - 60px)"}}>
        {globals.map((g, i) => {
          return (
            <GlobalVarItem
              globalVar={g}
              selected={selectedGlobal?.id === g.id}
              onContextMenu={handleContextMenu}
            />
          );
        })}
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
            className="w-100 rounded-0"
          >
            Add New Variable
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default GlobalVars;
