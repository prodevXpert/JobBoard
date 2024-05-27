import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { Post } from "../api/actions";
import {
  Post_DeleteFile_URL,
  Post_DownloadFile_URL,
  Post_GetAllUploadedFiles_URL,
  Post_UploadFile_URL,
} from "../api/apiURL";

const Dropzone = styled("div")(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:active": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const FileUploader = () => {
  const [isMultiple, setIsMultiple] = useState(false);
  const [files, setFiles] = useState([]);
  const [payloadFiles, setPayloadFiles] = useState([
    { name: "", type: "", size: 0, data: "" },
  ]);
  const [serverFiles, setServerFiles] = useState([]);
  const theme = useTheme();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (isMultiple) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleDeleteFile = (fileIndex) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (isMultiple) {
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    } else {
      setFiles(droppedFiles);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setPayloadFiles(
      files.map((file) => ({
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2),
        data: file,
      }))
    );
  }, [files]);

  const handleUploadSingleFile = (fileIndex) => {
    console.log("filedata", payloadFiles[fileIndex].data);
    const formData = new FormData();
    formData.append("file", payloadFiles[fileIndex].data);
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");
    formData.append("location", "New York");
    formData.append("currentTitle", "Software Engineer");
    formData.append("desiredJobTitle", "Senior Software Engineer");
    formData.append("email", "john.doe@example.com");
    formData.append("phone", "123-456-7890");
    formData.append("salaryPerHour", "50");
    formData.append("salaryPerMonth", "8000");
    formData.append("salaryPerAnnum", "96000");
    formData.append("salaryMin", "5000");
    formData.append("salaryMax", "10000");
    formData.append("lookingFor", "Full-time");
    formData.append("fileType", payloadFiles[fileIndex].type);
    formData.append("fileSize", payloadFiles[fileIndex].size);
    try {
      Post(
        formData,
        Post_UploadFile_URL,
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getAllFiles = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllUploadedFiles_URL,
        (resp) => {
          console.log("resp", resp);
          // const files = resp.map((file) => ({
          //   id: file.id,
          //   name: file.name,
          //   type: file.type,
          //   data: new Uint8Array(file.data.data),
          //   createdAt: file.createdAt,
          //   updatedAt: file.updatedAt,
          // }));

          setServerFiles(resp);
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {}
  }, []);

  useEffect(() => {
    getAllFiles();
  }, [getAllFiles]);

  // const downloadFile = (file) => {
  //   console.log("file", file);

  //   try {
  //     // Create a Blob from the Uint8Array data
  //     const blob = new Blob([file.data], { type: file.type });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = file.name;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //     console.log("Download initiated successfully.");
  //   } catch (error) {
  //     console.error("Failed to download file:", error);
  //   }
  // };

  function downloadFile(base64Data, fileName, fileType) {
    // Create a Blob from the base64 data
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
}
  // console.log("files", serverFiles)

  const deleteFile = (file) => {
    try {
      Post(
        { id: file.id },
        Post_DeleteFile_URL,
        (response) => {
          console.log(response);
          getAllFiles();
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        File Uploader
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography>Single File</Typography>
        <Switch
          checked={isMultiple}
          onChange={() => setIsMultiple(!isMultiple)}
          inputProps={{ "aria-label": "multiple files switch" }}
        />
        <Typography>Multiple Files</Typography>
      </Box>
      <Dropzone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: `5px dashed ${theme.palette.primary.main}`,
          padding: theme.spacing(2),
          textAlign: "center",
          cursor: "pointer",
          borderRadius: theme.shape.borderRadius,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "&:active": {
            backgroundColor: theme.palette.action.selected,
          },
        }}
      >
        {/* <UploadFileIcon
          sx={{ fontSize: 20, color: theme.palette.primary.main }}
        /> */}
        <Typography variant="body1" gutterBottom>
          Drag and drop files here, or click to select files
        </Typography>
        <input
          type="file"
          // only accept pdf, word and img files
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple={isMultiple}
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadFileIcon />}
          >
            Select Files
          </Button>
        </label>
      </Dropzone>
      <List>
        {payloadFiles.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="space-between"
              >
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteFile(index)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="upload"
                  onClick={() => handleUploadSingleFile(index)}
                >
                  <UploadFileIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={`${file.name} (${
                file.size < 1
                  ? file.size * 1000 + " kb"
                  : file.size < 1000
                  ? file.size + " mb"
                  : file.size / 1000 + " gb"
              })`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" component="h2" gutterBottom>
        Server Files
      </Typography>
      <List>
        {serverFiles.map((file, index) => (
          <ListItem key={index}>
            <button onClick={() => downloadFile(file?.data , file?.fileName, file?.fileType)}>Download</button>
            <ListItemText primary={file?.fileName} />
            {/* Delete  */}
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                deleteFile(file);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileUploader;
