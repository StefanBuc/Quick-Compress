import { useState } from "react";
import { useRef } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState(8);
  const [result, setResult] = useState<string | null>(null);
  const [customSize, setCustomSize] = useState("");
  const [selectedType, setSelectedType] = useState<"preset" | "custom">(
    "preset",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sizes = [5, 8, 10, 25, 50, 100];

  const handleCompress = async () => {
    if (!file) {
      alert("Please upload a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_size_mb", String(targetSize));

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/uploadfile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.compressed_filename);
      console.log("Compression result:", data);
    } catch (err) {
      console.error("Error compressing video:", err);
      alert("An error occurred compressing the video");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 place-content-center h-screen">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <h1 className="text-2xl font-bold text-center">Video Compressor</h1>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-100 h-50 border-2 p-5 rounded-2xl flex items-center justify-center cursor-pointer"
      >
        <h2 className="text-center">
          {file
            ? `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`
            : "Upload"}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center p-1 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => {
              setTargetSize(size);
              setSelectedType("preset");
            }}
            className={`border-2 px-3 py-1.25 rounded-lg ${selectedType === "preset" && targetSize === size ? "bg-blue-200" : ""} transition transform hover:scale-110 ${selectedType === "preset" && targetSize === size ? "" : "hover:bg-gray-100"} cursor-pointer`}
          >
            {typeof size === "number" ? `${size} MB` : size}
          </button>
        ))}
        <button
          onClick={() => {
            setTargetSize(Number(customSize));
            setSelectedType("custom");
          }}
          className={`border-2 px-3 py-1.25 rounded-lg  ${selectedType === "custom" ? "bg-blue-200" : ""} transition transform hover:scale-110 ${selectedType === "custom" ? "" : "hover:bg-gray-100"} cursor-pointer`}
        >
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={customSize}
              placeholder="Custom"
              onChange={(e) => {
                const val = e.target.value;
                setCustomSize(val);
                if (val !== "") {
                  setTargetSize(Number(val));
                  setSelectedType("custom");
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onFocus={() => setSelectedType("custom")}
              className="w-20 border rounded px-1"
            />
          </div>
        </button>
      </div>
      <button
        onClick={() => {
          if (targetSize <= 0) {
            alert("Please enter a valid target size greater than 0.");
            return;
          }
          handleCompress();
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-110 justify-center"
      >
        Compress
      </button>
      {result && (
        <button
          onClick={() =>
            window.open(
              `http://127.0.0.1:8000/api/download/file/${result}`,
              "_blank",
            )
          }
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Download
        </button>
      )}
    </div>
  );
}
