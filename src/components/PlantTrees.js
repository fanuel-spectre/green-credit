import React, { useState } from "react";
import { auth, db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

function PlantTrees() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!beforeImage || !afterImage) {
      return toast.error("Please upload both before and after images");
    }

    setLoading(true);
    const user = auth.currentUser;

    try {
      // Upload images to Firebase Storage
      const beforeRef = ref(
        storage,
        `tree-submissions/${user.uid}/${Date.now()}-before.jpg`
      );
      const afterRef = ref(
        storage,
        `tree-submissions/${user.uid}/${Date.now()}-after.jpg`
      );

     console.log("Uploading BEFORE image...");
     const beforeSnap = await uploadBytes(beforeRef, beforeImage);
     console.log("BEFORE uploaded");

     console.log("Uploading AFTER image...");
     const afterSnap = await uploadBytes(afterRef, afterImage);
     console.log("AFTER uploaded");

     console.log("Getting URLs...");
     const beforeUrl = await getDownloadURL(beforeSnap.ref);
     const afterUrl = await getDownloadURL(afterSnap.ref);

     console.log("Saving to Firestore...");
     await addDoc(collection(db, "TreeSubmissions"), {
       userId: user.uid,
       beforeUrl,
       afterUrl,
       status: "pending",
       createdAt: serverTimestamp(),
     });
     console.log("Submitted!");


      toast.success("Submission uploaded! Pending approval.");
      setBeforeImage(null);
      setAfterImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🌳 Plant Trees Activity</h2>

      <div style={styles.uploadBox}>
        <label style={styles.label}>Upload BEFORE Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeImage(e.target.files[0])}
        />
        {beforeImage && (
          <img
            src={URL.createObjectURL(beforeImage)}
            alt="Before"
            style={styles.preview}
          />
        )}
      </div>

      <div style={styles.uploadBox}>
        <label style={styles.label}>Upload AFTER Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAfterImage(e.target.files[0])}
        />
        {afterImage && (
          <img
            src={URL.createObjectURL(afterImage)}
            alt="After"
            style={styles.preview}
          />
        )}
      </div>

      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Submit for Approval"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#e6f4ea",
    minHeight: "100vh",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    color: "#276749",
    marginBottom: "20px",
  },
  uploadBox: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  preview: {
    width: "200px",
    height: "auto",
    borderRadius: "8px",
    marginTop: "10px",
  },
  button: {
    backgroundColor: "#276749",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default PlantTrees;
