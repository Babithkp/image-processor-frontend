import axios from "axios";

// const baseUrl = "http://localhost:3000";
const baseUrl = "https://image-processor-backend.vercel.app";


export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${baseUrl}/upload`, formData, { 
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getFileSizeFromUrl = async (url: string) => {
  try {
    // Fetch the image data from the URL
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    // Get the size of the file from the response
    const fileSize = Buffer.byteLength(response.data);
    return fileSize;
  } catch (error) {
    console.error('Error fetching the file:', error);
  }
};