import React, { useState } from 'react'

const DataCollector = () => {
    const [file,setFile] = useState(null)
    const Handlefile=(event)=>{
         setFile(event.target.files[0])
    }

    const HandleSubmit = async() =>{
        if(!file){
            alert("Upload File....")
            return
        }
        const FormData = new FormData()
        FormData.append("dataset",file)

        try {
            const Response = await fetch(
                "",{
                    method:"POST",
                    body:FormData
                }
            )

            const data = await Response.json()
            
            if(Response.ok){
                console.log(data)
                console.log("csv file uploaded sucessfully...")
                return
            }else{
                alert(data.message || "upload Failed")
            }
            
        }
        catch(error) {
            console.error("Upload error:", error)
            alert("Could not connect to backend")
        }


    }
  return (
        <div>
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
                     <button className='text-white text-lg bg-black rounded-lg p-2' onSubmit={HandleSubmit} type="submit">Submit</button>
       </div>
    </div>
  )
}

export default DataCollector
