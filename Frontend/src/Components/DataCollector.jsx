import React, { useState } from 'react'
import axios from "axios"

const DataCollector = () => {
    const [file,setFile] = useState(null)
    const Handlefile=(event)=>{
         setFile(event.target.files[0])
    }

    const HandleSubmit = async(event) =>{
        event.preventDefault() 
        if(!file){
            alert("Upload File....")
            return
        }
        const formData = new FormData()
        formData.append("dataset",file)

        try {
            const Response = await axios.post(
                "http://127.0.0.1:8000/", formData
            )

                console.log(Response.data)
                console.log("csv file uploaded sucessfully...")            
        }
        catch(error) {
            console.error("Upload error:", error)
            alert("Could not connect to backend")
        }


    }
  return (
        <div>
        <form   onSubmit={HandleSubmit}>
       <div className='bg-white w-fit h-fit  p-4 gap-y-2 flex flex-col justify-center align-middle items-center rounded-md'>
        <h1 className='text-gray-900 font-light text-4xl'>Upload the CSV Dataset</h1>
        <input  type="file"   
        onChange={Handlefile}
        className="text-gray-700 text-lg
                     file:bg-black file:text-white
                     file:px-4 file:py-2
                     file:rounded-md file:border-0
                     file:cursor-pointer
                     scale-90
                     hover:file:bg-gray-800"/>
        <button className='text-white text-lg bg-black rounded-lg p-2'  onClick={console.log("clicked")} type="submit">Submit</button>
       </div>
       </form>
    </div>
  )
}

export default DataCollector
