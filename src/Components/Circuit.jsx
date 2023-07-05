import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loading from "./Loading";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { TableSortLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
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
        <Link to="/" className="btn btn-danger container-fluid mb-1">
          <h1 className="bg-danger">F1</h1>
        </Link>
        <h2 className="bg-dark text-light text-center">
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
                  <StyledTableCell onClick={handleSortRequest}>
                    <TableSortLabel
                      color=""
                      active={true}
                      direction={orderDirection}
                      sx={{ fontSize: 20 }}
                    >
                      SEASON
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>DATE</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>RND</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>
                    WINNER
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>
                    CONSTRUCTOR
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>GRID</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>LAPS</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 20 }}>TIME</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <StyledTableRow
                    key={index}
                    sx={{ "&:last-child td,&:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell
                    className="cp"
                     onClick={() => {
                      navigate("/F1/" + row.season);
                    }}
                    >{row.season}</StyledTableCell>
                    <StyledTableCell>{todate(row.date)}</StyledTableCell>
                    <StyledTableCell>{row.round}</StyledTableCell>
                    <StyledTableCell>
                      {row.Results[0].Driver.givenName}{" "}
                      {row.Results[0].Driver.familyName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.Results[0].Constructor.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.Results[0].grid}</StyledTableCell>
                    <StyledTableCell>{row.Results[0].laps}</StyledTableCell>
                    <StyledTableCell>
                      {row.Results[0].Time?.time}
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
