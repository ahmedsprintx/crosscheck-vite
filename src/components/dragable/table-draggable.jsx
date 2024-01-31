/* eslint-disable no-comments/disallowComments */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import style from './style.module.scss';

export const DraggableComponent = ({
  listElements = [],
  isDragDisabled = true,
  droppableStyles = {},
  draggableStyles = {},
  droppableClassName = '',
  selectedItemClass = '',
  draggableClassName = '',
  droppableDraggingStyle = {},
  draggableDraggingStyle = {},
  separateDraggingElement = false,
  renderContent,
  onDragUpdate,
  onDragStart,
  selectedItem,
  onDragEnd: _onDragEnd,
  onBeforeCapture,
  onBeforeDragStart,
}) => {
  const [items, setItems] = useState(listElements || []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedItems = reorder(items, result.source.index, result.destination.index);

    _onDragEnd && _onDragEnd(result);
    setItems(updatedItems);
  };

  const getListStyle = (isDraggingOver) => ({
    ...droppableStyles,

    ...(isDraggingOver && droppableDraggingStyle && droppableDraggingStyle),
  });

  const getItemStyle = (isDragging, providerStyles) => ({
    ...draggableStyles,

    ...providerStyles,

    ...(isDragging && draggableDraggingStyle),
  });

  useEffect(() => {
    if (listElements?.length) {
      setItems(listElements);
    }
  }, [listElements]);

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <tbody
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className={droppableClassName}
          >
            {items.map((item, index, all) => (
              <Draggable
                key={item._id}
                draggableId={item._id}
                index={index}
                isDragDisabled={isDragDisabled} // NOTE: Disable dragging if icon is being dragged
              >
                {(provided, snapshot) => {
                  const conditionalClass = useMemo(
                    () => (selectedItem?.includes(item?._id) ? selectedItemClass : ''),
                    [selectedItem, item?._id],
                  );
                  return (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(!separateDraggingElement ? provided.dragHandleProps : {})}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      className={`${style.relativeClass} ${draggableClassName} ${conditionalClass}`}
                    >
                      {renderContent && renderContent(item, index, all, provided)}
                    </tr>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableComponent;
