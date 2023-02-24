import { Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";
import Box from "./Box";

interface IDragabbleCardProps {
  toDo: string;
  index: number;
}

function DragabbleCard({ toDo, index }: IDragabbleCardProps) {
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic) => (
        <Box {...magic.draggableProps} {...magic.dragHandleProps}>
          <div ref={magic.innerRef}>{toDo}</div>
        </Box>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
