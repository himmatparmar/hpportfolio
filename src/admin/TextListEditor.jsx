import { useDragReorder } from './useDragReorder';

function move(items, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export default function TextListEditor({ items, onChange, itemLabel = 'Paragraph', addLabel = 'Add paragraph', rows = 4 }) {
  const { dragHandleProps, containerProps } = useDragReorder(items, onChange);

  const updateItem = (index, value) => {
    onChange(items.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div className="text-list-editor">
      {items.map((text, index) => {
        const { isDragOver, ...dragEvents } = containerProps(index);
        return (
          <div className={`list-item${isDragOver ? ' drag-over' : ''}`} key={index} {...dragEvents}>
            <div className="list-item-header">
              <span className="drag-handle" {...dragHandleProps(index)} title="Drag to reorder">
                <i className="fa-solid fa-grip-vertical" /> {itemLabel} {index + 1}
              </span>
              <div className="list-item-actions">
                <button type="button" onClick={() => onChange(move(items, index, -1))} disabled={index === 0} title="Move up"><i className="fa-solid fa-chevron-up" /></button>
                <button type="button" onClick={() => onChange(move(items, index, 1))} disabled={index === items.length - 1} title="Move down"><i className="fa-solid fa-chevron-down" /></button>
                <button type="button" className="danger" onClick={() => onChange(items.filter((_, i) => i !== index))}><i className="fa-solid fa-trash" /> Delete</button>
              </div>
            </div>
            {rows === 1 ? (
              <input type="text" value={text} onChange={(e) => updateItem(index, e.target.value)} />
            ) : (
              <textarea rows={rows} value={text} onChange={(e) => updateItem(index, e.target.value)} />
            )}
          </div>
        );
      })}
      <button type="button" className="add-btn" onClick={() => onChange([...items, ''])}><i className="fa-solid fa-plus" /> {addLabel}</button>
    </div>
  );
}
