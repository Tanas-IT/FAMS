import React, { useState } from "react";
import "../../styles/class.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ImportForm from "./ImportForm";
import * as XLSX from "xlsx";
// Bootstrap CSS
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import AddNewForm from "./AddNewForm.jsx";
import { useClass } from "../contexts/ClassDataContext.jsx";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { visuallyHidden } from "@mui/utils";
import UpdateForm from "./UpdateForm";
import DeleteForm from "./DeleteForm";
import Loading from "../../components/loading/Loading";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headClassCells = [
  {
    id: "classID",
    align: "left",
    disablePadding: false,
    label: "ClassID",
  },
  {
    id: "ClassName",
    align: "left",
    disablePadding: false,
    label: "ClassName",
  },
  {
    id: "trainingProgramName",
    align: "left",
    disablePadding: false,
    label: "TrainingProgram Name",
  },
  {
    id: "teacherName",
    align: "left",
    disablePadding: false,
    label: "Teacher Name",
  },
  {
    id: "Status",
    align: "left",
    disablePadding: false,
    label: "Status",
  },
  {
    id: "Duration",
    align: "left",
    disablePadding: false,
    label: "Duration",
  },
  {
    id: "Location",
    align: "left",
    disablePadding: false,
    label: "Location",
  },
  {
    id: "StartTime",
    align: "left",
    disablePadding: false,
    label: "StartTime",
  },
  {
    id: "EndTime",
    align: "left",
    disablePadding: false,
    label: "EndTime",
  },
  {
    id: "actions",
    align: "left",
    disablePadding: false,
    label: "Actions",
  },
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    console.log("Event: ", event);
    console.log("Property: ", property);
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headClassCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="h3"
      >
        Class List
      </Typography>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Class = () => {
  const [searchValue, setSearchValue] = useState();
  const [dataFromFile, setDataFromFile] = useState([]);
  const [classGetById, setClassGetById] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataUpdate, setDataUpdate] = React.useState(null);
  const [dataDelete, setDataDelete] = React.useState();
  const [idClass, setIdClass] = React.useState();
  const navigate = useNavigate();
  const tableClass = React.useRef();
  const { setData, setOriginalData, originalData, data } = useClass();
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  React.useEffect(() => {
    setPage(0);
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );
  const handleEdit = (row) => {
    setDataUpdate(row);
  };
  const hanleDeleteRow = (row) => {
    setDataDelete(row);
  };
  function formatDate(date) {
    const originalDate = new Date(date);
    const day = originalDate.getDate().toString().padStart(2, "0");
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = originalDate.getFullYear().toString();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  React.useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          "https://localhost:7252/api/Class/getAll"
        );
        const responseData = response.data.data;
        setData(responseData);
        setLoading(false);
        setOriginalData(responseData);
      } catch (error) {
        setIsError(true);
      }
    }
    if (dataFromFile.length !== 0) {
      console.log("dataFromfile", dataFromFile);
      setData(dataFromFile);
      setOriginalData(dataFromFile);
    } else {
      getData();
    }
  }, [dataFromFile]);

  React.useEffect(() => {
    setData(originalData);
    if (searchValue) {
      setData(data.filter((x) => x.className.includes(searchValue)));
      console.log("Data Search", data);
    }
  }, [searchValue]);

  const handleOnChangeValue = (e) => {
    setSearchValue(e.target.value);
  };
  function getDataFromFile(data) {
    setDataFromFile(data);
  }
  const handleExportFile = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(originalData);
    XLSX.utils.book_append_sheet(wb, ws, "Class");
    XLSX.writeFile(wb, "Class_List.xlsx");
  };

  return (
    <>
      <div className="list_class">
        <p className="list_class-header">
          <span>Class List</span>
          <MoreHorizIcon fontSize="large"></MoreHorizIcon>
        </p>
      </div>
      <div className="list_class-action">
        <div className="list_class-left">
          <div className="list_class-search">
            <SearchIcon></SearchIcon>
            <input
              className="list_class-input"
              type="search"
              name=""
              id=""
              placeholder="Search by ..."
              onChange={handleOnChangeValue}
            />
          </div>
          <div className="list_class-filter">
            <button className="btn_filter">
              <FilterListIcon></FilterListIcon>
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="list_class-right">
          <div className="list_class-export">
            <button className="btn_export" onClick={handleExportFile}>
              <GetAppRoundedIcon></GetAppRoundedIcon>
              <span>Export</span>
            </button>
          </div>
          <div className="list_class-addNew">
            <button
              className="btn_addNew"
              data-bs-toggle="modal"
              data-bs-target="#modalAddNewClass"
            >
              <AddCircleOutlineRoundedIcon></AddCircleOutlineRoundedIcon>
              <span>Add New</span>
            </button>
            <AddNewForm
              data={originalData}
              setDataNew={(dataNew) => {
                setOriginalData(dataNew);
                setData(dataNew);
              }}
            ></AddNewForm>
          </div>
        </div>
      </div>
      <div className="list_table-student">
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                ref={tableClass}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {visibleRows.length > 0 ? (
                    visibleRows.map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            align="left"
                          >
                            {row.classID}
                          </TableCell>
                          <TableCell align="left">{row.className}</TableCell>
                          <TableCell align="left">
                            {row.trainingProgramName}
                          </TableCell>
                          <TableCell align="left">{row.teacherName}</TableCell>
                          <TableCell align="left">
                            {row.status === true ? "Active" : "Banned"}
                          </TableCell>
                          <TableCell align="left">{row.duration}</TableCell>
                          <TableCell align="left">{row.location}</TableCell>
                          <TableCell align="left">
                            {formatDate(row.startTime)}
                          </TableCell>
                          <TableCell align="left">
                            {formatDate(row.endTime)}
                          </TableCell>
                          <TableCell align="left">
                            <EditIcon
                              style={{
                                color: "white",
                                backgroundColor: "#3559E0",
                                padding: "1px",
                                marginRight: "10px",
                                fontSize: "26px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleEdit(row)}
                              data-bs-toggle="modal"
                              data-bs-target="#modalUpdateClass"
                              titleAccess="Update"
                            ></EditIcon>
                            <UpdateForm dataUpdate={dataUpdate}></UpdateForm>
                            <DeleteRoundedIcon
                              style={{
                                color: "white",
                                backgroundColor: "#FF0060",
                                padding: "1px",
                                fontSize: "26px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => hanleDeleteRow(row)}
                              data-bs-toggle="modal"
                              data-bs-target="#modalDelete"
                              titleAccess="Delete"
                            ></DeleteRoundedIcon>
                            <DeleteForm
                              setDataDelete={(data, originalData) => {
                                setData(data);
                                setOriginalData(originalData);
                              }}
                              dataDelete={dataDelete}
                            ></DeleteForm>
                            <VisibilityIcon
                              style={{
                                color: "white",
                                backgroundColor: "#2D9596",
                                padding: "1px",
                                marginLeft: "10px",
                                fontSize: "26px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate("ListStudent", {
                                  state: { classID: row.classID },
                                })
                              }
                              titleAccess="View student list"
                            ></VisibilityIcon>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={10}
                        style={{
                          fontSize: "20px",
                          color: "red",
                          fontWeight: "600",
                        }}
                      >
                        {isError ? (
                          `Server has an error. Please return back later`
                        ) : loading ? (
                          <Loading style={{ top: "-50%" }}></Loading>
                        ) : (
                          "No content match"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          {loading ? (
            ""
          ) : (
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          )}
        </Box>
      </div>
    </>
  );
};
export default Class;
