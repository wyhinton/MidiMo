import React, { useState, useEffect, useRef} from "react";
import GlobalVars from "./GlobalVars";

const BottomToolbar = (): JSX.Element =>{
  return(
    <div className="w-100 position-absolute top-100"
    style={{height: "fit-content", transform: "translate(0, -100%)"}}
    >
    </div>
  )
}

export default BottomToolbar
