import React from "react";
import styles from "../App.module.css";

export default function ResetZoomButton({ onClick }) {
  return (
    <button className={styles.resetZoomBtn} onClick={onClick}>
      Reset Zoom
    </button>
  );
}
