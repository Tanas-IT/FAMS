import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthenticationContext";
import "../../styles/Score.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.red,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const BASE_URL = "https://localhost:7252";
export default function ScoreStudent() {
  const [studentModule, setStudentModule] = useState();
  const [originalScoreStudent, setOriginalScoreStudent] = useState();
  const [scoreStudentTest, setscoreStudentTest] = useState();
  const [GPA, setGPA] = useState(0);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    async function getScoreByStudentId() {
      try {
        console.log("Authe Context: ", authContext.getAuthenticate());
        const response = await axios.get(
          `${BASE_URL}/api/Score/getAllScoreOfStudent/${
            authContext.getAuthenticate().StudentID
          }`
        );

        const responseGPA = await axios.get(
          `${BASE_URL}/api/Score/calculateGPA/${
            authContext.getAuthenticate().StudentID
          }`
        );
        if (response.data && responseGPA.data) {
          console.log("Module: ", response.data.data);
          setOriginalScoreStudent(response.data.data);
          let setModule = new Set();
          response.data.data.forEach((x) => setModule.add(x.moduleId));

          let moduleArr = [];

          response.data.data.forEach((data) => {
            if (!moduleArr.find((e) => e.moduleId === data.moduleId)) {
              moduleArr.push(data);
            }
          });
          setStudentModule(moduleArr);
          setGPA(responseGPA.data.data);
        }
      } catch (e) {
        toast.error("Get Score Student Failed", {
          position: "bottom-right",
          autoClose: 3000, // Thời gian tự động đóng toast (ms)
          hideProgressBar: false, // Hiển thị thanh tiến trình
          closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
          pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
          draggable: true, // Cho phép kéo-toast
          progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
        });
        console.log(e);
      }
    }
    getScoreByStudentId();
  }, []);

  useEffect(() => {
    if (studentModule) {
      handleShowTableScore(studentModule[0]?.moduleId);
    }
  }, [originalScoreStudent]);

  function handleShowTableScore(moduleId) {
    var getScoreAndTestByModuleId = originalScoreStudent?.filter(
      (x) => x.moduleId === moduleId
    );
    setscoreStudentTest(getScoreAndTestByModuleId);
  }
  function formatDate(date) {
    const originalDate = new Date(date);
    const day = originalDate.getDate().toString().padStart(2, "0");
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = originalDate.getFullYear().toString();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

  function getAverage(scoreStudentArray) {
    if (!scoreStudentArray) {
      return 0;
    }
    let average = 0;
    scoreStudentArray.forEach((x) => (average += x.score));
    return (average / scoreStudentArray.length).toFixed(2);
  }

  function getAverageGeneral(scoreStudentArray, moduleID) {
    if (!scoreStudentArray) {
      return 0;
    }
    let average = 0;
    var averrageArray = scoreStudentArray?.filter(
      (x) => x.moduleId === moduleID
    );
    averrageArray.forEach((x) => (average += x.score));
    return (average / averrageArray.length).toFixed(2);
  }
  return (
    <div
      className="row"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <div
        className="col-lg-5 mx-2"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <h4 className="title-module">
          Select a module in that table <br />
          (The score table of {authContext.getAuthenticate().StudentID} -{" "}
          {authContext.getAuthenticate().FullName})
        </h4>
        <TableContainer component={Paper} sx={{ maxWidth: "100%", padding: 0 }}>
          <Table sx={{ width: "100%" }} aria-label="customized table">
            <TableHead sx={{ backgroundColor: "blue" }}>
              <TableRow>
                <StyledTableCell>Module ID</StyledTableCell>
                <StyledTableCell>Module Name</StyledTableCell>
                <StyledTableCell>Create By</StyledTableCell>
                <StyledTableCell>Created Date</StyledTableCell>
                <StyledTableCell>Average</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentModule?.map((row) => (
                <StyledTableRow
                  key={row.testId}
                  className="row_module-table"
                  onClick={() => handleShowTableScore(row.moduleId)}
                >
                  <StyledTableCell component="th" scope="row">
                    {row.moduleId}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {row.moduleName}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {row.createBy}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {formatDate(row.createdDate)}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {getAverageGeneral(originalScoreStudent, row.moduleId)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow>
                <StyledTableCell
                  key="gpa"
                  component="th"
                  scope="row"
                  colSpan={4}
                  align="center"
                  className="average"
                >
                  GPA
                </StyledTableCell>
                <StyledTableCell className="average">
                  {GPA.toFixed(2)}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="col-lg-6 mx-3">
        <h4 className="title-result">... then see the table result</h4>
        <TableContainer component={Paper} sx={{ maxWidth: "100%", padding: 0 }}>
          <Table sx={{ width: "100%" }} aria-label="customized table">
            <TableHead sx={{ backgroundColor: "blue" }}>
              <TableRow>
                <StyledTableCell>Test ID</StyledTableCell>
                <StyledTableCell>Test Type</StyledTableCell>
                <StyledTableCell>Test Name</StyledTableCell>
                <StyledTableCell>Score</StyledTableCell>
                <StyledTableCell>Due Date</StyledTableCell>
                <StyledTableCell>Submission Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreStudentTest?.map((row) => (
                <StyledTableRow key={row.testId + 1}>
                  <StyledTableCell component="th" scope="row">
                    {row.testId}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {row.testType}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {row.testName}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {row.score}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {formatDate(row.dueDate)}
                  </StyledTableCell>
                  <StyledTableCell key={row.id} component="th" scope="row">
                    {formatDate(row.submissionDate)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow key="result_total">
                <StyledTableCell
                  ket="average"
                  component="th"
                  scope="row"
                  colSpan={3}
                  align="center"
                  className="average"
                >
                  AVERAGE:
                </StyledTableCell>
                <StyledTableCell
                  ket="average_score"
                  component="th"
                  scope="row"
                  className="average_score"
                >
                  {getAverage(scoreStudentTest)}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
