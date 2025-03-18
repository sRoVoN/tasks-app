
import styles from "./TaskInput.module.css";

 interface taskProps {
  task:string,
  setTask:  React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (e: React.FormEvent, task: string) => void
}

function TaskInput({task, setTask, handleSubmit}: taskProps) {
  return (
    <form className={styles.form} onSubmit={(e) => { handleSubmit(e,task)}} >
      <input type="text" placeholder="Type a task" className={`${styles.form__input}`} value={task} onChange={(e) => setTask(e.target.value)} />
      <button className={`${styles.input__btn}`}>Add</button>
     </form>
  )
}

export default TaskInput