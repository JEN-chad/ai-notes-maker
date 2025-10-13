"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Menu, X } from "lucide-react";
import SimpleSidebar from "./TodoComponents/TodoSidebar";
import WorkSpaceHeader from "../dashboard/_components/Header";

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed h-screen w-64 bg-white shadow-md z-40 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block`}
      >
        {/* Close button (only visible on mobile) */}
        <div className="flex items-center justify-end p-4 md:hidden">
          <button
            onClick={closeSidebar}
            className="p-2 rounded hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <SimpleSidebar />
      </div>

      {/* Transparent click area (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 md:hidden cursor-pointer"
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 shadow-md bg-white sticky top-0 z-20">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Hamburger icon — visible only on mobile */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Right Section (Profile) */}
          <div className="ml-auto">
            <WorkSpaceHeader />
          </div>
        </header>

        {/* ToDo Content */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
            ToDo List
          </h1>

          {/* Input section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              placeholder="Enter a task..."
              className="focus:outline-none focus:ring-0 placeholder:text-base sm:placeholder:text-lg"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Button
              onClick={addTodo}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          </div>

          {/* Todo list */}
          <ul className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center sm:text-left">
                Track your progress by adding tasks 🔥
              </p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md bg-white hover:bg-gray-50 transition"
                >
                  <span
                    onClick={() => toggleComplete(todo.id)}
                    className={`cursor-pointer break-words max-w-full text-base sm:text-lg ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="mt-2 sm:mt-0 sm:ml-3 flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <Trash className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Delete</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default ToDo;
