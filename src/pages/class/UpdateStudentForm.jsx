import React, { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useClass } from "../contexts/ClassDataContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UpdateStudentForm = ({ dataUpdate, setDataStudent }) => {
  console.log("Data Student Update: ", dataUpdate);
  const [updateObject, setUpdateObject] = useState({
    studentId: "",
    fullName: "",
    dob: "",
    email: "",
    address: "",
    gender: "",
    phone: "",
    gpa: "",
    major: "",
    status: true,
    joinedDate: "",
    graduateDate: "",
    school: "",
  });
  useEffect(() => {
    setUpdateObject((previous) => {
      return {
        ...previous,
        studentId: dataUpdate?.studentId,
        fullName: dataUpdate?.fullName,
        dob: dataUpdate?.dob,
        email: dataUpdate?.email,
        address: dataUpdate?.address,
        gender: dataUpdate?.gender,
        phone: dataUpdate?.phone,
        gpa: dataUpdate?.gpa,
        // major: dataUpdate?.major,
        status: dataUpdate?.status,
        joinedDate: dataUpdate?.joinedDate,
        graduateDate: dataUpdate?.graduateDate,
        // school: dataUpdate?.school,
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
    const startTime = new Date(updateObject.joinedDate);
    const endTime = new Date(updateObject.graduateDate);
    if (startTime >= endTime) {
      toast.error("Update Student Failed", {
        position: "bottom-right",
        autoClose: 3000, // Thời gian tự động đóng toast (ms)
        hideProgressBar: false, // Hiển thị thanh tiến trình
        closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
        pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
        draggable: true, // Cho phép kéo-toast
        progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
      });
    } else {
      var studentDataUpdate = {
        studentId: dataUpdate?.studentId,
        fullName: updateObject.fullName,
        dob: updateObject.dob,
        email: updateObject.email,
        address: updateObject.address,
        gender: updateObject.gender,
        phone: updateObject.phone,
        gpa: updateObject.gpa,
        // major: updateObject.major,
        status: updateObject.status,
        joinedDate: updateObject.joinedDate,
        graduateDate: updateObject.graduateDate,
        // school: updateObject.school,
      };
      console.log("student Data Update: ", studentDataUpdate);
      dataUpdate = {
        ...dataUpdate,
        ...studentDataUpdate,
      };
      classCtx.updateElement(dataUpdate);
      setDataStudent((prev) => {
        const oldDataIndex = prev.findIndex(
          (x) => x.studentId === dataUpdate.studentId
        );
        prev[oldDataIndex] = { ...dataUpdate };
        console.log("DataPreviousSubmit: ", prev);

        return [...prev];
      });
    }

    fetch(
      `https://localhost:7252/api/students/UpdateStudent/${updateObject.studentId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        // Send your data in the request body as JSON
        body: JSON.stringify(studentDataUpdate),
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Update Student Success", {
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
        console.log("Error when update student: ", error);
        toast.error("Update Student Failed", {
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
  function checkLegitPhoneNumber(e) {
    let message = document.querySelector(".warning-message");
    if (/^0\d{9,12}$/.test(e.target.value) || !e.target.value) {
      message.style.display = "none";
    } else {
      message.style.display = "inline-block";
    }
  }
  function formatNumber(number) {
    try {
      if (Number.isInteger(number)) {
        return number.toString(); // Giữ nguyên format cho các số nguyên
      } else {
        return parseFloat(number.toFixed(2)); // Làm tròn các số thập phân thành hai chữ số sau dấu phẩy
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div
        class="modal fade addNewModal"
        id="modalUpdateStudent"
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
                Update Student
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
                    <label for="student-id" class="col-form-label">
                      StudentID
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="student-id"
                      defaultValue={dataUpdate?.studentId}
                      onChange={(e) =>
                        onObjectChangeHandler("studentId", e.target.value)
                      }
                      disabled
                    />
                  </div>
                  <div class="col-lg-6">
                    <label for="fullName-id" class="col-form-label">
                      FullName
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="fullName-id"
                      defaultValue={dataUpdate?.fullName}
                      onChange={(e) =>
                        onObjectChangeHandler("fullName", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="dob-id" class="col-form-label">
                      Day Of Birth
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="dob-id"
                      defaultValue={dataUpdate?.dob}
                      onChange={(e) =>
                        onObjectChangeHandler("dob", e.target.value)
                      }
                    ></input>
                  </div>
                  <div className="col-lg-6">
                    <label for="email-id" class="col-form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email-id"
                      defaultValue={dataUpdate?.email}
                      onChange={(e) =>
                        onObjectChangeHandler("email", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div className="col-lg-6">
                    <label class="col-form-label">Phone</label>
                    <input
                      type="text"
                      id="phone-id"
                      className="form-control me-2 pointer"
                      style={{ cursor: "pointer" }}
                      defaultValue={dataUpdate?.phone}
                      onChange={(e) => {
                        onObjectChangeHandler("phone", e.target.value);
                      }}
                      onBlur={checkLegitPhoneNumber}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label for="gender-id" class="col-form-label">
                      Gender
                    </label>
                    <div
                      className="d-flex align-items-center"
                      style={{ marginTop: "7px" }}
                    >
                      <input
                        type="radio"
                        id="gender_male-id"
                        name="gender"
                        value="male"
                        className="me-2 pointer"
                        style={{ cursor: "pointer" }}
                        checked={updateObject?.gender === "Male" ? true : false}
                        onChange={(e) => {
                          onObjectChangeHandler("gender", "Male");
                        }}
                      />
                      <label for="gender_male-id" style={{ cursor: "pointer" }}>
                        Male
                      </label>
                      <input
                        type="radio"
                        id="gender_female-id"
                        name="gender"
                        value="female"
                        className="ms-5 me-2"
                        style={{ cursor: "pointer" }}
                        checked={
                          updateObject?.gender === "Female" ? true : false
                        }
                        onChange={(e) => {
                          onObjectChangeHandler("gender", "Female");
                        }}
                      />
                      <label
                        for="gender_female-id"
                        style={{ cursor: "pointer" }}
                      >
                        Female
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="address-id" class="col-form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="address-id"
                      defaultValue={dataUpdate?.address}
                      onChange={(e) =>
                        onObjectChangeHandler("address", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label for="gpa-id" class="col-form-label">
                      GPA
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="gpa-id"
                      defaultValue={formatNumber(dataUpdate?.gpa)}
                      onChange={(e) =>
                        onObjectChangeHandler("gpa", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="status-id" class="col-form-label">
                      Status
                    </label>
                    <div
                      className="d-flex align-items-center"
                      style={{ marginTop: "7px" }}
                    >
                      <input
                        type="radio"
                        id="status_active-id"
                        name="status"
                        value="true"
                        className="me-2 pointer"
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
                    <label for="joinnedDate-id" class="col-form-label">
                      Joinned Date
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="joinnedDate-id"
                      defaultValue={dataUpdate?.joinedDate}
                      onChange={(e) =>
                        onObjectChangeHandler("joinedDate", e.target.value)
                      }
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div className="col-lg-6">
                    <label for="graduatedDate-id" class="col-form-label">
                      Graduated Date
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="graduatedDate-id"
                      defaultValue={dataUpdate?.graduateDate}
                      onChange={(e) =>
                        onObjectChangeHandler("graduateDate", e.target.value)
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
export default UpdateStudentForm;
