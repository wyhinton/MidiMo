import React, { useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import useStore, { MidiData, ModuleData } from "./store";
import CodeModule from "./Modules/CodeModule";
import { Collapse, Radio, Text, Card, Container } from "@nextui-org/react";
import ToggleButton from "./ToggleButton";
import Logger from "./Logger";
import CustomCollapse from "./CollapseCustom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import FilterModule from "./Modules/FilterModule";
import { Item, ItemParams, Menu, useContextMenu } from "react-contexify";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "usehooks-ts";
import Portal from "./Portal";
import EnvelopeModule from "./Modules/Envelope";

const getModule = {
  Code: (
    moduleData: ModuleData,
    midiData: MidiData | undefined,
    index: number
  ) => <CodeModule moduleData={moduleData} midiData={midiData} index={index} />,
  Logger: (
    moduleData: ModuleData,
    midiData: MidiData | undefined,
    index: number
  ) => <Logger moduleData={moduleData} midiData={midiData} index={index} />,
  Filter: (
    moduleData: ModuleData,
    midiData: MidiData | undefined,
    index: number
  ) => (
    <FilterModule moduleData={moduleData} midiData={midiData} index={index} />
  ),
  Envelope: (
    moduleData: ModuleData,
    midiData: MidiData | undefined,
    index: number
  ) => (
    <EnvelopeModule moduleData={moduleData} midiData={midiData} index={index} />
  )
};
interface DragSectionProps {
  midiData: MidiData | undefined;
}

const DragSection = ({ midiData }: DragSectionProps): JSX.Element => {
  const { modules, toggleCompletedState, toggleExpanded, deleteModule } =
    useStore();
  const MENU_ID = "blahblah";
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const [selectedModule, setSelectedModule] = useState<ModuleData | undefined>(
    undefined
  );
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  function handleContextMenu(event: any, moduleData: ModuleData) {
    let menudiv = document.querySelector("#menuportal") as HTMLDivElement;
    menudiv.style.left = `${event.clientX}px`;
    menudiv.style.top = `${event.clientY}px`;
    menudiv.style.display = "block";
    setSelectedModule(moduleData);
    show({
      event,
      props: {
        key: "value",
      },
    });
  }

  const handleItemClick = ({ id, event, props }: ItemParams) => {
    if (id === "delete") {
      if (selectedModule) {
        deleteModule(selectedModule?.id);
      }
    }
  };
  const trackVisibility = (isVisible: boolean) => {
    console.log("Menu is", isVisible);
  };

  const handleClickOutside = () => {
    let menudiv = document.querySelector("#menuportal") as HTMLDivElement;
    menudiv.style.display = "none";
    setContextMenuVisible(false);
    // console.log("clicked outside");
  };

  const ref = useRef(null);
  useOnClickOutside(ref, handleClickOutside);
  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <div className = {"w-100"}>
      <Portal visible={contextMenuVisible} divId="#menuportal">
        <Card ref={ref} css={{ pointerEvents: "all" }}>
          <Menu id={MENU_ID} onVisibilityChange={trackVisibility}>
            <div className="menu-item-container">
              <Item id="delete" onClick={handleItemClick}>
                <Text color="error">Delete</Text>
              </Item>
            </div>
            <div className="menu-item-container">
              <Item id="Map Block" onClick={handleItemClick}>
                <Text>item 2</Text>
              </Item>
            </div>
          </Menu>
        </Card>
      </Portal>

      <Collapse.Group css={{ padding: "$xs", width: "100%"}}>
        <Droppable droppableId="droppable">
          {(provided, snapshot): JSX.Element => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{width: "100%"}}
              // style={getListStyle(snapshot.isDraggingOver)}
            >
              {modules.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                >
                  {(provided, snapshot): JSX.Element => {
                    if (snapshot.isDragging) {
                      //@ts-ignore
                      provided.draggableProps.style = {
                        //@ts-ignore
                        ...provided.draggableProps.style,
                        //@ts-ignore
                        left: provided.draggableProps.style.offsetLeft,
                        //@ts-ignore
                        top: provided.draggableProps.style.offsetTop,
                      };
                    }
                    //@ts-ignore
                    // provided.draggableProps.style.padding = "10px";
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        // {...provided.dragHandleProps}
                        // style={getItemStyle(
                        //   snapshot.isDragging,
                        //   provided.draggableProps.style
                        // )}
                      >
                        <ErrorBoundary
                          FallbackComponent={ErrorFallback}
                          onReset={() => {
                            // reset the state of your app so the error doesn't happen again
                          }}
                        >
                          <Card
                            css={{
                              backgroundColor: "black",
                              // marginTop: 10,
                              border:
                                selectedModule?.id === module.id
                                  ? "1px solid white"
                                  : "",
                            }}
                            onContextMenu={(e) => handleContextMenu(e, module)}
                          >
                            <CustomCollapse
                              index={index}
                              module={module}
                              onClick={(e) => {
                                toggleExpanded(module.id);
                              }}
                              dragHandleProps={provided.dragHandleProps}
                              title={module.effectType}
                            >
                              <div>
                                {getModule[module.effectType](
                                  module,
                                  midiData,
                                  index
                                )}
                              </div>
                            </CustomCollapse>
                          </Card>
                        </ErrorBoundary>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Collapse.Group>
    </div>
  );
};

// Put the thing into the DOM!
export default DragSection;
