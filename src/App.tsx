import TaskInput from "./components/TaskInput";
import { useState, useEffect } from "react";
import { Task } from "./modal";
import taskListStyles from "./components/Tasklist.module.css";
import {
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import CheckedTasksList from "./components/CheckedTasksList";
import UncheckedTasksList from "./components/UncheckedTasksList";

function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<string>("");
  const [checkedTasks, setCheckedTasks] = useState<Task[]>([]);
  const [uncheckedTasks, setUncheckedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const updateCheckedTasks = tasks.filter((task) => task.isDone);
    setCheckedTasks(updateCheckedTasks);
    const updateUncheckedTasks = tasks.filter((task) => !task.isDone);
    setUncheckedTasks(updateUncheckedTasks);
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          task: task,
          isDone: false,
        },
      ]);
      setTask("");
    } else {
      alert("Please add a task");
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSave = () => {
    if (newTask)
      setTasks((prevTasks) =>
        prevTasks.map((preTask) =>
          preTask.id === editingId ? { ...preTask, task: newTask } : preTask
        )
      );
    setEditingId(null);
    setNewTask("");
  };

  const handleCheck = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === id
          ? { ...prevTask, isDone: !prevTask.isDone }
          : prevTask
      )
    );
  };
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If dropped outside the droppable area
    if (!destination) return;

    // If the item is dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const updatedTasks = Array.from(tasks);
    const [draggedTask] = updatedTasks.splice(source.index, 1); 
    console.log(destination, source, draggedTask.isDone);

    if (destination.droppableId === "uncheckedTasks") {
      draggedTask.isDone = false;
    } else if (destination.droppableId === "checkedTasks") {
      draggedTask.isDone = true;
    }

    updatedTasks.splice(destination.index, 0, draggedTask);
    setTasks(updatedTasks);
  };

  return (
    <>
      <TaskInput task={task} setTask={setTask} handleSubmit={handleSubmit} />
      <div className={taskListStyles.tasklist}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={taskListStyles.column}>
            <h2>Unchecked Tasks</h2>
            <UncheckedTasksList
              uncheckedTasks={uncheckedTasks}
              editingId={editingId}
              newTask={newTask}
              setNewTask={setNewTask}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSave={handleSave}
            />
          </div>
          <div className={taskListStyles.column}>
            <h2>checked Tasks</h2>
            <CheckedTasksList
              checkedTasks={checkedTasks}
              setCheckedTasks={setCheckedTasks}
              editingId={editingId}
              newTask={newTask}
              setNewTask={setNewTask}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSave={handleSave}
            />
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
