import Image from 'next/image';
import Calendar from '../components/calendar';
import wave from '../public/images/wave.svg';

export default function Home() {
  return (
    <main>
      <section className="start-section">
        <Image src={wave} alt="" priority />
        <p className="title">
          a living calendar of the lake
          <br />
          <a className="arrow" href="#calendar">↓</a>
        </p>
      </section>

      <section id="calendar" className="calendar-section">
        <Calendar />
      </section>
    </main>
  );
}
