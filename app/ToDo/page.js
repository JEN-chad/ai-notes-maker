"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

import SimpleSidebar from "./TodoComponents/TodoSidebar";
import WorkSpaceHeader from "../dashboard/_components/Header";

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([...todos, { id: Date.now(), text: task, completed: false }]);
    setTask("");
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[250px] ">
        <SimpleSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <WorkSpaceHeader />

        <div className="p-6 max-w-2xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4">ToDo List</h1>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter a task..."
              className="focus:outline-none focus:border-none focus:ring-0 placeholder:text-lg"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Button onClick={addTodo}>Add</Button>
          </div>

          {/* List */}
          <ul className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-gray-500">Track Your progress by adding tasks 🔥.</p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <span
                    onClick={() => toggleComplete(todo.id)}
                    className={`cursor-pointer ${
                      todo.completed ? "line-through text-gray-600" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Trash
                    className="w-5 h-5 text-red-500 cursor-pointer"
                    onClick={() => removeTodo(todo.id)}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
