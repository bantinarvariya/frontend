import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

const Dashboard = ({ setIsAuthenticated }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tasks');
        if(response.status == 200){
          setTasks(response.data)
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleEdit = id => {
    const [task] = tasks.filter(task => task.id === id);

    setSelectedTask(task);
    setIsEditing(true);
  };

  const handleDelete = async id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.value) {
        const [task] = tasks.filter(task => task.id === id);
        try {
          let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/tasks/${id}`,
            headers: { }
          };

          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${task.title} ${task.description}'s data has been deleted.`,
            showConfirmButton: false,
            timer: 1500,
          });

          const tasksCopy = tasks.filter(task => task.id !== id);
          localStorage.setItem('tasks_data', JSON.stringify(tasksCopy));
          setTasks(tasksCopy);
        } catch (error) {
          console.error('Error deleting data:', error);
        }
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            tasks={tasks}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <Add
          tasks={tasks}
          setTasks={setTasks}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          tasks={tasks}
          selectedTask={selectedTask}
          setTasks={setTasks}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
