import { Container, Text } from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";

const DragPopup = (): JSX.Element => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,.5)",
        backdropFilter: "blur(3px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container css={{}}>
        <Text h4>Drop Configuration File Here</Text>
      </Container>
    </div>
  );
};

export default DragPopup;
