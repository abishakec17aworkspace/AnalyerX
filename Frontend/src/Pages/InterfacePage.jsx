import React from 'react'
import Navbar from '../Components/Navbar'
import mariola from '../assets/mariola.jpg'
import DataCollector from '../Components/DataCollector'

const InterfacePage = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${mariola})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex flex-col justify-center align-middle items-center">
        <Navbar />
        <div className='scale-75'>
        <h1 className='text-white font-light text-8xl py-3'>CSV Data Analyzer</h1>
        <p className='text-gray-400 font-light text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, accusantium quidem dolor, rem cumque magni eum aliquam laboriosam deleniti enim placeat illo optio eveniet libero iure reprehenderit! Autem enim earum cum voluptatem blanditiis sed possimus impedit aspernatur voluptatibus iure, corrupti soluta non, perferendis ducimus reprehenderit illo laudantium asperiores qui quasi!</p>
        </div>
        <div>
        <DataCollector/>
        </div>
      </div>
    </div>
  )
}

export default InterfacePage