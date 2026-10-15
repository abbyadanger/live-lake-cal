import Image from 'next/image';
import Calendar from '../components/calendar';
import wave from '../public/images/wave.svg';

export default function Home() {
  return (
    <div className="container">
      <Image src={wave} alt="" priority />
      <p className="title">a living calendar of the lake</p>
      <p>↓</p>
      <Calendar />
    </div>
  );
}
