import { useState } from "react";
import axios from 'axios';

function ImageUploader() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post("http://localhost:3003/api/uploads", formData);
            setImageUrl(`http://localhost:3003${res.data.imageUrl}`);
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
            {imageUrl && (
                <div style={{ marginTop: "10px" }}>
                    <img src={imageUrl} alt="Uploaded" width="200" />
                </div>
            )}
        </div>
    )
}
export default ImageUploader;