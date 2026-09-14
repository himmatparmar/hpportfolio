function nextId(items) {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

function move(items, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export default function ListEditor({ items, onChange, fields, emptyItem }) {
  const updateField = (index, key, value) => {
    const copy = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(copy);
  };

  const addItem = () => {
    onChange([...items, { id: nextId(items), ...emptyItem }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="list-editor">
      {items.map((item, index) => (
        <div className="list-item" key={item.id}>
          <div className="list-item-header">
            <span>#{index + 1}</span>
            <div className="list-item-actions">
              <button type="button" onClick={() => onChange(move(items, index, -1))} disabled={index === 0}>↑</button>
              <button type="button" onClick={() => onChange(move(items, index, 1))} disabled={index === items.length - 1}>↓</button>
              <button type="button" className="danger" onClick={() => removeItem(index)}>Delete</button>
            </div>
          </div>
          {fields.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  value={item[field.key] ?? ''}
                  onChange={(e) => updateField(index, field.key, e.target.value)}
                  rows={field.rows || 3}
                />
              ) : (
                <input
                  type="text"
                  value={item[field.key] ?? ''}
                  onChange={(e) => updateField(index, field.key, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>+ Add item</button>
    </div>
  );
}
