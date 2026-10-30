// import React, { useState } from 'react'
// import axios from "axios"
// import DatasetOverview from './DatasetOverview'
// import { useNavigate } from 'react-router-dom'

// const DataCollector = () => {
//     const [file,setFile] = useState(null)
//     const [datasetOverview,setDatasetoverview] = useState(null)
//     const [loading,setLoading] = useState(false)
//     const navi = useNavigate();

//     const Handlefile=(event)=>{
//         event.preventDefault()
//          setFile(event.target.files[0])
//     }

//     const HandleSubmit = async(event) =>{
//         event.preventDefault() 
//         if(!file){
//             alert("Upload File....")
//             return
//         }
//         const formData = new FormData()
//         formData.append("dataset",file)

//         try {
//             setLoading(true)
//             const Response = await axios.post(
//                 "http://127.0.0.1:8000/Upload/", formData
//             )

//                 console.log(Response.data)
//                 console.log("csv file uploaded sucessfully...")   
                
//                 // setDatasetoverview(Response.data)
//                 navi("/Dashboard",{state:{data:Response.data}})
//         }
//         catch(error) {
//             console.error("Upload error:", error)
// if (error.response) {
//                 console.error("Backend error:", error.response.data);
//             }

//             alert("Could not upload CSV file");
//                 }finally{
//                     setLoading(false)
//                 }


//     }
//   return (
//         <div>
//         <form   onSubmit={HandleSubmit}>
//        <div className='bg-white w-fit h-fit  p-4 gap-y-2 flex flex-col justify-center align-middle items-center rounded-md'>
//         <h1 className='text-gray-900 font-light text-4xl'>Upload the CSV Dataset</h1>
//         <input  type="file"   
//         onChange={Handlefile}
//         className="text-gray-700 text-lg
//                      file:bg-black file:text-white
//                      file:px-4 file:py-2
//                      file:rounded-md file:border-0
//                      file:cursor-pointer
//                      scale-90
//                      hover:file:bg-gray-800"/>
//         <button className='text-white text-lg bg-black rounded-lg p-2' disabled={loading} type="submit">Submit</button>
//        </div>
//        </form>
//        {/* {datasetOverview && <DatasetOverview data={datasetOverview}/>} */}
//     </div>
//   )
// }

// export default DataCollector


import React, { useState, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Upload, UploadIcon } from 'lucide-react'

const DataCollector = () => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const fileInputRef = useRef(null)
    const navi = useNavigate()

    // Open file picker
    const HandleUploadClick = () => {
        fileInputRef.current?.click()
    }

    // Select CSV file
    const Handlefile = (event) => {
        const selectedFile = event.target.files?.[0]

        if (selectedFile) {
            if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
                alert("Please select a CSV file")
                event.target.value = ''
                setFile(null)
                return
            }

            setFile(selectedFile)
        }
    }

    // Upload CSV to FastAPI
    const HandleSubmit = async (event) => {
        event.preventDefault()

        if (!file) {
            alert("Please select a CSV file first")
            return
        }

        const formData = new FormData()
        formData.append("dataset", file)

        try {
            setLoading(true)

            const response = await axios.post(
                "http://127.0.0.1:8000/Upload/",
                formData
            )

            console.log("CSV uploaded successfully:", response.data)

            sessionStorage.setItem("uploadeddata",JSON.stringify(response.data))

            navi("/Dashboard")

        } catch (error) {
            console.error("Upload error:", error)

            if (error.response) {
                console.error("Backend error:", error.response.data)
                alert(`Upload failed: ${JSON.stringify(error.response.data)}`)
            } else {
                alert("Cannot connect to the backend. Check whether FastAPI is running.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center align-middle items-center">

            <form onSubmit={HandleSubmit}>

                <div className="w-96 min-h-72 p-6 backdrop-blur-lg
                    flex flex-col justify-center items-center
                    gap-4 rounded-xl border-2 border-dashed
                    border-violet-300 hover:border-violet-500
                    transition-colors">

                    {/* Clickable Upload Area */}
                    <button
                        type="button"
                        onClick={HandleUploadClick}
                        className="flex flex-col items-center gap-3
                            cursor-pointer focus:outline-none
                            rounded-lg p-2"
                    >
                        <PlusCircle
                            size={64}
                            strokeWidth={1.5}
                            className="text-white"
                        />

                        <span className="text-white text-2xl font-medium">
                            Upload CSV Dataset
                        </span>

                        {/* <span className="text-gray-500 text-sm">
                            Click here to select your CSV file
                        </span> */}
                    </button>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        id="csv-upload"
                        type="file"
                        accept=".csv,text/csv"
                        onChange={Handlefile}
                        className="hidden"
                    />

                  

                </div>

            {/* Selected Filename */}
                    {file && (
                        <div className='flex flex-row mt-2'>
                        <p className=" flex flex-row gap-2 justify-center align-middle items-center text-sm text-white rounded-lg p-3 text-center break-all">
                            <span className='text-white font-semibold text-xl'>File :</span> <p className='bg-slate-950/80 p-3 rounded-lg'>{file.name}</p>
                        </p>

                         {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="text-white text-lg bg-violet-600
                            hover:bg-violet-700 rounded-2xl px-6 py-2
                            transition-colors disabled:opacity-50 
                            disabled:cursor-not-allowed scale-90"
                    >
                        {loading ? "Uploading..." : <UploadIcon/>}
                    </button>
                    </div>
                    )}


             
                       </form>

        </div>
    )
}

export default DataCollector
