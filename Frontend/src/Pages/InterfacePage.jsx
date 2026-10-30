import React from 'react'
import Navbar from '../Components/Navbar'
import mariola from '../assets/Port.jpg'
import DataCollector from '../Components/DataCollector'

const InterfacePage = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex flex-col "
      style={{ backgroundImage: `url(${mariola})` }}
    >
      <div className="absolute inset-0 bg-black/15"></div>
        {/* <Navbar /> */}

        <div className='absolute top-[25%] left-[35%] z-30'>
        <DataCollector/>
        </div>

        <div className="relative h-full z-10 top-0 flex flex-col justify-end align-bottom items-start">
        <div className='p-4 mb-[4%]'>
        <h1 className='text-white font-light text-3xl py-3'>CSV Data Analyzer</h1>
        <p className='text-gray-400 font-light text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, accusantium quidem dolor, rem cumque magni eum aliquam laboriosam deleniti enim placeat illo optio eveniet libero iure reprehenderit! Autem enim earum cum voluptatem blanditiis sed possimus impedit aspernatur voluptatibus iure, corrupti soluta non, perferendis ducimus reprehenderit illo laudantium asperiores qui quasi!</p>
        </div>
      </div>


    </div>
  )
}

export default InterfacePage