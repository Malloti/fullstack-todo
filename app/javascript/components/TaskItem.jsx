import React, {useCallback, useEffect, useState} from "react";
import Input from "./Input";

export default function TaskItem({ id, title, done, onChange, onDelete, errorMsg }) {
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleClickDelete = useCallback(() => onDelete(id), [id, onDelete]);
  const handleClickChangeTitle = useCallback(() => {
    const newValue = {
      id, title, done
    };
    if (isEditing) {
      newValue.title = newTitle;
    }

    onChange(id, newValue);
  }, [id, title, newTitle, setIsEditing, done, onChange]);

  function handleClickCheckbox() {
    const newValue = {
      id, title, done: !done
    };

    onChange(id, newValue);
  }

  function handleClickEditTitle() {
    setIsEditing(true);
    setNewTitle(title);
  }

  function handleClickCancel() {
    setIsEditing(false);
    setNewTitle('');
    if (id === 'new') {
      handleClickDelete();
    }
  }

  useEffect(() => {
    if (id === 'new') {
      setIsEditing(true);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing && !errorMsg) {
      setIsEditing(false);
    }
  }, [errorMsg]);

  return (
    <li className="list-group-item d-inline-flex align-items-start">
      <div className="d-flex align-items-center w-75">
        {isEditing ? (
          <Input value={newTitle} placeholder="Title" onInput={e => setNewTitle(e.currentTarget.value)} errorMsg={errorMsg} />
        ) : (
          <div className="form-check">
            <input className="form-check-input"
                   type="checkbox"
                   checked={done}
                   id={`task_${id}`}
                   onChange={handleClickCheckbox}/>
            <label className={`form-check-label ${done ? 'checked' : ''}`} title="Click to mark as done/undone"
                   htmlFor={`task_${id}`}>
              {title}
            </label>
          </div>
        )}
      </div>
      <div className="d-inline-flex justify-content-end align-items-center gap-1 w-25">
        {isEditing ? (
          <>
            <button title="Confirm" className="btn btn-outline-success btn-sm" onClick={handleClickChangeTitle}>
              <i className="bi bi-check"></i>
            </button>
            <button title="Cancel" className="btn btn-outline-danger btn-sm" onClick={handleClickCancel}>
              <i className="bi bi-x"></i>
            </button>
          </>
        ) : (
          <>
            <button title="Edit Title" className="btn btn-outline-warning btn-sm" onClick={handleClickEditTitle}>
              <i className="bi bi-pen"></i>
            </button>
            <button title="Delete Task" className="btn btn-outline-danger btn-sm" onClick={handleClickDelete}>
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </div>
    </li>
  );
}
