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
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    border: "3px groove gray",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: "3px groove black",
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

        <h2 className="bg-dark text-light text-center mt-1">
          {data?.[0]?.Circuit.circuitName} |{" "}
          {data?.[0]?.Circuit.Location.locality} /{" "}
          {data?.[0]?.Circuit.Location.country}
        </h2>

        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    <TableSortLabel
                      active={true}
                      direction={orderDirection}
                      onClick={handleSortRequest}
                      sx={{ fontSize: 18 }}
                    >
                      SEASON
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    R
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    DATE
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    WINNER
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    CONSTRUCTOR
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    G
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    L
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    TIME
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontSize: 18 }}>
                    Fastest Lap
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      className="cp text-center"
                      onClick={() => navigate("/F1/" + row.season)}
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
                    <StyledTableCell>
                      {row.Results[0].Time?.time}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.Results[0].FastestLap ? (
                        <h6 className="text-center">
                          <span className="text-danger">
                            {row.Results[0].FastestLap?.rank}.{" "}
                          </span>
                          [{row.Results[0].FastestLap?.Time?.time}] [
                          {row.Results[0].FastestLap?.AverageSpeed?.speed}{" "}
                          <span className="text-secondary pe-1">
                            {row.Results[0].FastestLap?.AverageSpeed?.units}
                          </span>
                          ]
                        </h6>
                      ) : (
                        <h6 className="text-info fw-bold text-center">
                          Data Not Found!
                        </h6>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </div>
    );
  }
};

export default Circuit;
