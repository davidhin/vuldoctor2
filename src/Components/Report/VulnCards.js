import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import "@progress/kendo-theme-material/dist/all.css";
import React, { useEffect, useState } from "react";
import CVEDialog from "./CVEDialog";
import ImportsDialog from "./ImportsDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1.5),
    color: theme.palette.text.primary,
    height: "100%",
  },
}));

const VulnCards = (props) => {
  const classes = useStyles();
  const [scan, setScan] = useState(props.scan);
  const [cveData, setCveData] = useState(props.cveData);
  const [deps, setDeps] = useState(props.deps);
  const [cweMap, setCweMap] = useState({});
  const [libMap, setLibMap] = useState({});
  const [cards, setCards] = useState([]);

  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  useEffect(() => {
    setScan(props.scan);
    setCveData(props.cveData);
    setDeps(props.deps);
    setCweMap(props.cweMap);
    setLibMap(props.libMap);
    let cveDict = props.cveData.reduce(function (map, obj) {
      map[obj.cve_id] = obj;
      return map;
    }, {});
    scan.map((s) => {
      s["predictedScore"] = -1;
      if (s.id.includes("CVE")) {
        s["cvss_score"] = cveDict[s.id]["baseScore"];
        s["severity"] = cveDict[s.id]["severity"];
        s["predictedScore"] = cveDict[s.id]["predictedScore"];
      }
    });

    let cards = groupBy(scan, "package");
    cards = Object.entries(cards);
    cards = cards.map((c) => {
      let tempcard = c;
      tempcard["totalscore"] = 0;
      c[1].forEach((cve) => {
        tempcard["totalscore"] += parseFloat(cve.cvss_score);
      });
      return c;
    });
    cards = cards.sort((a, b) => b.totalscore - a.totalscore);
    setCards(cards);
  }, [props.scan, props.cveData, props.deps, props.cweMap, props.libMap]);

  const preventDefault = (event, lib) => {
    event.preventDefault();
    window.open("https://libraries.io/" + lib);
  };

  const Container = () => {
    return (
      <Grid item container spacing={2}>
        {cards.map((e) => {
          let depname = e[0].split(":")[1];
          let importname = null;
          if (libMap[depname]) {
            if (libMap[depname].length > 0) {
              importname = libMap[depname][0].value;
            }
          }
          return (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid item container spacing={2}>
                  <Grid item xs={12} lg={8}>
                    <Typography
                      variant="h4"
                      style={{
                        fontWeight: "300",
                        display: "inline-block",
                        marginRight: "16px",
                      }}
                    >
                      {e[0]}
                    </Typography>

                    <Link
                      href="#"
                      onClick={(event) => {
                        preventDefault(event, e[0].split(":").join("/"));
                      }}
                    >
                      libraries.io
                    </Link>

                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "300",
                        display: "inline-block",
                        float: "right",
                      }}
                    >
                      Total CVSS Score:{" "}
                      {e.totalscore.toPrecision(3).replace(/\.0+$/, "")}
                    </Typography>

                    <div>
                      {e[1].map((x) => (
                        <Grid item xs={12}>
                          <Paper
                            className={classes.paper}
                            style={{
                              marginTop: "12px",
                              background: "#f5f5f5",
                            }}
                          >
                            <Grid item container>
                              <Grid item xs={4}>
                                <Typography variant="h6">{x.id}</Typography>
                                <Typography
                                  style={{
                                    marginTop: "4px",
                                    color: "rgb(0, 150, 136)",
                                    fontWeight: 800,
                                  }}
                                  variant="subtitle1"
                                >
                                  Upgrade to: {x.fix_version}
                                </Typography>
                                <Typography variant="subtitle2">
                                  Affects: {x.version}
                                </Typography>
                              </Grid>
                              <Grid item xs={5}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Package Usage: {x.package_usage}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  CWE ID: {cweMap[x.id] ? cweMap[x.id] : "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Severity: {x.severity}
                                </Typography>
                                <CVEDialog
                                  cve_id={x.id}
                                  cve_description={x.short_description}
                                  related_urls={x.related_urls}
                                  cwe_id={cweMap[x.id] ? cweMap[x.id] : null}
                                />
                              </Grid>

                              <Grid item xs={3} style={{ textAlign: "right" }}>
                                <Typography
                                  variant="overline"
                                  color="textSecondary"
                                >
                                  CVSS Score
                                </Typography>
                                <Typography
                                  style={{
                                    fontWeight: x.cvss_score * 100,
                                    color: "#ff1744",
                                  }}
                                  variant="h3"
                                >
                                  {x.cvss_score}
                                </Typography>
                                <Tooltip
                                  title="What is this? Using NLP/ML, we predict
CVSS score based on description. This can be helpful for vulnerabilities that have not
been manually assessed. *Only works with CVE*"
                                >
                                  <Typography
                                    style={{
                                      fontWeight: x.predictedScore * 100,
                                      color: "#ff1744",
                                      fontSize: "11pt",
                                    }}
                                    variant="h3"
                                  >
                                    Predicted Score: {x.predictedScore}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Typography variant="overline" color="textSecondary">
                      IMPORTS IN FILES
                    </Typography>
                    {importname ? (
                      <ImportsDialog
                        matches={libMap[depname]}
                        deps={deps[importname]}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return <Container />;
};

export default VulnCards;
