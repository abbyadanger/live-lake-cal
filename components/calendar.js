import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { eachDayOfInterval, format, getDay, isToday } from 'date-fns';
import styles from './calendar.module.css';

// Database Configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Average Temperature Range (in °F) for the color scale
const COLDEST = 32;
const HOTTEST = 80;

// RGBs for the color scale from coldest (blue) to hottest (red)
const COLORS = [
  [59, 130, 246], // blue
  [255, 255, 255], // white
  [250, 204, 21], // yellow
  [249, 115, 22], // orange
  [220, 38, 38], // red
];

/*
  Algorithim I stole that determines the color based on temperature :)
  Maps a temperature to a color: finds its spot on the cold-to-hot scale, colors outside 
  the range are pinned to the nearest end. Colors within the range are blended between the
  two nearest colors. Returns an rgb() string.
*/
function getColor(temp) {
  const percent = (temp - COLDEST) / (HOTTEST - COLDEST);
  const clamped = Math.min(Math.max(percent, 0), 1); 
  const position = clamped * (COLORS.length - 1); 
  const index = Math.min(Math.floor(position), COLORS.length - 2);
  const blend = position - index; 
  const [r, g, b] = COLORS[index].map((from, i) => from + (COLORS[index + 1][i] - from) * blend);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function Calendar() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    /* Load data from DB and load into rows */
    async function loadData() {
      const { data, error } = await supabase
        .from('lake-mich-temp')
        .select('dateTime, temp')
        .order('dateTime', { ascending: true }); // Oldest date first, newest date last
      if (error) console.error('DB error:', error);
      else setRows(data);
    }
    loadData();
  }, []);

  if (rows.length === 0) return null; // If there is no data!

  // Creates an iterable collection of days between the given start and end dates
  const days = eachDayOfInterval({
    start: new Date(rows[0].dateTime),
    end: new Date(rows[rows.length - 1].dateTime),
  });

  return (
    <div className={styles.grid}>
      {
        // Iterates through each day in the collection
        days.map((day, index) => {
          const date = format(day, 'MMMM d, yyyy');
          // Finds the date in the rows retrieved from the DB & sets the date
          const row = rows.find((r) => format(new Date(r.dateTime), 'MMMM d, yyyy') === date);
          // & sets the temperature
          const temperature = row ? `${row.temp}°F` : 'no data';

          const style = {
            gridColumnStart: index === 0 ? getDay(day) + 1 : undefined, // Ensures start date is under the correct weekday (Sunday = column 1)
            backgroundColor: row ? getColor(row.temp) : undefined, // Calls getColor algorithm & sets color!
            border: isToday(day) ? '3px solid #1b4965' : undefined, // Adds border to today's dates
          };

          return (
            <div
              key={date} // Unique key for each day cell - React needs to tell similar objects apart
              style={style} // Sets CSS directly to specific squares - Helps when you have calculated values
              title={`${date} 🌡️ ${temperature}`} // Hover Tooltip
              className={styles.cell} // Applies standard cell styling to all cells
            />
          );
        })
      }
    </div>
  );
}
