import React from "react";
import styles from "../App.module.css";

export default function DateRangePicker({
  dateRange,
  onFromChange,
  onToChange,
}) {
  return (
    <>
      <div className={styles.dateRangeGroup}>
        <label className={styles.exerciseSelectLabel}>From</label>
        <input
          type="date"
          className={styles.dateInput}
          value={dateRange.from}
          max={dateRange.to}
          onChange={onFromChange}
        />
      </div>

      <div className={styles.dateRangeGroup}>
        <label className={styles.exerciseSelectLabel}>To</label>
        <input
          type="date"
          className={styles.dateInput}
          value={dateRange.to}
          min={dateRange.from}
          onChange={onToChange}
        />
      </div>
    </>
  );
}
