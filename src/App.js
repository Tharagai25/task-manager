
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myTasks")) || [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();

    if (!task.trim()) {
      alert("Please enter a task!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: task.trim(),
      completed: false,
    };

    setTasks((previous) => [newTask, ...previous]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previous) => previous.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setTasks((previous) => previous.filter((item) => !item.completed));
  };

  const filteredTasks = tasks.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const completedCount = tasks.filter((item) => item.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">✓</div>
        <h1>TaskFlow</h1>
        <p>Organize your day, achieve your goals.</p>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <h2>My Tasks</h2>
            <p>Small steps lead to big achievements.</p>
          </div>
          <div className="date">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon purple">▤</span>
            <div>
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon orange">◷</span>
            <div>
              <h3>{remainingCount}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <div>
              <h3>{completedCount}</h3>
              <p>Completed</p>
            </div>
          </div>
        </section>

        <section className="task-panel">
          <h2>Add a New Task</h2>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="What do you need to do?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              maxLength={200}
              aria-label="New task"
            />
            <button type="submit" className="add-btn">
              + Add Task
            </button>
          </form>

          <div className="task-toolbar">
            <div className="filters">
              {["all", "active", "completed"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? "filter-btn selected" : "filter-btn"}
                  onClick={() => setFilter(item)}
                >
                  {item === "all"
                    ? "All Tasks"
                    : item === "active"
                    ? "Pending"
                    : "Completed"}
                </button>
              ))}
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                className="clear-btn"
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            )}
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <h3>
                  {tasks.length === 0
                    ? "No tasks yet"
                    : "No tasks in this category"}
                </h3>
                <p>Add a task above and start getting things done!</p>
              </div>
            ) : (
              filteredTasks.map((item) => (
                <div className="task-item" key={item.id}>
                  <button
                    type="button"
                    className={
                      item.completed ? "check-btn checked" : "check-btn"
                    }
                    onClick={() => toggleTask(item.id)}
                    aria-label={
                      item.completed ? "Mark as pending" : "Mark as completed"
                    }
                  >
                    {item.completed ? "✓" : ""}
                  </button>

                  <span
                    className={
                      item.completed ? "task-title completed" : "task-title"
                    }
                  >
                    {item.title}
                  </span>

                  <span
                    className={
                      item.completed ? "status done" : "status pending"
                    }
                  >
                    {item.completed ? "Done" : "Pending"}
                  </span>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(item.id)}
                    aria-label={`Delete ${item.title}`}
                    title="Delete task"
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <div className="task-footer">
              <span>
                {remainingCount} task{remainingCount !== 1 ? "s" : ""} left
              </span>
              <span>
                {tasks.length > 0
                  ? Math.round((completedCount / tasks.length) * 100)
                  : 0}
                % completed
              </span>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Made with care • Stay focused, stay productive.
      </footer>
    </div>
  );
}

export default App;
