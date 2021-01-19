import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import fire from "../../fire.js";
import { createToken } from "../Authentication";
import Demo from "../Report/Demo";
import ProjectsTable from "../Tables/ProjectsTable";
import FileUpload from "./FileUpload";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Dashboard(props) {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [processing, setProcessing] = useState(null);

  const getProjects = async () => {
    const header = await createToken(props.user);
    let res = await axios.get("/getProjects", header);
    setProjects(res["data"]);
  };

  useEffect(() => {
    props.changePage("Dashboard");
    let pstatus = fire.database().ref("/" + props.user.uid);
    const l = pstatus.on("value", (d) => {
      if (d) setProcessing(d.val() ? d.val() : "No tasks running");
    });
    return () => l();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Paper className={classes.paper}>
            <FileUpload user={props.user} getProjects={getProjects} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Paper className={classes.paper}>
            Running Tasks
            <br />
            {JSON.stringify(processing)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {!props.user ? (
              <CircularProgress />
            ) : (
              <ProjectsTable
                user={props.user}
                projects={projects}
                getProjects={getProjects}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Paper className={classes.paper}>This is a Bar Plot</Paper>
          <Demo />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>xs=6 sm=3</Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
