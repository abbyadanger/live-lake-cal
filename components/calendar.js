import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import styles from './calendar.module.css';

export default function Calendar() {
  const [selected, setSelected] = useState();

  // Set on the client only, so the server's date/timezone can't cause a hydration mismatch
  useEffect(() => setSelected(new Date()), []);

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      className={styles.calendar}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : 'Pick a day.'
      }
    />
  );
}
