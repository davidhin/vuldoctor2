import MaterialTable from "@material-table/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TABLEICONS } from "./tableIcons";

const ProjectsTable = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let filter_projects = [];
    props.projects.forEach((p) => {
      if (!p.repoid) {
        filter_projects.push(p);
      } else {
        if (p.checked) {
          filter_projects.push(p);
        }
      }
    });
    setData(filter_projects);
    setLoading(props.loading);
  }, [props.projects, props.loading]);

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        icons={TABLEICONS}
        columns={[
          { title: "Scheduled Run", field: "autorepo", editable: "never" },
          { title: "Project Name", field: "name", editable: "onUpdate" },
          { title: "High severity", field: "high_sev", editable: "never" },
          { title: "Med severity", field: "med_sev", editable: "never" },
          { title: "Low severity", field: "low_sev", editable: "never" },
          { title: "Last Checked", field: "date", editable: "never" },
          { title: "Status", field: "status", editable: "never" },
        ]}
        data={data}
        title="Projects"
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          padding: "dense",
        }}
        isLoading={loading}
        editable={{
          isDeletable: (rowData) => rowData.status === "Complete",
          onRowUpdate: async (newData, oldData) => {
            const dataUpdate = [...data];
            dataUpdate[oldData.tableData.id] = newData;
            setData([...dataUpdate]);
            await axios.put("/updateProjectName", newData, props.auth_header);
          },
          onRowDelete: async (oldData) => {
            const dataDelete = [...data];
            dataDelete.splice(oldData.tableData.id, 1);
            setData([...dataDelete]);
            props.updateVulns([...dataDelete]);
            await axios.delete("/deleteProject", {
              data: oldData,
              headers: props.auth_header["headers"],
            });
          },
        }}
        actions={[
          (rowData) => ({
            icon: TABLEICONS.ViewProject,
            tooltip: "View Project",
            onClick: (event, row) => history.push(`/report/${row.pid}`),
            disabled: rowData.status !== "Complete" || rowData.date === "Never",
          }),
          (rowData) => ({
            icon: TABLEICONS.History,
            tooltip: "View History",
            onClick: (event, row) => history.push(`/history/${row.pid}`),
            disabled: !rowData.history,
          }),
          (rowData) => ({
            icon: TABLEICONS.Reload,
            tooltip: "Run Analysis",
            onClick: (event, row) => {
              const depCheckURL = `https://depscan-oype6ttuha-an.a.run.app/run_github`;
              setLoading(true);
              axios.post(depCheckURL, row, props.auth_header).then((result) => {
                console.log(result);
              });
            },
            disabled: rowData.status !== "Complete" || !rowData.repoid,
          }),
          (rowData) => ({
            icon: TABLEICONS.Lightbulb,
            tooltip: "Toggle scheduled run",
            onClick: (event, row) => {
              setLoading(true);
              axios
                .put(
                  "/updateProjectAuto",
                  {
                    pid: row.pid,
                    repoid: row.repoid,
                    autorepo: !row.autorepo,
                  },
                  props.auth_header
                )
                .then(() => {
                  props.setProjProc({ val: () => null }, props.auth_header);
                });
            },
            disabled: !rowData.repoid,
          }),
        ]}
      />
    </div>
  );
};

export default ProjectsTable;
