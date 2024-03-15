import React, { memo, useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useClass } from "../contexts/ClassDataContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UpdateForm = ({ dataUpdate }) => {
  console.log("Data Update", dataUpdate);
  const [listTeacher, setListTeacher] = useState([]);
  const [listTrainingProgram, setListTrainingProgram] = useState([]);
  const [updateObject, setUpdateObject] = useState({
    classID: "",
    trainingProgramID: "",
    teacherID: "",
    className: "",
    status: true,
    duration: "",
    location: "",
    startTime: "",
    endTime: "",
  });
  useEffect(() => {
    setUpdateObject((previous) => {
      return {
        ...previous,
        classID: dataUpdate?.classID,
        trainingProgramID: dataUpdate?.trainingProgramID,
        teacherID: dataUpdate?.teacherID,
        className: dataUpdate?.className,
        status: dataUpdate?.status,
        duration: dataUpdate?.duration,
        location: dataUpdate?.location,
        startTime: dataUpdate?.startTime,
        endTime: dataUpdate?.endTime,
      };
    });
  }, [dataUpdate]);
  const classCtx = useClass();
  const onObjectChangeHandler = (property, value) => {
    setUpdateObject((previous) => {
      console.log("Update object: ", previous);
      previous[property] = value;
      return { ...previous };
    });
  };
  const handleOnSubmit = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startTime = new Date(updateObject.startTime);
    const endTime = new Date(updateObject.endTime);
    if (startTime >= endTime) {
      alert("End date must be greater than start date");
    } else {
      var duration =
        Math.ceil((endTime - startTime) / oneDay).toString() + " days";
      var classDataUpdate = {
        classID: dataUpdate?.classID,
        trainingProgramID: updateObject.trainingProgramID,
        teacherID: updateObject.teacherID,
        className: updateObject.className,
        status: updateObject.status,
        duration: duration,
        location: updateObject.location,
        startTime: updateObject.startTime,
        endTime: updateObject.endTime,
      };
      console.log("ClassDataUpdate: ", classDataUpdate);
      let selectedTrainingProgram = listTrainingProgram.find(
        (x) => x.trainingProgramID === updateObject.trainingProgramID
      );
      let selectedTeacher = listTeacher.find(
        (x) => x.userID === updateObject.teacherID
      );

      dataUpdate = {
        ...dataUpdate,
        ...classDataUpdate,
        trainingProgramName: selectedTrainingProgram.programName,
        teacherName: selectedTeacher.fullName,
      };
      classCtx.updateElement(dataUpdate);
    }

    fetch(
      `https://localhost:7252/api/Class/UpdateClass/${classDataUpdate.classID}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        // Send your data in the request body as JSON
        body: JSON.stringify(classDataUpdate),
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Update Class Success", {
            position: "bottom-right",
            autoClose: 3000, // Thời gian tự động đóng toast (ms)
            hideProgressBar: false, // Hiển thị thanh tiến trình
            closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
            pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
            draggable: true, // Cho phép kéo-toast
            progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
          });
        }
      })
      .catch((error) => {
        console.log("Post API Error: ", error);
        toast.error("Update Class Failed", {
          position: "bottom-right",
          autoClose: 3000, // Thời gian tự động đóng toast (ms)
          hideProgressBar: false, // Hiển thị thanh tiến trình
          closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
          pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
          draggable: true, // Cho phép kéo-toast
          progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
        });
      });
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

  return (
    <>
      <div
        class="modal fade addNewModal"
        id="modalUpdateClass"
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
                Update Class
              </h5>
              <HighlightOffIcon
                className="addNewClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></HighlightOffIcon>
            </div>
            <div class="modal-body modal-style">
              <form id="form-update">
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="class-id" class="col-form-label">
                      ClassID
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="class-id"
                      defaultValue={dataUpdate?.classID}
                      onChange={(e) =>
                        onObjectChangeHandler("classID", e.target.value)
                      }
                      disabled
                    />
                  </div>
                  <div class="col-lg-6">
                    <label for="class-name" class="col-form-label">
                      ClassName
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="class-name"
                      defaultValue={dataUpdate?.className}
                      onChange={(e) =>
                        onObjectChangeHandler("className", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="training-id" class="col-form-label">
                      TrainingProgram Name
                    </label>
                    <select
                      class="form-control"
                      id="training-id"
                      defaultValue={dataUpdate?.trainingProgramName}
                      onChange={(e) =>
                        onObjectChangeHandler(
                          "trainingProgramID",
                          e.target.value
                        )
                      }
                    >
                      {listTrainingProgram &&
                        listTrainingProgram.map((item, index) => (
                          <option
                            value={item.trainingProgramID}
                            selected={
                              dataUpdate?.trainingProgramName ===
                              item.programName
                                ? true
                                : false
                            }
                          >
                            {item.programName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <label for="teacher-id" class="col-form-label">
                      Teacher
                    </label>
                    <select
                      class="form-control"
                      id="teacher-id"
                      defaultValue={dataUpdate?.teacherName}
                      onChange={(e) => {
                        onObjectChangeHandler("teacherID", e.target.value);
                      }}
                    >
                      {listTeacher &&
                        listTeacher.map((item, index) => {
                          return (
                            <option
                              value={item.userID}
                              selected={
                                dataUpdate?.teacherName === item.fullName
                                  ? true
                                  : false
                              }
                            >
                              {item.fullName}
                            </option>
                          );
                        })}
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
                        className="me-2"
                        style={{ cursor: "pointer" }}
                        checked={updateObject?.status ? true : false}
                        onChange={(e) => {
                          onObjectChangeHandler("status", true);
                        }}
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
                        checked={!updateObject?.status ? true : false}
                        onChange={(e) => {
                          onObjectChangeHandler("status", false);
                        }}
                      />
                      <label
                        for="status_banned-id"
                        style={{ cursor: "pointer" }}
                      >
                        Banned
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <label for="location-id" class="col-form-label">
                      Location
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="location-id"
                      defaultValue={dataUpdate?.location}
                      onChange={(e) =>
                        onObjectChangeHandler("location", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="startTime-id" class="col-form-label">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="startTime-id"
                      defaultValue={dataUpdate?.startTime}
                      onChange={(e) =>
                        onObjectChangeHandler("startTime", e.target.value)
                      }
                    />
                  </div>
                  <div class="col-lg-6">
                    <label for="endTime-id" class="col-form-label">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="endTime-id"
                      defaultValue={dataUpdate?.endTime}
                      onChange={(e) =>
                        onObjectChangeHandler("endTime", e.target.value)
                      }
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
                id="btn-update"
                onClick={handleOnSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(UpdateForm);
