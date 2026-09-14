import { uploadImage } from './api';

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

export default function ImageListEditor({ items, onChange }) {
  const updateField = (index, key, value) => {
    const copy = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(copy);
  };

  const handleUpload = async (index, file) => {
    if (!file) return;
    try {
      const { path } = await uploadImage(file);
      updateField(index, 'image', path);
    } catch (err) {
      alert(err.message);
    }
  };

  const addItem = () => {
    onChange([...items, { id: nextId(items), name: '', image: '' }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="image-list-editor">
      {items.map((item, index) => (
        <div className="image-item" key={item.id}>
          {item.image && <img src={item.image} alt={item.name} className="image-preview" />}
          <div className="image-item-fields">
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                value={item.name ?? ''}
                onChange={(e) => updateField(index, 'name', e.target.value)}
              />
            </label>
            <label className="field">
              <span>Replace image</span>
              <input type="file" accept="image/*" onChange={(e) => handleUpload(index, e.target.files[0])} />
            </label>
          </div>
          <div className="list-item-actions">
            <button type="button" onClick={() => onChange(move(items, index, -1))} disabled={index === 0}>↑</button>
            <button type="button" onClick={() => onChange(move(items, index, 1))} disabled={index === items.length - 1}>↓</button>
            <button type="button" className="danger" onClick={() => removeItem(index)}>Delete</button>
          </div>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addItem}>+ Add item</button>
    </div>
  );
}
