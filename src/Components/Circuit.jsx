import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { TableSortLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import Nav from "./Nav";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  margin: 0,

  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.info.dark,
    border: "4px groove gray",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: "3px groove black",
    padding: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child": {
    border: "3px groove black",
  },
}));

const Circuit = (props) => {
  const navigate = useNavigate();
  const { cname = "Austrian Grand Prix" } = useParams();
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orderDirection, setOrderDirection] = useState("asc");
  const todate = (d) =>
    new Date(d).toLocaleString("en-EN", { dateStyle: "long" });

  const url = `${BASE_URL}/circuits/${cname}/results/1.json?limit=100`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const items = await response.json();
        const fetchedData = items["MRData"].RaceTable.Races;
        const sortedData = [...fetchedData].sort((a, b) => b.season - a.season);

        setData(sortedData);
        setIsLoaded(true);
      } catch (err) {
        setIsLoaded(true);
        console.error(err.message);
      }
    };
    fetchData();
  }, [url]);

  const handleSortRequest = () => {
    const isAsc = orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");

    const sortedData = [...data].sort((a, b) => {
      if (isAsc) {
        return a.season - b.season;
      } else {
        return b.season - a.season;
      }
    });

    setData(sortedData);
  };

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid p-0">
        <Nav />

        <h2 className="bg-dark text-warning text-center mt-1">
          {data?.[0]?.Circuit.circuitName} [
          {data?.[0]?.Circuit.Location.locality}/
          {data?.[0]?.Circuit.Location.country}]
        </h2>

        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TableContainer component={Paper} sx={{ paddingX: 2 }}>
            <Table
              aria-label="simple table"
              sx={{ borderCollapse: "separate", borderSpacing: "0 1px" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    <TableSortLabel
                      active={true}
                      direction={orderDirection}
                      onClick={handleSortRequest}
                      sx={{
                        fontSize: 18,
                        color: "info.main",
                        "&.Mui-active": {
                          color: "info.main",
                        },
                        "& .MuiTableSortLabel-icon": {
                          color: "info.main !important",
                        },
                      }}
                    >
                      SEASON
                    </TableSortLabel>
                  </StyledTableCell>

                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    R
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>DATE</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>
                    WINNER
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 18 }}>TEAM</StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    G
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    L
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ fontSize: 18 }}>
                    TIME
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ fontSize: 18 }}>
                    FASTEST LAP
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row, index) => {
                  const result = row.Results[0];
                  const {
                    AverageSpeed: averageSpeed,
                    Time: time,
                    lap,
                    rank,
                  } = result?.FastestLap || {};
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        className="cp text-center"
                        onClick={() =>
                          navigate("/F1Race/" + row.season + "/" + row.round)
                        }
                      >
                        {row.season}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.round}
                      </StyledTableCell>
                      <StyledTableCell>{todate(row.date)}</StyledTableCell>
                      <StyledTableCell>
                        {row.Results[0].Driver.givenName}{" "}
                        {row.Results[0].Driver.familyName.toUpperCase()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.Results[0].Constructor.name.toUpperCase()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.Results[0].grid}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.Results[0].laps}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.Results[0].Time?.time}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {result?.FastestLap ? (
                          <div className="">
                            {rank && (
                              <span className="text-danger fw-bold me-1">
                                {rank}.
                              </span>
                            )}
                            {time?.time && (
                              <span className="text-success fw-semibold me-1">
                                ⏱ {time.time}
                              </span>
                            )}
                            {averageSpeed && (
                              <span>
                                🚀 {averageSpeed.speed} {averageSpeed.units}
                              </span>
                            )}
                            {lap && (
                              <span className="text-info fw-semibold ms-1">
                                Lap {lap}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-info fw-bold text-center">-</div>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </div>
    );
  }
};

export default Circuit;
