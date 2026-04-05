import { useState, useEffect, useRef } from "react";
import {
  Upload, CheckCircle, AlertCircle, FileText,
  Image, Loader2, X, Camera
} from "lucide-react";

const API = "http://localhost:4000/api";

export default function UploadPortal({ mappingId }) {
  // mappingId comes from route: /upload/:mappingId
  const id = mappingId || window.location.pathname.split("/upload/")[1];

  const [fieldInfo, setFieldInfo] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    fetch(`${API}/upload-portal/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFieldInfo(data);
        else setLoadError(data.error || "Invalid QR link.");
      })
      .catch(() => setLoadError("Could not reach server."));
  }, [id]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setUploadError(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/upload/${id}`, { method: "POST", body: form });
      const data = await res.json();
      if (data.success) setDone(true);
      else setUploadError(data.error || "Upload failed.");
    } catch {
      setUploadError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Success screen
  if (done) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Uploaded!</h1>
        <p className="text-gray-500 max-w-xs">
          Your document has been received. You can close this page.
        </p>
      </div>
    );
  }

  // Error screen
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500">{loadError}</p>
      </div>
    );
  }

  // Loading
  if (!fieldInfo) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#7C5CFC]" />
      </div>
    );
  }

  const isPDF = file && file.type === "application/pdf";

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7C5CFC] to-[#9B7DFF] px-6 pt-12 pb-8 text-white text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload size={28} />
        </div>
        <h1 className="text-2xl font-bold">Document Upload</h1>
        <p className="mt-2 opacity-80 text-sm">StockAlert Secure Portal</p>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Field info */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              You're uploading for
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-bold text-gray-900">{fieldInfo.fieldLabel}</p>
              {fieldInfo.isMandatory && (
                <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-medium">
                  Required
                </span>
              )}
            </div>
          </div>

          {/* Upload area */}
          <div className="p-5">
            {!file ? (
              <button
                onClick={() => inputRef.current.click()}
                className="w-full border-2 border-dashed border-[#7C5CFC]/30 rounded-2xl py-10 flex flex-col items-center gap-3 text-center hover:border-[#7C5CFC] hover:bg-purple-50/30 transition-all active:scale-98"
              >
                <div className="flex gap-3">
                  <Camera size={28} className="text-[#7C5CFC]" />
                  <Image size={28} className="text-[#7C5CFC]" />
                  <FileText size={28} className="text-[#7C5CFC]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Tap to select a file</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF supported</p>
                </div>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                  ) : isPDF ? (
                    <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-500">
                      <FileText size={40} className="text-[#7C5CFC]" />
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ) : null}
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow"
                  >
                    <X size={14} className="text-gray-600" />
                  </button>
                </div>

                <div className="text-sm text-gray-500 text-center">
                  <span className="font-medium text-gray-700">{file.name}</span>{" "}
                  · {(file.size / 1024).toFixed(0)} KB
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {uploadError && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">
                <AlertCircle size={14} /> {uploadError}
              </div>
            )}

            <button
              onClick={file ? handleUpload : () => inputRef.current.click()}
              disabled={uploading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#7C5CFC] hover:bg-[#6a4eea] disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-colors"
            >
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> Uploading…</>
              ) : file ? (
                <><Upload size={18} /> Submit Document</>
              ) : (
                <><Camera size={18} /> Choose File</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Secure upload · Powered by StockAlert
        </p>
      </div>
    </div>
  );
}
