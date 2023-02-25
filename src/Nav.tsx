import { Button, Link, Navbar } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import useStore from "./store";

const downloadFile = (myData: any) => {
  const fileName = "my-file";
  const json = JSON.stringify(myData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);

  // create "a" HTLM element with href to file
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

const Nav = (): JSX.Element => {
  const [storeJSON, setStoreJSON] = useLocalStorage("midi-storage", undefined);
  const { clearMidiChain, clearGlobals } = useStore();

  return (
    <Navbar
      disableShadow
      variant={"sticky"}
      disableBlur
      css={{
        position: "absolute",
      }}
      containerCss={{
        // position: "absolute",
        background: "rgba(0,0,0,0)",
      }}
    >
      <Navbar.Content hideIn="xs">
        <Navbar.Link href="#">Features</Navbar.Link>
        <Navbar.Link isActive href="#">
          Midi Editor
        </Navbar.Link>
        <Navbar.Link
          isActive
          onMouseDown={(e) => {
            downloadFile(storeJSON);
          }}
          href="#"
        >
          Save Settings
        </Navbar.Link>
        {/* <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Company</Navbar.Link> */}
      </Navbar.Content>
      {/* <img src={process.env.PUBLIC_URL + "/logo_test.png"}></img> */}
      <Navbar.Content>
        <Navbar.Link color="inherit" href="#">
          Github
        </Navbar.Link>
        <Navbar.Link>About</Navbar.Link>
        <Navbar.Link
          onClick={(e) => {
            clearMidiChain();
            clearGlobals();
          }}
        >
          Clear
        </Navbar.Link>
      </Navbar.Content>
    </Navbar>
  );
};

export default Nav;
