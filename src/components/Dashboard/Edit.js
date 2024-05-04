import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Edit = ({ tasks, selectedTask, setTasks, setIsEditing }) => {
  const id = selectedTask.id;

  const [title, setTitle] = useState(selectedTask.title);
  const [description, setDescription] = useState(selectedTask.description);
  const [status, setStatus] = useState(selectedTask.status);

  const handleUpdate = async e => {
    e.preventDefault();
    if (!title || !description || !status) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const task = {
      title,
      description,
      status,
    };

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/tasks/${id}`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : task
    };

    await axios.request(config)
    .then((response) => {
      if(response.status == 200){
        setIsEditing(false);
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id === response.data.id) {
            tasks.splice(i, 1, task);
            break;
          }
        }
        // setTasks(tasks);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${task.title} ${task.description}'s data has been updated.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
    .catch((error) => {
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Task</h1>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <label htmlFor="status">status</label>
        <input
          id="status"
          type="status"
          name="status"
          value={status}
          onChange={e => setStatus(e.target.value)}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
