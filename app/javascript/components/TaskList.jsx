import React, {useCallback, useEffect, useState} from "react";
import {destroy, get, post, put} from "@rails/request.js";

import TaskItem from "./TaskItem";
import OptionsPopover from "./OptionsPopover";
import Input from "./Input";
import TasksChannel from "../channels/tasks";

export default function TaskList({ id, title, onChange, onDelete, errorMsg }) {
  const NEW_ITEM_ID = 'new';

  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [itemErrorMsg, setItemErrorMsg] = useState('');

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('id');

  const filters = [
    { value: 'pending', title: 'Pending' },
    { value: 'complete', title: 'Complete'},
    { value: 'all', title: 'All'}
  ];
  const sorts = [
    { value: 'id', title: 'ID' },
    { value: 'title', title: 'Title' },
    { value: 'created_at', title: 'Created At' }
  ];

  const handleChange = useCallback(() => {
    onChange(id, newTitle);
  }, [id, newTitle, setIsEditing, onChange]);
  const handleDelete = useCallback(() => onDelete(id), [id, onDelete]);

  TasksChannel.subscriptions.create("TasksChannel", {
    received(data) {
      setItems(data);
    }
  });

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
    setItemErrorMsg('');

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
      setItemErrorMsg(messages[0] ?? 'Error saving task!');
      return;
    }

    setIsAddingItem(false);
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
      alert(messages[0] ?? 'Error deleting task!');
    }
  }

  function handleFilterChange(newValue) {
    setSelectedFilter(newValue);
  }

  function handleSortChange(newValue) {
    setSelectedSort(newValue);
  }

  async function fetchItems() {
    const query = {};
    if (selectedFilter !== 'all') {
        query.done = selectedFilter === 'complete';
    }
    if (selectedSort !== 'id') {
      query.sort = selectedSort;
    }

    const response = await get(`lists/${id}/tasks`, { query });
    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0] ?? 'Error fetching tasks!');
      return;
    }

    setItems(await response.json)
  }

  useEffect(() => {
    if (id === 'new') {
      setIsEditing(true);
      return;
    }

    fetchItems().then();
  }, [id, selectedFilter, selectedSort]);

  useEffect(() => {
    if (isEditing && !errorMsg) {
      setIsEditing(false);
    }
  }, [errorMsg]);

  return (
    <div className="card card-size">
      <div className="card-header justify-content-between align-items-start d-flex">
        <div className="w-75">
          {isEditing ? (
            <Input value={newTitle} placeholder="Title" onInput={e => setNewTitle(e.currentTarget.value)} errorMsg={errorMsg} />
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
                      onDelete={handleItemDelete}
                      errorMsg={itemErrorMsg}/>
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
                <OptionsPopover selectedFilter={selectedFilter} filters={filters} selectedSort={selectedSort} sorts={sorts} onChangeFilter={handleFilterChange} onChangeSort={handleSortChange} />
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
