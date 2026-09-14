import { useRef, useState } from 'react';

// Native HTML5 drag-and-drop reordering for a list. Pass items+onChange,
// spread dragHandleProps(index) onto a grip element and containerProps(index)
// onto that item's wrapper.
//
// dragIndex is a ref, not state: dragover/drop can fire before a state
// update from dragstart has re-rendered and rebound the handlers, so a
// state-based dragIndex reads as stale null and silently no-ops the drop.
// A ref is read fresh every time regardless of render timing.
export function useDragReorder(items, onChange) {
  const dragIndexRef = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  const dragHandleProps = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragEnd: () => {
      dragIndexRef.current = null;
      setOverIndex(null);
    },
  });

  const containerProps = (index) => ({
    onDragOver: (e) => {
      if (dragIndexRef.current === null) return;
      e.preventDefault();
      if (index !== overIndex) setOverIndex(index);
    },
    onDrop: (e) => {
      e.preventDefault();
      const dragIndex = dragIndexRef.current;
      if (dragIndex === null || dragIndex === index) return;
      const copy = [...items];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, moved);
      onChange(copy);
      dragIndexRef.current = null;
      setOverIndex(null);
    },
    isDragOver: index === overIndex && index !== dragIndexRef.current,
  });

  return { dragHandleProps, containerProps };
}
