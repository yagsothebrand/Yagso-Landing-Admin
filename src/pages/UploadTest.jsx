// src/App.jsx

import { db, doc, setDoc } from "@/firebase";
import React, { useState } from "react";

const App = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !name || !category) return;

    // Create a form data to send to the backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("category", category);

    try {
      const response = await fetch(
        // "http://localhost:5000/api/upload",
        "https://osondu-server.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);
      // Assuming the server returns the relative URL after saving the image
      if (data.success) {
        console.log("Image uploaded:", data.imageUrl);
        // Save the metadata in Firebase Firestore
        await saveToFirestore(data.imageUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const saveToFirestore = async (imageUrl) => {
    try {
      // Use the image name as document ID or a unique identifier
      const docRef = doc(db, "images", name);
      await setDoc(docRef, {
        name,
        category,
        imageUrl,
        timestamp: new Date(),
      });
      console.log("Metadata saved to Firestore");
    } catch (error) {
      console.error("Error saving metadata to Firestore:", error);
    }
  };

  return (
    <div className="App">
      <h1>Upload Image</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Image Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default App;
