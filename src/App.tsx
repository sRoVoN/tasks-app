import TaskInput from "./components/TaskInput";
import { useState, useEffect } from "react";
import { Task } from "./modal";
import taskListStyles from "./components/Tasklist.module.css";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { GiCheckMark } from "react-icons/gi";
import { GoDash } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import taskStyles from "./components/Task.module.css";
import { FaRegCircle } from "react-icons/fa";

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

    // Create a copy of the tasks array to modify
    const updatedTasks = Array.from(tasks);
    const [draggedTask] = updatedTasks.splice(source.index, 1); // Remove the dragged task from its original position
    console.log(destination, source, draggedTask.isDone);
    // Update the task's `isDone` status based on where it's dropped
    if (destination.droppableId === "uncheckedTasks") {
      draggedTask.isDone = false;
    } else if (destination.droppableId === "checkedTasks") {
      draggedTask.isDone = true;
    }

    // Reinsert the task in the new position
    updatedTasks.splice(destination.index, 0, draggedTask);

    // Update the state with the new task list
    setTasks(updatedTasks);
  };

  return (
    <>
      <TaskInput task={task} setTask={setTask} handleSubmit={handleSubmit} />
      <div className={taskListStyles.tasklist}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={taskListStyles.column}>
            <h2>Unchecked Tasks</h2>
            <Droppable
              droppableId="uncheckedTasks"
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef} // Always pass provided.innerRef to the container
                  {...provided.droppableProps} // Add droppableProps to the container
                  className={taskListStyles.column}
                >
                  {uncheckedTasks.map((t, index) => (
                    <Draggable
                      key={t.id}
                      draggableId={t.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef} // Correctly apply ref to each draggable item
                          className={taskStyles.task}
                        >
                          {editingId === t.id ? (
                            <>
                              <input
                                type="text"
                                className={taskStyles.task__input}
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                              />
                              <button
                                className={taskStyles.task__savebtn}
                                onClick={handleSave}
                              >
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <h3>{t.task}</h3>
                              <div>
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleEdit(t.id)}
                                >
                                  <CiEdit color="yellow" />
                                </button>
                                <FaRegCircle
                                  className={taskStyles.task__point}
                                  color="yellow"
                                  size={8}
                                  onClick={() => handleEdit(t.id)}
                                />
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleDelete(t.id)}
                                >
                                  <MdDeleteForever color="red" />
                                </button>
                                <FaRegCircle
                                  className={taskStyles.task__point}
                                  color="red"
                                  size={8}
                                  onClick={() => handleDelete(t.id)}
                                />
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleCheck(t.id)}
                                >
                                  {t.isDone ? (
                                      <GiCheckMark color="green" />
                                  ) : (
                                      <GoDash />
                                  )}
                                </button>
                                {t.isDone ? (
                                  <FaRegCircle
                                    className={taskStyles.task__point}
                                    color="green"
                                    size={8}
                                    onClick={() => handleCheck(t.id)}
                                  />
                                ) : (
                                  <FaRegCircle
                                    className={taskStyles.task__point}
                                    color="blue"
                                    size={8}
                                    onClick={() => handleCheck(t.id)}
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}{" "}
                  {/* Always include provided.placeholder in the Droppable */}
                </div>
              )}
            </Droppable>
          </div>
          <div className={taskListStyles.column}>
            <h2>checked Tasks</h2>
            <Droppable
              droppableId="checkedTasks"
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef} // Always pass provided.innerRef to the container
                  {...provided.droppableProps} // Add droppableProps to the container
                  className={taskListStyles.column}
                >
                  {checkedTasks.map((t, index) => (
                    <Draggable
                      key={t.id}
                      draggableId={t.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={taskStyles.task}
                        >
                          {editingId === t.id ? (
                            <>
                              <input
                                type="text"
                                className={`${taskStyles.task__input}`}
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                              />
                              <button
                                className={`${taskStyles.task__savebtn}`}
                                onClick={handleSave}
                              >
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <h3>{t.task}</h3>
                              <div>
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleEdit(t.id)}
                                >
                                  <CiEdit color="yellow" />
                                </button>
                                <FaRegCircle
                                  className={taskStyles.task__point}
                                  color="yellow"
                                  size={8}
                                  onClick={() => handleEdit(t.id)}
                                />
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleDelete(t.id)}
                                >
                                  <MdDeleteForever color="red" />
                                </button>
                                <FaRegCircle
                                  className={taskStyles.task__point}
                                  color="red"
                                  size={8}
                                  onClick={() => handleDelete(t.id)}
                                />
                                <button
                                  className={taskStyles.task__btn}
                                  onClick={() => handleCheck(t.id)}
                                >
                                  {t.isDone ? (
                                      <GiCheckMark color="green" />
                                  ) : (
                                      <GoDash />
                                  )}
                                </button>
                                {t.isDone ? (
                                  <FaRegCircle
                                    className={taskStyles.task__point}
                                    color="green"
                                    size={8}
                                    onClick={() => handleCheck(t.id)}
                                  />
                                ) : (
                                  <FaRegCircle
                                    className={taskStyles.task__point}
                                    color="blue"
                                    size={8}
                                    onClick={() => handleCheck(t.id)}
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
