import { Task } from "../modal";
import { GiCheckMark } from "react-icons/gi";
import { GoDash } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import taskStyles from "./Task.module.css";
import { FaRegCircle } from "react-icons/fa";
import { Draggable, Droppable } from "react-beautiful-dnd";
import taskListStyles from "./Tasklist.module.css";

interface uncheckedtasksProps {
  uncheckedTasks: Task[];
  editingId: number | null;
  newTask: string;
  handleSave: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  handleCheck: (id: number) => void;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
}

function UncheckedTasksList({
  uncheckedTasks,
  editingId,
  newTask,
  handleCheck,
  handleDelete,
  handleEdit,
  handleSave,
  setNewTask,
}: uncheckedtasksProps) {
  return (
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
            <Draggable key={t.id} draggableId={t.id.toString()} index={index}>
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
                      <div className={taskStyles.task__buttons}>
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
  );
}

export default UncheckedTasksList;
