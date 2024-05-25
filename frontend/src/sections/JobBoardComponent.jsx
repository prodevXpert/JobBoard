import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Post } from "../api/actions";
import { Post_FindOne_URL, Post_SearchFiles_URL } from "../api/apiURL";
import { convertFileToBase64 } from "../helpers/functions";

function JobBoardComponent(props) {
  const [searchString, setSearchString] = useState(null);
  const [salaryType, setSalaryType] = useState("perAnnum");
  const [results, setResults] = useState([]);

  const searchFiles = useCallback(() => {
    try {
      Post(
        { searchString, searchString },
        Post_SearchFiles_URL,
        (resp) => {
          const files = resp.map((file) => {
            console.log("file", file);
            return {
              ...file,
              name: file.fileName,
              fileType: file.fileType,
              data: new Uint8Array(file.data),
            };
          });
          setResults(files);
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error("I am catching");
    }
  }, [searchString]);
  console.log("results", results);
  useEffect(() => {
    searchFiles();
  }, [searchFiles]);

  const handleDownload = (file) => {
    try {
      Post(
        { id: file.id },
        Post_FindOne_URL,
        (resp) => {
          const fileData = resp.data; // Assuming the file data is directly available in the response
          
          // process the data buffer to download the file
  
          const blob = new Blob([fileData], { type: file.fileType });
          const url = URL.createObjectURL(blob);
  
          const a = document.createElement("a");
          a.href = url;
          a.download = file.fileName;
  
          document.body.appendChild(a);
          a.click();
  
          document.body.removeChild(a); // Clean up after download
          URL.revokeObjectURL(url);
        },
        (error) => {
          console.error("Error downloading file:", error);
        }
      );
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };
  
  return (
    <div style={{ margin: "2rem" }}>
      <br />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <TextField
            id="outlined-basic"
            label="Enter job title"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchString(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <TextField
            id="outlined-basic"
            label="Location"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <Button
            variant="outlined"
            color="primary"
            style={{ height: "100%", width: "70%" }}
            startIcon={
              <Icon icon="lets-icons:search-duotone" fontSize="25px" />
            }
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {searchString && (
        <Alert severity="info" style={{ marginTop: "1rem" }}>
          <Typography variant="body1">
            {" "}
            We searched for : {searchString}
          </Typography>
        </Alert>
      )}
      <Grid container spacing={2} style={{ marginTop: "1rem" }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Box sx={{ backgroundColor: "#E1F7FC" }}>
            {/*  center the toggle button group */}
            <Typography variant="h6" sx={{ margin: "10px" }}>
              Salary
            </Typography>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ToggleButtonGroup
                color="primary"
                exclusive
                aria-label="text alignment"
                onChange={(e, value) => setSalaryType(value)}
                value={salaryType}
                sx={{ margin: "1rem" }}
              >
                <ToggleButton value="perAnnum">Per annum</ToggleButton>
                <ToggleButton value="perHour">Per hour</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Grid container spacing={2} sx={{ margin: "1rem" }}>
              <Grid item xs={12} sm={12} mg={4} lg={4}>
                <TextField
                  id="outlined-basic"
                  label="$ Min"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} mg={4} lg={4}>
                <TextField
                  id="outlined-basic"
                  label="$ Max"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} mg={4} lg={4}>
                {/*  a go button */}
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ height: "100%", width: "70%" }}
                >
                  Go
                </Button>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          {results.length > 0 ? (
            <>
              <Alert severity="success">
                <Typography variant="body1">
                  {results.length} results found
                </Typography>
              </Alert>
              {results.map((result) => (
                <Box
                  sx={{
                    border: 1,
                    borderColor: "primary.main",
                    borderRadius: 5,
                    marginTop: "1rem",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "50%",
                      marginLeft: "5rem",
                    }}
                  >
                    <Typography variant="h6" sx={{ margin: "10px" }}>
                      {result.firstName} {result.lastName}
                    </Typography>
                    {/* render the above json here with labels and values  in such a way one lable and its value in one line and second in next line and so on */}
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", minWidth: "150px" }}
                      >
                        Current Job Title:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", flex: 1 }}
                      >
                        {result.currentTitle}
                      </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", minWidth: "150px" }}
                      >
                        Desired Job Title:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", flex: 1 }}
                      >
                        {result.desiredJobTitle}
                      </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", minWidth: "150px" }}
                      >
                        Salary Min:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", flex: 1 }}
                      >
                        {result.salaryMin}
                      </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", minWidth: "150px" }}
                      >
                        last Active:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", flex: 1 }}
                      >
                        {/* extract only Date */}
                        {result.updatedAt.split("T")[0] + ` at ` + result.updatedAt.split("T")[1].split(".")[0]}
                      </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", minWidth: "150px" }}
                      >
                        Looking For:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginRight: "23x", flex: 1 }}
                      >
                        {result.lookingFor}
                      </Typography>
                    </div>
                    <br />
                    {/*  a button to view full profile */}
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ width: "70%", margin: "1rem" }}
                    >
                      View Full Profile
                    </Button>
                  </div>
                  <div style={{ margin: "3rem" }}>
                    {/*  abutton to download CV */}
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleDownload(result)}
                      sx={{ padding: "5px" }}
                      startIcon={
                        <Icon icon="akar-icons:download" fontSize="25px" />
                      }
                    >
                      Download CV
                    </Button>
                  </div>
                </Box>
              ))}
            </>
          ) : (
            <Alert severity="error">
              <Typography variant="body1">No results found</Typography>
            </Alert>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
export default JobBoardComponent;
