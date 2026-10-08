import React, { useState } from 'react'
import axios from "axios"
import DatasetOverview from './DatasetOverview'
import { useNavigate } from 'react-router-dom'

const DataCollector = () => {
    const [file,setFile] = useState(null)
    const [datasetOverview,setDatasetoverview] = useState(null)
    const [loading,setLoading] = useState(false)
    const navi = useNavigate();

    const Handlefile=(event)=>{
        event.preventDefault()
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
            setLoading(true)
            const Response = await axios.post(
                "http://127.0.0.1:8000/Upload/", formData
            )

                console.log(Response.data)
                console.log("csv file uploaded sucessfully...")   
                
                // setDatasetoverview(Response.data)
                navi("/Dashboard",{state:{data:Response.data}})
        }
        catch(error) {
            console.error("Upload error:", error)
if (error.response) {
                console.error("Backend error:", error.response.data);
            }

            alert("Could not upload CSV file");
                }finally{
                    setLoading(false)
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
        <button className='text-white text-lg bg-black rounded-lg p-2' disabled={loading} type="submit">Submit</button>
       </div>
       </form>
       {/* {datasetOverview && <DatasetOverview data={datasetOverview}/>} */}
    </div>
  )
}

export default DataCollector
