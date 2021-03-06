import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "@material-ui/core/Link";
import axios from "axios";
import React from "react";
import ReactMarkdown from "react-markdown";

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(false);
  const scroll = "paper";
  const [urls, setUrls] = React.useState(null);
  const [capecs, setCapecs] = React.useState(null);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSolUrls = async (cve_id) => {
    await axios
      .get(`https://cvelinks-oype6ttuha-an.a.run.app/${cve_id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setUrls(res.data);
        } else {
          setUrls(`No relevant URLs for ${cve_id}`);
        }
      })
      .catch((e) => {
        setUrls(`Error retrieving solution URLs for ${cve_id}`);
      });
  };

  const getCapecs = async (cwe_id) => {
    if (cwe_id) {
      await axios.get(`/getCapecs/${cwe_id}`).then((res) => {
        setCapecs(res.data);
      });
    }
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
      getSolUrls(props.cve_id);
      getCapecs(props.cwe_id.split("-")[1]);
    }
  }, [open]);

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen("paper")}
      >
        More Info
      </Button>
      <Dialog
        open={open}
        fullWidth={false}
        maxWidth={"md"}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{props.cve_id}</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ReactMarkdown>
              {props.cve_description
                ? props.cve_description.replace("###", "### ")
                : ""}
            </ReactMarkdown>
            {urls === null ? (
              <CircularProgress />
            ) : (
              <div>
                {typeof urls !== "string" ? (
                  <div>
                    <Typography variant="h6">References:</Typography>
                    {urls.map((x) => {
                      return (
                        <div>
                          <Link href={x[0]}>{x[0]}</Link> Has solution:{" "}
                          {x[1].toString()}
                          <br />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  urls
                )}
              </div>
            )}
            <br />
            {capecs === null ? (
              <CircularProgress />
            ) : (
              <div>
                {capecs.length === 0 ? (
                  <p>{`No CAPECs for ${props.cwe_id}`}</p>
                ) : (
                  <div>
                    <Typography variant="h6">
                      CAPECs for {props.cwe_id}:
                    </Typography>
                    {capecs.map((x) => (
                      <p>
                        <Link
                          href={`https://capec.mitre.org/data/definitions/${x.capec_id}.html#Mitigations`}
                        >
                          <Typography variant="h7">
                            {"CAPEC-" + x.capec_id + ": "}
                          </Typography>
                          <Typography variant="body">{x.capec_name}</Typography>
                        </Link>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
