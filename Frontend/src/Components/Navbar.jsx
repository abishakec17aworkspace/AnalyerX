import React from 'react'

const Navbar = () => {
  return (
    <div className="w-full h-fit flex flex-row justify-between p-4 align-middle items-center bg-black/40 backdrop-blur-md scale-90 relative top-7 rounded-xl">
        <div>
        <h1 className='text-gray-500 font-serif text-3xl'>AnalyzerX</h1>
        </div>

        <div>
            <ul className='flex flex-row justify-center align-middle text-xs gap-2'>
                <li className='hover:scale-125 hover:-translate-y-2 px-6 hover:text-white text-gray-600 duration-150 delay-75 '>Analyzer</li>
                <li className='hover:scale-125 hover:-translate-y-2 px-6 hover:text-white text-gray-600 duration-150 delay-75 '>Preview</li>
                <li className='hover:scale-125 hover:-translate-y-2 px-6 hover:text-white text-gray-600 duration-150 delay-75 '>About</li>
            </ul>
        </div>

        <div>
            <h1 className='text-2xl font-semibold text-violet-700'>Profile</h1>
        </div>
    </div>
  )
}

export default Navbar
