import React, { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";
import { storage } from '../firebase'; // or wherever your firebase.js file is
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';


const ImageUploadComponent = ({ onImagesUploaded ,blogname}) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      // const uploadedImages = [];
      let uploadedImages = [...images]; // start with the existing images

      for (const file of files) {
        // Compress the image
        const options = {
          maxSizeMB: 0.1, // (default: Number.POSITIVE_INFINITY)
          maxWidthOrHeight: 1920, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
          useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
        };
        const compressedFile = await imageCompression(file, options);

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-11

        // const storageRef = ref(storage, `/news/${year}/${month}/${file.name}`);
        const randomNum = Math.floor(Math.random() * 900) + 100;

        const filename = `${blogname}-${month}-${year}-${randomNum}.jpg`;

        const storageRef = ref(storage, `/news/${year}/${month}/${filename}`); 

        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              // You can add progress reporting here if you want
            },
            (error) => {
              reject(error);
            },
            () => {
              resolve();
            }
          );
        });

        const fileUrl = await getDownloadURL(storageRef);
        uploadedImages.push(fileUrl);
      }
      setImages(uploadedImages);
      setIsUploading(false);
      if (onImagesUploaded) {
        onImagesUploaded(uploadedImages);
      }
    }
  }

  // function handleFileSave(event) {
  //   event.preventDefault(); // Prevent the event from bubbling up
  //   onImagesUploaded(images);
  // }


  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  return (
    <div className="mb-2 flex flex-wrap gap-1">
      <ReactSortable
        list={images}
        className="flex flex-wrap gap-1"
        setList={updateImagesOrder}>
        {images.map((src, index) => (
          <div key={index} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={src} alt="" className="rounded-lg w-full h-full object-cover" />
          </div>
        ))}
      </ReactSortable>
      {isUploading && (
        <div className="h-24 flex items-center">
          <Spinner />
        </div>
      )}
      <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div>
          Add image
        </div>
        <input type="file" multiple onChange={uploadImages} className="hidden" />
      </label>
      {/* <button onClick={handleFileSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Save</button> */}
    </div>
  );
};

export default ImageUploadComponent;
