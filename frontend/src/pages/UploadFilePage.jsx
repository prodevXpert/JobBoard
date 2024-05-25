import React, { useCallback, useEffect, useState } from "react";
import { FileUploader } from "../sections";
import { Post } from "../api/actions";
import { Post_FindOne_URL } from "../api/apiURL";

function UploadFilePage(props) {
  const [fileUrl, setFileUrl] = useState("");

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const getFile = useCallback(() => {
    Post(
      {
        id: 4,
      },
      Post_FindOne_URL,
      (resp) => {
        const file = resp;
        const base64 = convertFileToBase64(
          new Blob([new Uint8Array(file.data.data)], {
            type: file.type,
          })
        );
        base64.then((data) => {
          setFileUrl(data);
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  useEffect(() => {
    getFile();
  }, [getFile]);
  return (
    <div>
      <h1>Upload File Page</h1>
      <FileUploader />
      {/* <div>
        {fileUrl ? (
          <a href={fileUrl} download>
            Download File
          </a>
        ) : (
          <p>Loading...</p>
        )}
      </div> */}
    </div>
  );
}

export default UploadFilePage;
