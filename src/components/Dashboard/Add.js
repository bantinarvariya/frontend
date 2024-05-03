import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Add = ({ tasks, setTasks, setIsAdding }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleAdd = async e => {
    e.preventDefault();

    if (!title || !description || !status) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const id = tasks.length + 1;
    const newTask = {
      id,
      title,
      description,
      status
    };

    try {
      const response = await axios.post('http://localhost:3000/tasks', newTask);
    } catch (error) {
      console.error('Error creating data:', error);
    }

    tasks.push(newTask);
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
    setTasks(tasks);
    setIsAdding(false);

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${title} ${description}'s data has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Add Task</h1>
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
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">done</option>
        </select>
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
