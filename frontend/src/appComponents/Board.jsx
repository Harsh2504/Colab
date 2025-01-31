import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from './ProjectContext';
import axios from 'axios';
import addTaskIcon from '../assets/addTask.svg';
import { v4 as uuidv4 } from 'uuid';
const BACKEND_URL = import.meta.env.VITE_API_URL;
const initialLists = {
   Todo: [],
   InProgress: [],
   Done: [],
};

const Board = () => {
   const navigate = useNavigate();
   const [lists, setLists] = useState(initialLists);
   const [draggedItem, setDraggedItem] = useState(null);
   const [draggedFromList, setDraggedFromList] = useState('');
   const [newTask, setNewTask] = useState('');
   const { project, setProject } = useProject();

   // Use useEffect to update the lists only when the project changes
   useEffect(() => {
      if (project && project.toDO && project.inProgress && project.completed) {
         setLists({
            Todo: project.toDO,
            InProgress: project.inProgress,
            Done: project.completed,
         });
      }
      // console.log("Project:", project);
   }, [project]);

   const handleDragStart = (item, listKey) => {
      setDraggedItem(item);
      setDraggedFromList(listKey);
   };

   const updateListsOnDrop = (listKey) => {
      if (draggedItem === null) return;

      setLists((prevLists) => {
         const updatedLists = { ...prevLists };

         // Move dragged item from the source list to the target list
         updatedLists[draggedFromList] = updatedLists[draggedFromList].filter(
            (item) => item !== draggedItem
         );
         updatedLists[listKey] = [...updatedLists[listKey], draggedItem];

         // Update project data and localStorage
         updateProjectData(updatedLists);
         return updatedLists;
      });

      setDraggedItem(null);
      setDraggedFromList('');
   };

   const handleDrop = (e, listKey) => {
      e.preventDefault();
      updateListsOnDrop(listKey);
   };

   const handleDragOver = (e) => {
      e.preventDefault();
   };

   const getListClasses = (key) => {
      const baseClasses =
        "relative flex flex-col items-center p-4 pt-12 overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white border border-gray-300 rounded-lg w-1/4 font-semibold text-sm";
    
      switch (key) {
        case "Todo":
          return `${baseClasses} text-cyan-600`;
        case "InProgress":
          return `${baseClasses} text-purple-600`;
        case "Done":
          return `${baseClasses} text-green-600`;
        default:
          return baseClasses;
      }
    };
    
    

   const getItemClasses = (key) => {
      switch (key) {
         case 'Todo':
            return 'p-2 m-1 bg-cyan-100 border border-cyan-300 cursor-move w-[100%] rounded';
         case 'InProgress':
            return 'p-2 m-1 bg-purple-100 border border-purple-300 cursor-move w-[100%] rounded';
         case 'Done':
            return 'p-2 m-1 bg-green-100 border border-green-300 cursor-move w-[100%] rounded';
         default:
            return 'p-2 m-1 bg-neutral-100 border border-gray-300 cursor-move w-[100%] rounded';
      }
   };

   const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   };

   const addNewTask = () => {
      if (!newTask.trim()) return;
      const taskObject = {
         taskid: uuidv4(), // Generate a unique ID for the task
         taskName: newTask.trim(),
         taskDescription: "",
         assignedTo: "",
         reporter: localStorage.getItem('user-object')
            ? JSON.parse(localStorage.getItem('user-object')).name
            : "",
         startDate: formatDate(Date.now()), // Format current date
         dueDate: "", // Keep it empty for now, can be updated later
      };

      setLists((prevLists) => {
         const updatedLists = {
            ...prevLists,
            Todo: [...prevLists.Todo, taskObject],
         };
         // Update project data and localStorage
         updateProjectData(updatedLists);
         return updatedLists;
      });

      setNewTask('');
   };

   const updateProjectData = async (updatedLists) => {
      const newProject = {
          ...project,
          toDO: updatedLists.Todo,
          inProgress: updatedLists.InProgress,
          completed: updatedLists.Done,
      };
  
      // Update the context and local storage
      const updateStateAndStorage = () => {
          setProject(newProject);
          localStorage.setItem(project._id, JSON.stringify(newProject));
         //  console.log("Project data updated successfully");
      };
  
      // API call to update the task status on the server
      try {
          await axios.post(`${BACKEND_URL}/api/tasks/updateTaskStatus`, {
              projectId: project._id,
              toDO: updatedLists.Todo,
              inProgress: updatedLists.InProgress,
              completed: updatedLists.Done,
          });
          console.log("Task status updated successfully");
          updateStateAndStorage(); // Only update state after the API call
      } catch (error) {
          console.error("Error updating task status:", error);
      }
  };
  

   return (
      <div className="flex flex-col min-h-screen p-4 space-x-4 justify-top">
         <div className='flex items-center'>
            <p
               className='py-2 px-1 font-semibold cursor-pointer hover:underline'
               onClick={() => navigate('/home')}
            >
               Projects
            </p>
            <p className='py-2 px-1'>/</p>
            <p className='py-2 px-1 font-semibold'>{project ? project.name : "Loading..."}</p>
         </div>
         {/* <p>{JSON.stringify(project)}</p> */}
         <div className='flex justify-center'>
            <div className='flex w-1/2'>
               <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  type="text"
                  className="w-full p-2 mx-1 border border-gray-300 rounded"
                  placeholder="What needs to be done?"
               />
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     addNewTask();
                  }}
                  className="w-11 flex justify-center items-center p-2 mx-1 text-white hover:bg-blue-600 bg-blue-500 rounded"
               >
                  <img src={addTaskIcon} alt="addTaskIcon" className='h-5 w-5'/>
               </button>
            </div>
         </div>
         <div className='flex justify-center gap-5 mt-10 h-[75vh] overflow-x-auto'>
            {Object.keys(lists).map((key) => (
               <div
                  key={key}
                  id={key}
                  className={getListClasses(key)}
                  onDrop={(e) => handleDrop(e, key)}
                  onDragOver={handleDragOver}
               >
                  <h2 className="absolute mb-2 text-lg font-semibold top-2 left-4 flex justify-between w-[90%]">
                  <span>{key}</span> <span>x {lists[key].length}</span>
                  </h2>
                  
                  {lists[key].length === 0 ? ( // Check if the list is empty
                  <div className=" text-gray-400">
                     {key === "Todo" && "No tasks in Todo"}
                     {key === "InProgress" && "No tasks in Progress"}
                     {key === "Done" && "No tasks in Done"}
                  </div>
                  ) : (
                  lists[key].map((item, index) => (
                     <div
                        key={index}
                        draggable
                        onDragStart={() => handleDragStart(item, key)}
                        className={getItemClasses(key)}
                     >
                        {item.taskName} {/* Display taskName instead of the entire object */}
                     </div>
                  ))
                  )}
               </div>
            ))}
            </div>
      </div>
   );
};

export default Board;
