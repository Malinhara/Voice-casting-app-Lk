// src/hooks/useMediaStore.js
import { useEffect, useState } from "react";
import { uploadFileToFirebase } from "./useFirebaseUpload";
import { deleteFile, getUserFiles, saveFileRecord } from "../api/media";

export default function useMediaStore(userId) {
  const [voiceFiles, setVoiceFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Fetch user files on mount

const fetchFiles = async () => {
  try {
    const data = await getUserFiles(userId); // now always has imageUrl & audioUrl

    setVoiceFiles(
      data.audioUrl.map((url) => ({
        url,
        name: decodeURIComponent(url.split("/").pop()),
        uploadedAt: new Date(data.uploadedAt).toLocaleString(),
      }))
    );

    setImageFiles(
      data.imageUrl.map((url) => ({
        url,
        name: decodeURIComponent(url.split("/").pop()),
        uploadedAt: new Date(data.uploadedAt).toLocaleString(),
      }))
    );
  } catch (err) {
    console.error("Error fetching files:", err);
  }
};

useEffect(() => {
  if (userId) fetchFiles();
}, [userId]);

useEffect(() => {
  if (userId) fetchFiles();
}, [userId]);


  // Delete file
const handleDelete = async (file, type) => {
  try {
    // Await the deletion API call
    const res = await deleteFile(userId, file.url, type);

    if (res.success) { // assuming your API returns { success: true }
      if (type === "voice") {
        setVoiceFiles((prev) => prev.filter((f) => f.url !== file.url));
      } else {
        setImageFiles((prev) => prev.filter((f) => f.url !== file.url));
      }
    } else {
      console.error("Delete failed on server:", res.message);
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  

  // Upload file
const handleUpload = async (files, type) => {
  if (!files?.length) return [];

  for (let file of files) {
    try {
      // Upload to Firebase
      const url = await uploadFileToFirebase(file, type, (progress) => {
        console.log(`Upload progress for ${file.name}: ${progress.toFixed(1)}%`);
      });

      // Construct local file object
      const newFile = {
        name: file.name,
        url,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };

      // Update local state
      if (type === "voice") setVoiceFiles((prev) => [...prev, newFile]);
      else setImageFiles((prev) => [...prev, newFile]);

      // Save record to backend
      await saveFileRecord(userId, url, type);


    } catch (err) {
      console.error("Upload failed for file:", file.name, err);
    }
  }
};


  return {
    imageFiles,
    voiceFiles,
    handleDelete,
    handleUpload,
    fetchFiles,
    setImageFiles, // <-- make sure these are returned
    setVoiceFiles, // <-- make sure these are returned
  };
};



  // // Delete file
  // const handleDelete = async (file, type) => {
  //   try {
  //       const res =  deleteFile(userId, url, type);

  //     if (type === "voice") {
  //       setVoiceFiles((prev) => prev.filter((f) => f.url !== file.url));
  //     } else {
  //       setImageFiles((prev) => prev.filter((f) => f.url !== file.url));
  //     }
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };  
  // 
  
// Fetch project-specific media
// const fetchProjectMedia = async (projectId) => {
//   if (!projectId) return null;
//   try {
//     const res = await fetch(`http://localhost:4000/user/projects/${projectId}/media`);
//     const data = await res.json();

//     if (data) {
//       setVoiceFiles(
//         data.audioUrl?.map((url) => ({
//           url,
//           name: url.split("/").pop(),
//           uploadedAt: new Date().toLocaleString(),
//         })) || []
//       );
//       setImageFiles(
//         data.imageUrl?.map((url) => ({
//           url,
//           name: url.split("/").pop(),
//           uploadedAt: new Date().toLocaleString(),
//         })) || []
//       );
//     }

//     // Return data so useEffect can use it
//     return data;
//   } catch (err) {
//     console.error("Error fetching project media:", err);
//     return null;
//   }
// };