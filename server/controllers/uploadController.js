import cloudinary from "../utils/cloudinary.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import Event from "../models/event.js";

// Multer memoryStorage – העלאה ישירות לזיכרון
export const uploadMiddleware = multer({ storage: multer.memoryStorage() }).single("image");

/**
 * Upload / Update Image (User avatar or Event image)
 * query:
 *   type: "avatar" | "event"
 *   id: userId או eventId
 */
export const uploadImage = async (req, res) => {
  try {
    const { type, id } = req.query;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let model, urlField, publicIdField, folder;
console.log('img-- ', type, id);

    if (type === "avatar") {
      model = User;
      urlField = "avatarUrl";
      publicIdField = "avatarPublicId";
      folder = "avatars";
    } else if (type === "event") {
      model = Event;
      urlField = "imageUrl";
      publicIdField = "imagePublicId";
      folder = "events";
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    const doc = await model.findById(id);
    if (!doc) return res.status(404).json({ message: `${type} not found` });

    // מחיקה של תמונה ישנה אם קיימת
    if (doc[publicIdField]) {
      try {
        await cloudinary.uploader.destroy(doc[publicIdField]);
      } catch (err) {
        console.warn(`Failed to delete old ${type} image:`, err);
      }
    }

    // העלאה ל-Cloudinary מה-buffer של Multer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: uuidv4(),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // עדכון במסד הנתונים
    doc[urlField] = result.secure_url;
    doc[publicIdField] = result.public_id;
    await doc.save();
    console.log('yyyyyyyyyyyyyyyyyyyy ', result.secure_url);

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
