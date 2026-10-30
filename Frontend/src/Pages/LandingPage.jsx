import React from 'react'
import LandingPic from '../assets/Whity.jpg'
import { useNavigate } from 'react-router-dom'
import {ArrowRightCircle} from 'lucide-react'

const LandingPage = () => {
  const navi  = useNavigate()
  return (
    <div  className="relative h-screen bg-cover bg-center flex flex-row"
      style={{ backgroundImage: `url(${LandingPic})` }}>
      <div className="absolute inset-0 bg-black/5"></div>

      <div className="relative h-full z-10 flex flex-col gap-y-4 justify-end align-middle items-start pb-[2%] px-7">

      <div className='text-7xl font-light text-white hover:scale-105 duration-200 delay-100'>Analyzer X</div>
      <h2 className='text-4xl font-sans text-slate-300 '>CSV Dataset Analyzer</h2>  
      <p className='text-gray-500 font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint omnis quidem totam ducimus voluptate distinctio mollitia non explicabo aperiam consequuntur nesciunt et, magni incidunt dolorem, repellat error voluptas aut ex dicta sed sunt laboriosam velit. Sunt consequatur eaque nulla sed aliquid aut 
        saepe necessitatibus, voluptatibus repellendus harum? Molestiae, et minima?</p>
      <h1 className='flex flex-row justify-center align-middle gap-2 items-center hover:bg-white p-4 rounded-lg hover:text-gray-950  hover:scale-110 cursor-pointer bg-gray-950 text-gray-200 border-white  shadow-md  duration-200 ' onClick={()=>navi('/Interface')}> Get Started <ArrowRightCircle size={40}/> </h1>
      </div>

    </div>
  )
}

export default LandingPage
