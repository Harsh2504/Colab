import './App.css'
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { addTodo } from './features/todo/todoSlice';
import { FlipWords } from "./components/ui/flip-words";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./appComponents/Dashboard";

function App() {
  const todos = useSelector((state) => state.todos);
  const [text, setText] = useState('');
  const dispatch = useDispatch();


  const words = ["better", "cute", "beautiful", "modern"];


  const addTodoHandler = (event) => {
    event.preventDefault();
    dispatch(addTodo(text));
    setText('');
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className='p-6'>
          <div>
            <form onSubmit={addTodoHandler}>
              <input
                style={{ border: "1px solid black" }}
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button>Add todo</button>
            </form>
          </div>
          <div>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <span>{todo.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-[40rem] flex justify-center items-center px-4">
            <div className="mx-auto text-4xl font-normal text-neutral-600 dark:text-neutral-400">
              Build
              <FlipWords words={words} /> <br />
              websites with Aceternity UI
            </div>
          </div>
        </div>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
