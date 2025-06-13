import React from "react";
import styles from "../App.module.css";

export default function ExerciseSelect({
  exercises,
  selectedExercise,
  onChange,
}) {
  return (
    <div className={styles.selectGroup}>
      <label htmlFor="exercise-select" className={styles.exerciseSelectLabel}>
        Select Exercise
      </label>
      <select
        id="exercise-select"
        className={styles.exerciseSelect}
        value={selectedExercise}
        onChange={onChange}
      >
        <option value="" disabled>
          -- Select an exercise --
        </option>
        {exercises.map((ex) => (
          <option key={ex} value={ex}>
            {ex}
          </option>
        ))}
      </select>
    </div>
  );
}
