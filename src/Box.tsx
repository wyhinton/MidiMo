import { styled } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";

let Base = styled("div", {
  w: "100%",
  h: "fit-content",
  p: "$xs $xs",
  fs: "$lg",
  bg: "$accents4",
  br: "$base",
  boxShadow: "$sm",
});

interface BoxProps {
  children: JSX.Element | JSX.Element[];
}

const Box = ({ children }: BoxProps): JSX.Element => {
  return (
    <Base css={{ dflex: "center", gap: "$xs", flexFlow: "column  nowrap" }}>
      {children}
    </Base>
  );
};

export default Box;
