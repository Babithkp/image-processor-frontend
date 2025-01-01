import { useRef, useState } from "react";
import { uploadImage } from "./api/uploadImage";
function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mobileImage, setMobileImage] = useState<string | null>(null);
  const [mobileImageSize, setMobileImageSize] = useState<number | null>(null);
  const [tabletImage, setTabletImage] = useState<string | null>(null);
  const [tabletImageSize, setTabletImageSize] = useState<number | null>(null);
  const [desktopImage, setDesktopImage] = useState<string | null>(null);
  const [desktopImageSize, setDesktopImageSize] = useState<number | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUploadClick = () => {
    uploadRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      try {
        setLoading(true);
        const result = await uploadImage(file);
        setLoading(false);
        const originalImg = decodeURIComponent(result.originalFileUrl);
        const mobileImg = decodeURIComponent(result.resizedImageUrls.mobile);
        const tabletImg = decodeURIComponent(result.resizedImageUrls.laptop);
        const desktopImg = decodeURIComponent(result.resizedImageUrls.desktop);
        setImage(originalImg);
        setMobileImage(mobileImg);
        setTabletImage(tabletImg);
        setDesktopImage(desktopImg);
        if (mobileImageSize && tabletImageSize && desktopImageSize) {
          setMobileImageSize(mobileImageSize);
          setTabletImageSize(tabletImageSize);
          setDesktopImageSize(desktopImageSize);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <main className="flex flex-col h-screen gap-10 px-10">
      <h1 className="text-3xl font-bold underline text-center">
        Image Processoring App
      </h1>
      <p>{loading ? "Loading..." : ""}</p>
      <div className="flex gap-10 max-lg:flex-col">
        <div className="border w-1/2 p-5 rounded-lg flex flex-col gap-5 h-fit max-lg:w-full">
          <h2 className="text-2xl font-bold">
            Image Upload Here to get Processed
          </h2>
          <div className=" w-full">
            {image && <img src={image} alt="" className="h-full w-full" />}
          </div>
          <input
            type="file"
            className="hidden"
            ref={uploadRef}
            onChange={handleImageUpload}
            accept="image/*"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleImageUploadClick}
            disabled={loading}
          >
            Upload Image
          </button>
        </div>
        <div className="border w-1/2 p-5 rounded-xl flex flex-col gap-10 h-fit max-lg:w-full">
          <h2 className="text-2xl font-bold">Here is the processed image</h2>
          {mobileImage && tabletImage && desktopImage && <> 
            <div>
              <p className="text-xl font-bold">
                Mobile View {mobileImageSize ? `${mobileImageSize} bytes` : ""}
              </p>
              {mobileImage && (
                <img src={mobileImage} alt="" className="h-full w-full" />
              )}
            </div>
            <div>
              <p className="text-xl font-bold">
                Tablet View {tabletImageSize ? `${tabletImageSize} bytes` : ""}
              </p>
              {tabletImage && (
                <img src={tabletImage} alt="" className="h-full w-full" />
              )}
            </div>
            <div>
              <p className="text-xl font-bold">
                Desktop View{" "}
                {desktopImageSize ? `${desktopImageSize} bytes` : ""}
              </p>
              {desktopImage && (
                <img src={desktopImage} alt="" className="h-full w-full" />
              )}
            </div>
          </>}
        </div>
      </div>
    </main>
  );
}

export default App;
