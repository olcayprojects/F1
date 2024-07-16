import React from "react";
import { useEffect, useState } from "react";
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
  // TablePagination,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { TableSortLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
// import { ClassNames } from "@emotion/react";
import Nav from "./Nav";

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
  //  last border
  "&:last-child": {
    border: "3px groove black",
  },
}));

const Circuit = (props) => {
  const navigate = useNavigate();
  const { cname = "Austrian Grand Prix" } = useParams();
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const todate = (d) =>
    new Date(d).toLocaleString("en-EN", { dateStyle: "long" });

  let url = `https://ergast.com/api/f1/circuits/${cname}/results/1.json?limit=100`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"].RaceTable.Races);
        })
        .catch((err) => {
          setIsLoaded(true);

          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  const [rowData, setRowData] = useState(data);
  const [orderDirection, setOrderDirection] = useState("asc");

  const sortArray = (arr, orderBy) => {
    switch (orderBy) {
      case "asc":
      default:
        return arr.sort((a, b) =>
          a.season > b.season ? 1 : b.season > a.season ? -1 : 0
        );
      case "desc":
        return arr.sort((a, b) =>
          a.season < b.season ? 1 : b.season < a.season ? -1 : 0
        );
    }
  };

  const handleSortRequest = () => {
    setRowData(sortArray(data, orderDirection));
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };

  if (!isLoaded) {
    return <Loading />;
  } else {
    return (
      <div className="container-fluid p-0">
        <Nav />

        <h2 className="bg-dark text-light text-center mt-1">
          {data
            ? data[0]?.Circuit.circuitName +
              " |" +
              data[0]?.Circuit.Location.locality +
              "/" +
              data[0]?.Circuit.Location.country +
              "|"
            : ""}
        </h2>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" onClick={handleSortRequest}>
                    <TableSortLabel
                      color=""
                      active={true}
                      direction={orderDirection}
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
                  <StyledTableRow
                    key={index}
                    sx={{ "&:last-child td,&:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell
                      className="cp text-center"
                      onClick={() => {
                        navigate("/F1/" + row.season);
                      }}
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
                            {row.Results[0].FastestLap?.rank}
                            {". "}
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
