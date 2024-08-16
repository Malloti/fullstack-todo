import React, {useCallback, useEffect, useState} from "react";
import {destroy, get, post, put} from "@rails/request.js";

import TaskItem from "./TaskItem";
import FilterPopover from "./FilterPopover";

export default function TaskList({ id, title, onChange, onDelete }) {
  const NEW_ITEM_ID = 'new';

  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { value: 'pending', title: 'Pending' },
    { value: 'complete', title: 'Complete'},
    { value: 'all', title: 'All'}
  ];

  const handleChange = useCallback(() => {
    setIsEditing(false);
    onChange(id, newTitle)
  }, [id, newTitle, setIsEditing, onChange]);
  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  function handleClickEdit() {
    setIsEditing(true);
    setNewTitle(title);
  }

  function handleClickCancel() {
    setIsEditing(false);
    setNewTitle('');
    if (id === 'new') {
      handleDelete();
    }
  }

  function handleClickNewTask() {
    setIsAddingItem(true);
    setItems([
      ...items,
      { id: NEW_ITEM_ID, title: '', done: false },
    ]);
  }

  async function handleItemChange(itemId, newValue) {
    setIsAddingItem(false);
    const newItems = items.filter(item => item.id !== itemId);
    if (itemId === NEW_ITEM_ID && newValue.title === '') {
      setItems(newItems);

      return;
    }

    let response;
    if (itemId === NEW_ITEM_ID) {
      response = await post(`lists/${id}/tasks`, {body: newValue});
    } else {
      response = await put(`lists/${id}/tasks/${itemId}`, {body: newValue});
    }

    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0]);
      return;
    }

    fetchItems().then();
  }

  async function handleItemDelete(itemId) {
    if (itemId === NEW_ITEM_ID) {
      setIsAddingItem(false);
      setItems(items.filter(item => item.id !== itemId));
      return;
    }

    const response = await destroy(`lists/${id}/tasks/${itemId}`);
    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0]);
      return;
    }

    setItems(items.filter(item => item.id !== itemId));
  }

  async function handleFilterChange(newValue) {
    setSelectedFilter(newValue);
  }

  async function fetchItems() {
    const query = {};
    if (selectedFilter !== 'all') {
        query.done = selectedFilter === 'complete';
    }

    const response = await get(`lists/${id}/tasks`, { query });
    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0]);
      return;
    }

    setItems(await response.json)
  }

  useEffect(() => {
    fetchItems().then();
    if (id === 'new') {
      setIsEditing(true);
    }
  }, [id, selectedFilter]);

  return (
    <div className="card card-size">
      <div className="card-header justify-content-between d-flex">
        <div className="w-75">
          {isEditing ? (
            <input className="form-control"
                   value={newTitle}
                   type="text"
                   onInput={(e) => setNewTitle(e.currentTarget.value)}/>
          ) : (
            <h3 className="list-header w-75" title={title}>{title}</h3>
          )}
        </div>

        <div className="d-inline-flex justify-content-end align-items-center gap-1 w-25">
          {isEditing ? (
            <>
              <button type="button"
                      title="Confirm"
                      className="btn btn-outline-success btn-sm"
                      onClick={handleChange}>
                <i className="bi bi-check"></i>
              </button>
              <button type="button"
                      title="Delete List"
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleClickCancel}>
                <i className="bi bi-x"></i>
              </button>
            </>
          ) : (
            <>
              <button type="button"
                      title="Edit List"
                      className="btn btn-outline-warning btn-sm"
                      onClick={handleClickEdit}>
                <i className="bi bi-pen"></i>
              </button>
              <button type="button"
                      title="Delete List"
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDelete}>
                <i className="bi bi-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="card-body w-100 p-0">
        <ul className="list-group list-group-flush w-100">
          {items.map(item => (
            <TaskItem key={item.id}
                      id={item.id}
                      title={item.title}
                      done={item.done}
                      onChange={handleItemChange}
                      onDelete={handleItemDelete}/>
          ))}

          <div className="d-flex w-100 justify-content-center align-items-center gap-1">
            {!isEditing && !isAddingItem && (
              <>
                <button type="button"
                        title="Add Task"
                        className="btn btn-outline-success m-1"
                        onClick={handleClickNewTask}>
                  <i className="bi bi-plus-lg"></i>
                  Add Task
                </button>
                <FilterPopover selectedOption={selectedFilter} options={filters} onChange={handleFilterChange} />
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
