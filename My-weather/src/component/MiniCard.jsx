import React, { useEffect, useState } from 'react'
import { useDate } from '../utiils/useDate'
import sun from '../assets/icons/sun.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import storm from '../assets/icons/storm.png'
import { useStateContext } from '../Context'

const MiniCard = ({ time, iconString, temperature }) => {
  const [icon, setIcon] = useState();
  const { theme } = useStateContext();

  useEffect(() => {
    if (!iconString) return;

    if (iconString.includes('10') || iconString.includes('09')) {
      setIcon(rain);
    } else if (iconString.includes('13')) {
      setIcon(snow);
    } else if (iconString.includes('02') || iconString.includes('03') || iconString.includes('04')) {
      setIcon(cloud);
    } else if (iconString.includes('50')) {
      setIcon(fog);
    } else if (iconString.includes('11')) {
      setIcon(storm);
    } else if (iconString.includes('01')) {
      setIcon(sun);
    } else {
      setIcon(sun); 
    }
  }, [iconString]);

  const textColor = theme === 'day' ? 'text-gray-800' : 'text-white';
  const subTextColor = theme === 'day' ? 'text-gray-600' : 'text-white/80';
  const cardBg = theme === 'day'
    ? 'bg-white/40 border-white/50 hover:bg-white/60 shadow-lg'
    : 'bg-white/10 border-white/30 hover:bg-white/15 shadow-xl';

  return (
    <div className={`backdrop-blur-md p-6 rounded-xl border transition-all duration-300 hover:scale-105 min-w-[160px] ${cardBg}`}>
      <div className='flex flex-col items-center gap-3'>

        <p className={`${textColor} text-lg font-bold uppercase tracking-wider`}>
          {new Date(time * 1000).toLocaleDateString('en', { weekday: 'short' })}
        </p>


        <p className={`${subTextColor} text-sm`}>
          {new Date(time * 1000).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>


        <div className='flex justify-center items-center my-2'>
          <img src={icon} alt="weather icon" className='w-20 h-20 drop-shadow-lg' />
        </div>

        <p className={`${textColor} text-3xl font-extrabold`}>{Math.round(temperature)}&deg;C</p>
      </div>
    </div>
  )
}

export default MiniCard