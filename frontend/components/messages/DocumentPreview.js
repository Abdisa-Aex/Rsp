"use client";

import {
  FileText,
  Download,
  ExternalLink,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FilePresentation,
  FileText as FileTextIcon,
} from "lucide-react";

const DocumentPreview = ({ file, theme }) => {
  const getFileIcon = () => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (["pdf"].includes(ext))
      return <FileTextIcon className="h-8 w-8 text-red-500" />;
    if (["doc", "docx"].includes(ext))
      return <FileText className="h-8 w-8 text-blue-500" />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    if (["ppt", "pptx"].includes(ext))
      return <FilePresentation className="h-8 w-8 text-orange-500" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImage className="h-8 w-8 text-purple-500" />;
    if (["mp4", "mov", "avi", "mkv"].includes(ext))
      return <FileVideo className="h-8 w-8 text-pink-500" />;
    if (["mp3", "wav", "ogg", "flac"].includes(ext))
      return <FileAudio className="h-8 w-8 text-yellow-500" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return <FileArchive className="h-8 w-8 text-gray-500" />;
    if (["js", "ts", "py", "java", "cpp", "html", "css"].includes(ext))
      return <FileCode className="h-8 w-8 text-cyan-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpen = () => {
    window.open(file.url, "_blank");
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${
        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
      } group`}
    >
      <div className="flex-shrink-0">{getFileIcon()}</div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm truncate ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          {file.name}
        </p>
        <p
          className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}
        >
          {formatFileSize(file.size)}
        </p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleOpen}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Open"
        >
          <ExternalLink className="h-4 w-4 text-gray-500" />
        </button>
        <button
          onClick={() => window.open(file.url, "_blank")}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Download"
        >
          <Download className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
