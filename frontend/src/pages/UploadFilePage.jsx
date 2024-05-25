import React, { useCallback, useEffect, useState } from "react";
import { FileUploader } from "../sections";
import { Post } from "../api/actions";
import { Post_FindOne_URL } from "../api/apiURL";

function UploadFilePage(props) {
  const [fileUrl, setFileUrl] = useState("");

  const getFile = useCallback(() => {
    Post(
      {
        id: 1,
      },
      Post_FindOne_URL,
      (resp) => {
        const blob = new Blob([resp.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
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
      {/* <FileUploader /> */}
      <div>
        {fileUrl ? (
          <a href={fileUrl} download>
            Download File
          </a>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default UploadFilePage;
