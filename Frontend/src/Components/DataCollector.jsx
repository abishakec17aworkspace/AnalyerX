
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function DataCollector() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setError("Please upload a CSV file only.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    setSuccess("");

    const input = document.getElementById("dataset-file");
    if (input) input.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("dataset", file);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${API_URL}/Upload/`,
        formData
      );

      const uploadedData = response.data;

      if (!uploadedData?.dataset_id) {
        throw new Error(
          "Upload succeeded, but the backend did not return dataset_id. Update your Upload API to store the dataset and return its ID."
        );
      }

      if (!uploadedData?.overview) {
        throw new Error(
          "The backend response does not contain the dataset overview."
        );
      }

      // Store the complete backend response.
      sessionStorage.setItem(
        "uploadeddata",
        JSON.stringify(uploadedData)
      );

      setSuccess("Dataset uploaded successfully!");

      // Navigate to the cleaning page.
      navigate("/CleaningPage", {
        state: { data: uploadedData },
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      const message =
        err.response?.data?.detail ||
        err.message ||
        "Unable to upload the dataset.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-wide">
            Dataset Upload
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Upload your CSV dataset to begin analyzing and cleaning
            your data.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/50 p-8 shadow-xl backdrop-blur-md">

          <label
            htmlFor="dataset-file"
            className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500/40 bg-blue-500/5 p-8 text-center transition hover:border-blue-400 hover:bg-blue-500/10"
          >
            <div className="mb-5 rounded-full bg-blue-500/15 p-5">
              <Upload size={36} className="text-blue-400" />
            </div>

            <h2 className="text-lg font-semibold">
              Choose your CSV dataset
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Click here to browse files from your computer
            </p>

            <p className="mt-4 text-xs text-gray-500">
              Supported format: .csv
            </p>

            <input
              id="dataset-file"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">

              <div className="flex min-w-0 items-center gap-3">
                <FileSpreadsheet
                  size={30}
                  className="shrink-0 text-green-400"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={loading}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                title="Remove file"
              >
                <X size={20} />
              </button>

            </div>
          )}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              <CheckCircle size={20} />
              <p>{success}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Uploading Dataset...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload Dataset
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

export default DataCollector;
