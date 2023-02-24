import {
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Input,
} from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import useStore, { GlobalVar } from "./store";

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
  console.log(window);
};

const GlobalVars = (): JSX.Element => {
  const { globals, addGlobal } = useStore();

  useEffect(() => {
    console.log(globals);
    for (let i = 0; i < globals.length; i++) {
      const gv = globals[i];
      updateGlobalVar(gv);
    }
  }, [globals]);
  return (
    <Card>
      <Container>
        <Collapse
          id={"global-vars-collapse"}
          css={{ borderRadius: "0px", textAlign: "center" }}
          title={"Global Variables"}
        >
          <Grid.Container gap={2}>
            {globals.map((g, i) => {
              return (
                <Grid key={i} xs={12} justify="space-around">
                  <div>
                    <span style={{ fontFamily: "monospace", color: "#0072F5" }}>
                      window.midi.
                    </span>
                    <Input underlined initialValue={g.name} />
                  </div>
                  <Input bordered initialValue={g.value.toString()} />
                </Grid>
              );
            })}
            <Grid xs={12} justify="space-around">
              <Button
                onClick={(e) => {
                  addGlobal({
                    name: `global${globals.length}`,
                    value: `global${globals.length}`,
                  });
                  // console.log(e);
                }}
              >
                Add New Variable
              </Button>
            </Grid>
          </Grid.Container>
        </Collapse>
      </Container>
    </Card>
  );
};

export default GlobalVars;
