import React, { useEffect } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "../../styles/userManagement.css";
const AddNewStudentForm = ({ data, setDataNew }) => {
  console.log("Data add new Student: ", data);
  const handleOnSubmit = () => {
    var fullName = document.getElementById("fullName-id");
    var dob = document.getElementById("dob-id");
    var email = document.getElementById("email-id");
    var phone = document.getElementById("phone-id");
    var gender = document.querySelector('input[name="gender"]:checked');
    var address = document.getElementById("address-id");
    var gpa = document.getElementById("gpa-id");
    var major = document.getElementById("major-id");
    var school = document.getElementById("school-id");
    var status = document.querySelector('input[name="status"]:checked');
    var password = document.getElementById("password-id");
    var joinnedDate = document.getElementById("joinnedDate-id");
    var graduatedDate = document.getElementById("graduatedDate-id");
    const joinnedDateTime = new Date(joinnedDate.value);
    const graduatedDateTime = new Date(graduatedDate.value);
    if (joinnedDateTime >= graduatedDateTime) {
      alert("Graduated date must be greater than joinned date");
    } else {
      var form = document.getElementById("form-add");
      var studentNew = {
        fullName: fullName.value,
        dob: dob.value,
        email: email.value,
        phone: phone.value,
        status: status.value === "true" ? true : false,
        gender: gender.value,
        address: address.value,
        gpa: gpa.value,
        joinedDate: joinnedDateTime,
        graduateDate: graduatedDateTime,
        major: major.value,
        school: school.value,
        classId: data[0].classId,
        password: password.value,
      };
      function getEmailUsername(email) {
        // Tìm vị trí của ký tự "@"
        const atIndex = email.indexOf("@");

        // Kiểm tra nếu không tìm thấy ký tự "@"
        if (atIndex === -1) {
          return email; // Trả về toàn bộ chuỗi email
        }

        // Cắt phần trước ký tự "@"
        const username = email.slice(0, atIndex);

        return username;
      }
      var userNew = {
        userName: getEmailUsername(email.value),
        password: password.value,
        fullName: fullName.value,
        email: email.value,
        dob: dob.value,
        address: address.value,
        gender: gender.value,
        phone: phone.value,
        role: "Student",
        status: status.value === "true" ? true : false,
      };
      console.log("Data Student New: ", studentNew);
      console.log("Data User New: ", userNew);
      const lastId = "SE xxxxxx (processing - reload)";
      var studentNewDisplay = {
        studentId: lastId,
        fullName: fullName.value,
        dob: dob.value,
        email: email.value,
        phone: phone.value,
        status: status.value === "true" ? true : false,
        gender: gender.value,
        address: address.value,
        gpa: gpa.value,
        joinedDate: joinnedDateTime,
        graduateDate: graduatedDateTime,
      };
      console.log("Test: ", JSON.stringify(studentNew));
      data = [...data, studentNewDisplay];
      setDataNew(data);
      async function createClass() {
        try {
          const result = await axios.post(
            "https://localhost:7252/api/students/AddStudent",
            studentNew
          );
          const resultUserAdd = await axios.post(
            "https://localhost:7252/api/User/CreateNewUser",
            userNew
          );
          if (result.data && resultUserAdd.data) {
            toast.success("Add Student Success", {
              position: "bottom-right",
              autoClose: 3000, // Thời gian tự động đóng toast (ms)
              hideProgressBar: false, // Hiển thị thanh tiến trình
              closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
              pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
              draggable: true, // Cho phép kéo-toast
              progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
            });
            console.log("Add Student Success");
          }
        } catch (error) {
          toast.error("Add Student Failed", {
            position: "bottom-right",
            autoClose: 3000, // Thời gian tự động đóng toast (ms)
            hideProgressBar: false, // Hiển thị thanh tiến trình
            closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
            pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
            draggable: true, // Cho phép kéo-toast
            progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
          });
          console.log("Error From Add Student ", error);
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
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    async function getAllTrainingProgram() {
      try {
        const response = await axios.get(
          "https://localhost:7252/api/TrainingProgram"
        );
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllTeacher();
    getAllTrainingProgram();
  }, []);
  function checkLegitPhoneNumber(e) {
    let message = document.querySelector(".warning-message");
    if (/^0\d{9,12}$/.test(e.target.value) || !e.target.value) {
      message.style.display = "none";
    } else {
      message.style.display = "inline-block";
    }
  }
  function checkLegitPassword(e) {
    let message = document.querySelector(".warning-password");
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(e.target.value)) {
      message.style.display = "inline-block";
      return false;
    }

    // Kiểm tra xem mật khẩu có ít nhất một chữ số
    const digitRegex = /[0-9]/;
    if (!digitRegex.test(e.target.value)) {
      message.style.display = "inline-block";
      return false;
    }

    // Kiểm tra xem mật khẩu có ít nhất một ký tự đặc biệt
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    if (!specialCharRegex.test(e.target.value)) {
      message.style.display = "inline-block";
      return false;
    }
    // Mật khẩu hợp lệ nếu đã vượt qua tất cả các kiểm tra trên
    message.style.display = "none";
    return true;
  }
  return (
    <>
      <div
        class="modal fade addNewModal"
        id="modalAddNewStudent"
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
                Add Student
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
                    <label for="fullName-id" class="col-form-label">
                      FullName
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="fullName-id"
                    ></input>
                  </div>
                  <div class="col-lg-6">
                    <label for="password-id" class="col-form-label">
                      Password
                    </label>
                    <div class="warning-password">
                      <span class="message-text">Invalid passoword format</span>
                      <div class="arrow"></div>
                    </div>
                    <input
                      type="password"
                      class="form-control"
                      id="password-id"
                      onBlur={checkLegitPassword}
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
                    ></input>
                  </div>

                  <div className="col-lg-6">
                    <label class="col-form-label">Phone</label>
                    <div class="warning-message">
                      <span class="message-text">
                        Invalid phone number format!
                      </span>
                      <div class="arrow"></div>
                    </div>
                    <input
                      type="text"
                      id="phone-id"
                      className="form-control me-2 pointer"
                      style={{ cursor: "pointer" }}
                      onBlur={checkLegitPhoneNumber}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <div className="col-lg-6">
                    <label for="email-id" class="col-form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="email-id"
                    ></input>
                  </div>
                  <div class="col-lg-6">
                    <label for="major-id" class="col-form-label">
                      Major
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="major-id"
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
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
                        value="Male"
                        className="me-2 pointer"
                        style={{ cursor: "pointer" }}
                      />
                      <label for="gender_male-id" style={{ cursor: "pointer" }}>
                        Male
                      </label>
                      <input
                        type="radio"
                        id="gender_female-id"
                        name="gender"
                        value="Female"
                        className="ms-5 me-2"
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        for="gender_female-id"
                        style={{ cursor: "pointer" }}
                      >
                        Female
                      </label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <label for="school-id" class="col-form-label">
                      School
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="school-id"
                    ></input>
                  </div>
                </div>
                <div className="mb-3 row">
                  <div class="col-lg-6">
                    <label for="address-id" class="col-form-label">
                      Address
                    </label>
                    <input type="text" class="form-control" id="address-id" />
                  </div>
                  <div className="col-lg-6">
                    <label for="gpa-id" class="col-form-label">
                      GPA
                    </label>
                    <input type="text" class="form-control" id="gpa-id"></input>
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
                  <div className="col-lg-6">
                    <label for="joinnedDate-id" class="col-form-label">
                      Joinned Date
                    </label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="joinnedDate-id"
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
                Add new
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddNewStudentForm;
