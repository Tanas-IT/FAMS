import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
// import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { visuallyHidden } from "@mui/utils";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import UpdateStudentForm from "./UpdateStudentForm";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import SearchIcon from "@mui/icons-material/Search";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImportForm from "./ImportForm";
import DeleteStudentForm from "./DeleteStudentForm";
import AddNewStudentForm from "./AddNewStudentForm";
import * as XLSX from "xlsx";
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

const headUserCells = [
  {
    id: "studentId",
    align: "left",
    disablePadding: false,
    label: "StudentID",
  },
  {
    id: "fullName",
    align: "left",
    disablePadding: false,
    label: "FullName",
  },
  {
    id: "dob",
    align: "left",
    disablePadding: false,
    label: "Day of birth",
  },
  {
    id: "email",
    align: "left",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "address",
    align: "left",
    disablePadding: false,
    label: "Address",
  },
  {
    id: "gender",
    align: "left",
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "phone",
    align: "left",
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "gpa",
    align: "left",
    disablePadding: false,
    label: "GPA",
  },
  {
    id: "status",
    align: "left",
    disablePadding: false,
    label: "Status",
  },
  {
    id: "graduateDate",
    align: "left",
    disablePadding: false,
    label: "Graduated Date",
  },
  {
    id: "joinedDate",
    align: "left",
    disablePadding: false,
    label: "Joinned Date",
  },

  {
    id: "actions",
    align: "left",
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, classGetById } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  console.log("TableStudent: ", classGetById);
  return (
    <TableHead>
      <TableRow>
        {headUserCells.map((headCell) => (
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
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="h3"
      >
        Student List
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
export default function EnhancedTableStudent() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [dataStudent, setDataStudent] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataUpdate, setDataUpdate] = React.useState(null);
  const [dataDelete, setDataDelete] = React.useState();
  const [classGetById, setClassGetById] = React.useState();
  const [isError, setIsError] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [dataFromFile, setDataFromFile] = React.useState([]);
  const tableClass = React.useRef();
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const location = useLocation();
  console.log(location.state?.classID);
  useEffect(() => {
    async function getClassById() {
      try {
        const response = await axios.get(
          `https://localhost:7252/api/Class/getClassById/${location.state?.classID}`
        );
        console.log("Hello: ", response.data.data);
        setClassGetById(response.data.data);
        setLoading(false);
      } catch (error) {
        setIsError(true);
      }
    }
    async function getStudentByClassId() {
      try {
        const response = await axios.get(
          `https://localhost:7252/api/Class/${location.state?.classID}/students`
        );
        console.log("Reponse Get student in class: ", response.data.data);
        setDataStudent(response.data.data);
        setLoading(false);
      } catch (error) {
        setIsError(true);
      }
    }
    getClassById();
    getStudentByClassId();
    setPage(0);
  }, []);

  useEffect(() => {
    setLoading(true);
    async function getStudentByClassId() {
      try {
        const response = await axios.get(
          `https://localhost:7252/api/Class/${location.state?.classID}/students`
        );
        console.log("Reponse Get student in class: ", response.data.data);
        setDataStudent(response.data.data);
        setLoading(false);
      } catch (error) {
        setIsError(true);
      }
    }
    getStudentByClassId();
    setPage(0);
  }, [dataFromFile]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataStudent.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataStudent.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(dataStudent, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, dataStudent]
  );
  console.log("Order: ", order);
  console.log("orderBy: ", orderBy, page, rowsPerPage, dataStudent);
  console.log("visible Rows: ", visibleRows);
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
  function formatNumber(number) {
    var parsedNumber = parseFloat(number);
    var integerPart = Math.floor(parsedNumber);

    if (parsedNumber === integerPart) {
      return integerPart.toString(); // Giữ nguyên format cho các số nguyên
    } else {
      return parsedNumber.toFixed(1); // Làm tròn các số thập phân thành hai chữ số sau dấu phẩy
    }
  }
  const handleExportFile = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(dataStudent);
    XLSX.utils.book_append_sheet(wb, ws, "Student");
    XLSX.writeFile(wb, "Student_List.xlsx");
  };
  return (
    <>
      <div className="header_class">
        <span>ClassID: {classGetById?.classID}</span>
        <br></br>
        <span style={{ margin: "5px 0" }}>
          ClassName: {classGetById?.className} - Teacher:{" "}
          {classGetById?.teacherName}
        </span>
        <div className="header_line" style={{ margin: "15px 0" }}></div>
        <div className="header_day">
          <h5 style={{ margin: "5px 0" }}>
            StartTime: {formatDate(classGetById?.startTime)}
          </h5>
          <h5 style={{ margin: "15px 0" }}>
            End Time: {formatDate(classGetById?.endTime)} - Remaining Days:{" "}
            {Math.ceil(
              (new Date(classGetById?.endTime) - Date.now()) /
                (24 * 60 * 60 * 1000)
            ) > 0
              ? Math.ceil(
                  (new Date(classGetById?.endTime) - Date.now()) /
                    (24 * 60 * 60 * 1000)
                ).toString() + " days"
              : "Finished"}
          </h5>
        </div>
      </div>
      <div className="list_class">
        <p className="list_class-header">
          <span>Student List</span>
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
              // onChange={handleOnChangeValue}
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
          <div className="list_class-import">
            <button
              className="btn_import"
              data-bs-toggle="modal"
              data-bs-target="#importModal"
            >
              <PublishRoundedIcon></PublishRoundedIcon>
              <span>Import</span>
            </button>
            <ImportForm
              classGetById={classGetById}
              setDataFromFile={setDataFromFile}
            ></ImportForm>
          </div>
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
              data-bs-target="#modalAddNewStudent"
            >
              <AddCircleOutlineRoundedIcon></AddCircleOutlineRoundedIcon>
              <span>Add New</span>
            </button>
            <AddNewStudentForm
              data={dataStudent}
              setDataNew={(dataNew) => {
                setDataStudent(dataNew);
              }}
            ></AddNewStudentForm>
          </div>
        </div>
      </div>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              ref={tableClass}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                // rowCount={data.length}
                // classGetById={classGetById}
              />
              <TableBody>
                {visibleRows && visibleRows.length > 0 ? (
                  visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="left"
                        >
                          {row.studentId}
                        </TableCell>
                        <TableCell align="left">{row.fullName}</TableCell>
                        <TableCell align="left">
                          {formatDate(row.dob)}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.address}</TableCell>
                        <TableCell align="left">{row.gender}</TableCell>
                        <TableCell align="left">{row.phone}</TableCell>
                        <TableCell align="left">
                          {formatNumber(row.gpa)}
                        </TableCell>
                        <TableCell align="left">
                          {row.status ? "Active" : "Banned"}
                        </TableCell>
                        <TableCell align="left">
                          {formatDate(row.graduateDate)}
                        </TableCell>
                        <TableCell align="left">
                          {formatDate(row.joinedDate)}
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
                            onClick={() => setDataUpdate(row)}
                            data-bs-toggle="modal"
                            data-bs-target="#modalUpdateStudent"
                            titleAccess="Update Student"
                          ></EditIcon>
                          <UpdateStudentForm
                            dataUpdate={dataUpdate}
                            setDataStudent={setDataStudent}
                          ></UpdateStudentForm>
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
                          <DeleteStudentForm
                            setDataStudent={setDataStudent}
                            dataDelete={dataDelete}
                          ></DeleteStudentForm>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={14}
                      style={{
                        fontSize: "20px",
                        color: "red",
                        fontWeight: "600",
                      }}
                    >
                      {isError ? (
                        `Server has an error. Please return back later`
                      ) : loading ? (
                        <Loading></Loading>
                      ) : (
                        "Do not have any student"
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
            count={dataStudent.length}
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
    </>
  );
}
