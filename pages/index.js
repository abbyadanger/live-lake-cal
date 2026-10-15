import Calendar from '../components/calendar';

export default function Home() {
  return (
    <div className="container">
      <img src="/images/wave.svg" />
      <p className="title">a living calendar of the lake</p>
      <p>↓</p>
      <Calendar />
    </div>
  );
}
