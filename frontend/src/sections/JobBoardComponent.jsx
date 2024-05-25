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
import React, { useState } from "react";
import { Icon } from "@iconify/react";

function JobBoardComponent(props) {
  const [searchString, setSearchString] = useState(null);
  const [salaryType, setSalaryType] = useState("perAnnum");
  // create JSON to render having the id , lable and value ,  ids are : currentJobTitle , desiredJobTitle , salaryMinimum , lastActive , lookingFor
  const jobFilters = [
    {
      id: "currentJobTitle",
      label: "Current Job Title",
      value: "Financial Accountant",
    },
    {
      id: "desiredJobTitle",
      label: "Desired Job Title",
      value: "Accounting and Finance",
    },
    {
      id: "salaryMinimum",
      label: "Salary Minimum",
      value: "$100 per hour",
    },
    {
      id: "lastActive",
      label: "Last Active",
      value: "1 month ago",
    },
    {
      id: "lookingFor",
      label: "Looking For",
      value: "Full-time & part-time roles",
    },
  ];

  // funtion to check the search string in thejson values and want to highlight the values that are searched and matched in JSON
    function checkSearchString(searchString, jobFilters) {
        // only check from the current title
        const currentJobTitle = jobFilters.find(
          (filter) => filter.id === "currentJobTitle"
        );
        // check if the search string is present in the current job title
        if (currentJobTitle.value.includes(searchString)) {
          // if present then highlight the value
          currentJobTitle.value = (
            <span style={{ backgroundColor: "yellow" }}>
              {currentJobTitle.value}
            </span>
          );
        }
  // console if match
        console.log("currentJobTitle", currentJobTitle);

    }
    // call the function to check the search string in json values
    checkSearchString(searchString, jobFilters);

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
        {/* <Grid item xs={12} sm={12} md={2} lg={2}>
            <TextField
              id="outlined-basic"
              label="Within miles of"
              variant="outlined"
              fullWidth
            />
          </Grid> */}
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
          >Search</Button>
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
          {/*  a box with height and width and border  */}
          <Box
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 2,
              height: "100%",
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
                Name withheld |{" "}
              </Typography>
              {/* render the above json here with labels and values  in such a way one lable and its value in one line and second in next line and so on */}
              {jobFilters.map((filter) => (
                <div key={filter.id} style={{ display: "flex" }}>
                  <Typography
                    variant="body1"
                    sx={{ margin: "5px", minWidth: "150px" }}
                  >
                    {filter.label}:
                  </Typography>
                  <Typography variant="body1" sx={{ margin: "5px", flex: 1 }}>
                    {filter.value}
                  </Typography>
                </div>
              ))}
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
                sx={{ padding: "5px" }}
                startIcon={<Icon icon="akar-icons:download" fontSize="25px" />}
              >
                Download CV
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
export default JobBoardComponent;
