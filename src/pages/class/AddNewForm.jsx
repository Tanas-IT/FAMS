import React, { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const AddNewForm = ({ data, setDataNew }) => {
  const [listTeacher, setListTeacher] = useState([]);
  const [listTrainingProgram, setListTrainingProgram] = useState([]);

  const handleOnSubmit = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    // var classId = document.getElementById("class-id");
    var trainingId = document.getElementById("training-id");
    var className = document.getElementById("class-name");
    var teacherId = document.getElementById("teacher-id");
    var status = document.querySelector('input[name="status"]:checked');
    var location = document.getElementById("location-id");
    var startTimeInput = document.getElementById("startTime-id");
    var endTimeInput = document.getElementById("endTime-id");
    const startTime = new Date(startTimeInput.value);
    const endTime = new Date(endTimeInput.value);
    if (startTime >= endTime) {
      alert("End date must be greater than start date");
    } else {
      var duration =
        Math.ceil((endTime - startTime) / oneDay).toString() + " days";
      var form = document.getElementById("form-add");
      var classNew = {
        trainingProgramID: trainingId.value,
        teacherID: teacherId.value,
        className: className.value,
        status: status.value === "true" ? true : false,
        duration: duration,
        location: location.value,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
      };
      const lastId =
        "CL" +
        (Number(data[data.length - 1].classID.substr(2)) + 1)
          .toString()
          .padStart(6, "0");
      var classNewDisplay = {
        classID: lastId,
        trainingProgramName: trainingId.options[trainingId.selectedIndex].text,
        teacherName: teacherId.options[teacherId.selectedIndex].text,
        className: className.value,
        status: status.value === "true" ? true : false,
        duration: duration,
        location: location.value,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
      };
      console.log("Test: ", JSON.stringify(classNew));
      data = [...data, classNewDisplay];
      setDataNew(data);
      async function createClass() {
        try {
          const result = await axios.post(
            "https://localhost:7252/api/Class/CreateClass",
            classNew
          );
          if (result.data.data) {
            console.log("Add Class Success");
            toast.success("Add Class Success", {
              position: "bottom-right",
              autoClose: 3000, // Thời gian tự động đóng toast (ms)
              hideProgressBar: false, // Hiển thị thanh tiến trình
              closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
              pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
              draggable: true, // Cho phép kéo-toast
              progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
            });
          }
        } catch (error) {
          console.log("Error from create new Data: ", error);
          toast.error("Add Class Failed", {
            position: "bottom-right",
            autoClose: 3000, // Thời gian tự động đóng toast (ms)
            hideProgressBar: false, // Hiển thị thanh tiến trình
            closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
            pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
            draggable: true, // Cho phép kéo-toast
            progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
          });
        }
      }
      createClass();
      form.reset();
    }
    console.log("Data New", data);
  };
  useEffect(() => {
    async function getAllTeacher() {
      try {
        const response = await axios.get(
          "https://localhost:7252/api/User/GetAllTeacher"
        );
        setListTeacher(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    async function getAllTrainingProgram() {
      try {
        const response = await axios.get(
          "https://localhost:7252/api/TrainingProgram"
        );
        setListTrainingProgram(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllTeacher();
    getAllTrainingProgram();
  }, []);
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }

  return (
    <>
      <div
        class="modal fade addNewModal"
        id="modalAddNewClass"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: "#2D3748", color: "white" }}
            >
              <h5 class="modal-title modal-addNew_title" id="exampleModalLabel">
                Add Class
              </h5>
              <HighlightOffIcon
                className="addNewClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></HighlightOffIcon>
            </div>
            <div class="modal-body modal-style">
              <form id="form-add">
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="class-name" class="col-form-label">
                      ClassName
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="class-name"
                    ></input>
                  </div>
                  <div className="col-lg-6">
                    <label for="location-id" class="col-form-label">
                      Location
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="location-id"
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="training-id" class="col-form-label">
                      TrainingProgram Name
                    </label>
                    <select class="form-control" id="training-id">
                      {listTrainingProgram &&
                        listTrainingProgram.map((item, index) => (
                          <option value={item.trainingProgramID}>
                            {item.programName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label for="teacher-id" class="col-form-label">
                      Teacher
                    </label>
                    <select class="form-control" id="teacher-id">
                      {listTeacher &&
                        listTeacher.map((item, index) => (
                          <option value={item.userID}>{item.fullName}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div className="col-lg-6">
                    <label class="col-form-label">Status</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        id="status_active-id"
                        name="status"
                        value="true"
                        className="me-2 pointer"
                        style={{ cursor: "pointer" }}
                        checked
                      />
                      <label
                        for="status_active-id"
                        style={{ cursor: "pointer" }}
                      >
                        Active
                      </label>
                      <input
                        type="radio"
                        id="status_banned-id"
                        name="status"
                        value="false"
                        className="ms-5 me-2"
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        for="status_banned-id"
                        style={{ cursor: "pointer" }}
                      >
                        Banned
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <label for="startTime-id" class="col-form-label">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="startTime-id"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="endTime-id" class="col-form-label">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="endTime-id"
                    ></input>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                id="btn-add"
                onClick={handleOnSubmit}
              >
                Add new
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddNewForm;
