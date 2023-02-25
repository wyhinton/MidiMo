import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ConditionalWrap from "conditional-wrap";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

interface PortalProps {
  children: JSX.Element;
  divId: string;
  visible: boolean;
  animate?: boolean;
}

function Portal({ children, divId, visible, animate }: PortalProps) {
  useEffect(() => {
    let portalDiv = document.querySelector(divId) as HTMLDivElement;
    console.log(visible);
    if (visible) {
      portalDiv.style.display = "block";
    } else {
      //   if (!animate) {
      portalDiv.style.display = "none";
      //   }
    }
  }, [divId, visible]);
  const divRef = useRef(document.querySelector(divId) as HTMLDivElement);
  const b = (
    <ConditionalWrap
      wrap={(children) => {
        return (
          <AnimatePresence>
            {visible && (
              <motion.div
                style={{ width: "100%", height: "100%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // ref={divRef}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        );
      }}
      children={children}
      condition={animate ?? false}
    ></ConditionalWrap>
  );
  return createPortal(b, document.querySelector(divId) as HTMLDivElement);
}

export default Portal;
