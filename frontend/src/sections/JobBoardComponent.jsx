import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Post } from "../api/actions";
import { Post_SearchFiles_URL } from "../api/apiURL";

function JobBoardComponent(props) {
  const [searchString, setSearchString] = useState("");
  const [salaryType, setSalaryType] = useState("perAnnum");
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchAllFiles = useCallback(() => {
    try {
      Post(
        {},
        Post_SearchFiles_URL,
        (resp) => {
          console.log("Files fetched successfully", resp);
          setAllResults(resp);
          setFilteredResults(resp);
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error("Error fetching files", error);
    }
  }, []);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = allResults.filter(
      (file) =>
        file.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
        file.lastName.toLowerCase().includes(lowercasedSearchTerm) ||
        file.currentTitle.toLowerCase().includes(lowercasedSearchTerm) ||
        file.desiredJobTitle.toLowerCase().includes(lowercasedSearchTerm) ||
        file.lookingFor.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredResults(filtered);
  };

  useEffect(() => {
    handleSearch(searchString);
  }, [searchString, allResults]);

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
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  }

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: "yellow" }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const displayFilePreview = (fileType, data) => {
    if (fileType === "application/pdf") {
      return <embed src={data} width="100%" height="600px" />;
    } else if (fileType === "doc" || fileType === "docx") {
      // Render a component to display DOC file preview
    } else if (fileType.startsWith("image")) {
      return <img src={data} alt="CV" style={{ maxWidth: "100%" }} />;
    } else {
      return <p>File preview not available</p>;
    }
  };

  console.log("wrerewrerewre", expandedCard)
  return (
    <div style={{ margin: "1rem" }}>
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
            onClick={() => handleSearch(searchString)}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {searchString && (
        <Alert severity="info" style={{ marginTop: "1rem" }}>
          <Typography variant="body1">
            We searched for: {searchString}
          </Typography>
        </Alert>
      )}
      <Grid container spacing={2} style={{ marginTop: "1rem" }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Box sx={{ backgroundColor: "#E1F7FC" }}>
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
          {filteredResults.length > 0 ? (
            <>
              <Alert severity="success">
                <Typography variant="body1">
                  {filteredResults.length} results found
                </Typography>
              </Alert>
              {filteredResults?.map((result) => (
                <Card key={result.id} sx={{ margin: "1rem" }}>
                  <CardContent>
                    <Typography variant="h6">
                      {highlightText(result.firstName, searchString)}{" "}
                      {highlightText(result.lastName, searchString)}
                    </Typography>
                    <Typography variant="body1">
                      Current Job Title:{" "}
                      {highlightText(result.currentTitle, searchString)}
                    </Typography>
                    <Typography variant="body1">
                      Desired Job Title:{" "}
                      {highlightText(result.desiredJobTitle, searchString)}
                    </Typography>
                    <Typography variant="body1">
                      Salary Min: {result.salaryMin}
                    </Typography>
                    <Typography variant="body1">
                      Last Active:{" "}
                      {result.updatedAt.split("T")[0] +
                        " at " +
                        result.updatedAt.split("T")[1].split(".")[0]}
                    </Typography>
                    <Typography variant="body1">
                      Looking For:{" "}
                      {highlightText(result.lookingFor, searchString)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleExpandCard(result.id)}
                    >
                      {expandedCard === result.id
                        ? "Hide Details"
                        : "View Full Profile"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        downloadFile(
                          result.data,
                          result.fileName,
                          result.fileType
                        )
                      }
                    >
                      Download CV
                    </Button>
                  </CardActions>
                  {expandedCard === result.id && (
                   <>
                      {result.fileType === "application/pdf" ? (
                        <embed src={result.data} width="100%" height="600px" />
                      ) : result.fileType === "image/jpeg" ||
                        result.fileType === "image/png" ? (
                        <img
                          src={result.data}
                          alt="CV"
                          style={{ maxWidth: "100%" }}
                        />
                      ) : (
                        <p>File preview not available</p>
                      )}
                  </>
                  )}
                </Card>
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

