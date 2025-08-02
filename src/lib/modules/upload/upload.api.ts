import axios from "axios";

interface UploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

export async function uploadToCloudinaryApi(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append("folder", "posts");

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return {
    public_id: response.data.public_id,
    secure_url: response.data.secure_url,
    resource_type: response.data.resource_type,
  };
}
