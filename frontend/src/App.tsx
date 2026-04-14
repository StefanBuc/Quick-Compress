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
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

  const handleCompress = async () => {
    if (!file) {
      alert("Please upload a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_size_mb", String(targetSize));

    try {
      const res = await fetch(`${apiUrl}/api/upload/uploadfile/`, {
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
    <div className="font-[Lexend_Deca] flex flex-col items-center gap-6 min-h-screen pt-30 bg-linear-to-b from-[#36454D] to-[#021930]">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-2" />
      <h1 className="text-5xl font-semibold text-[#2E969E] tracking-wide drop-shadow-[0_0_5px_#2E969E]">
        Quick Compress
      </h1>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-96 h-48 border-2 border-dashed border-[#376178] rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-[#36454D] transition"
      >
        <h2 className="text-center text-[#2E969E]">
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
            className={`text-[#2E969E] border-2 border-[#376178] px-3 py-1.25 rounded-lg ${selectedType === "preset" && targetSize === size ? "bg-[#021930]" : ""} transition transform hover:scale-110 ${selectedType === "preset" && targetSize === size ? "" : "hover:bg-[#36454D]"} cursor-pointer`}
          >
            {typeof size === "number" ? `${size} MB` : size}
          </button>
        ))}
        <button
          onClick={() => {
            setTargetSize(Number(customSize));
            setSelectedType("custom");
          }}
          className={`text-[#2E969E] border-2 border-[#376178] px-3 py-1.25 rounded-lg  ${selectedType === "custom" ? "bg-[#021930]" : ""} transition transform hover:scale-110 ${selectedType === "custom" ? "" : "hover:bg-[#36454D]"} cursor-pointer`}
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
              className="w-22 border rounded px-1"
            />
            <a>MB</a>
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
        className="bg-[#021930] text-[#2E969E] px-4 py-2 rounded-lg hover:bg-[#36454D] transition transform hover:scale-110 justify-center"
      >
        Compress
      </button>
      {result && (
        <button
          onClick={() =>
            window.open(
              `${apiUrl}/api/download/file/${result}`,
              "_blank",
            )
          }
          className="bg-[#021930] text-[#2E969E] px-4 py-2 rounded-lg hover:bg-[#36454D] transition"
        >
          Download
        </button>
      )}
    </div>
  );
}
