import React, { useEffect, useState } from "react";
import {destroy, get, post, put} from "@rails/request.js";

import TaskList from "./TaskList";

export default function App() {
  const [lists, setLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  async function fetchTasksList() {
    const response = await get('lists');
    if (!response.ok) {
      alert(response.message());
      return;
    }

    setLists(await response.json);
  }

  function handleClickNewList() {
    setIsCreating(true);
    setLists([
      ...lists,
      { id: 'new' }
    ]);
  }

  async function handleTaskChange(id, newListTitle) {
    setIsCreating(false);
    let response;
    if (id === 'new') {
      setLists(lists.filter(list => list.id !== id));
      response = await post('lists', {body: { title: newListTitle}});
    } else {
      response = await put(`lists/${id}`, {body: { title: newListTitle}})
    }

    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0] ?? 'Error saving list!');
    }

    fetchTasksList().then();
  }

  async function handleTaskDelete(id) {
    if (id === 'new') {
      setIsCreating(false);
      setLists(lists.filter(list => list.id !== id));
      return;
    }

    const response = await destroy(`lists/${id}`);
    if (!response.ok) {
      const messages = await response.json;
      alert(messages[0] ?? 'Error deleting list!');
      return;
    }

    setLists(lists.filter(list => list.id !== id));
  }

  useEffect(() => {
    fetchTasksList().then();
  }, []);

  return (
    <>
      <div className="header position-fixed p-2 w-100 bg-primary shadow border border-primary">
        <h1 className="text-light">Shared TO-DO</h1>
      </div>
      <div className="content d-inline-flex mx-2 mh-100 gap-2">
        {lists.map(list => (
          <div key={list.id}>
            <TaskList id={list.id} title={list.title} onChange={handleTaskChange} onDelete={handleTaskDelete}/>
          </div>
        ))}
        {!isCreating && (
          <div>
            <button type="button" className="btn btn-primary card-size" onClick={handleClickNewList}>
              <i className="bi bi-plus"></i>
              Add New List
            </button>
          </div>
        )}
      </div>
    </>
  );
}
