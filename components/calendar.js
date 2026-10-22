import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { eachDayOfInterval, format, getDay, isToday } from 'date-fns';
import styles from './calendar.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function Calendar() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadData() {
      // Oldest first, so the earliest row is first and the latest is last
      const { data, error } = await supabase
        .from('lake-mich-temp')
        .select('dateTime, temp')
        .order('dateTime', { ascending: true });
      if (error) console.error('DB error:', error);
      else setRows(data);
    }
    loadData();
  }, []);

  if (rows.length === 0) return null;

  // Temperature for each day, e.g. { '2026-10-15': 53 } (the last reading of a day wins)
  const tempByDay = {};
  rows.forEach((row) => {
    tempByDay[format(new Date(row.dateTime), 'yyyy-MM-dd')] = row.temp;
  });

  const days = eachDayOfInterval({
    start: new Date(rows[0].dateTime),
    end: new Date(rows[rows.length - 1].dateTime),
  });

  return (
    <div className={styles.grid}>
      {days.map((day, index) => {
        const key = format(day, 'yyyy-MM-dd');
        const temperature = tempByDay[key] ? `${tempByDay[key]}°F` : 'no data';

        // Start the first day under the correct weekday (Sunday = column 1)
        const style = index === 0 ? { gridColumnStart: getDay(day) + 1 } : undefined;

        return (
          <div
            key={key}
            style={style}
            title={`${key}: ${temperature}`}
            className={isToday(day) ? `${styles.cell} ${styles.today}` : styles.cell}
          />
        );
      })}
    </div>
  );
}
