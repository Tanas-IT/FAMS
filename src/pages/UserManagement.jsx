import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import "../styles/userManagement.css";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import { IconButton, TablePagination } from "@mui/material";
import axios from "axios";
import Loading from "../components/loading/Loading";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import ImportUserForm from "./user/ImportUserForm";
import { useSearchParams } from "react-router-dom";
import useDebounce from "./class/hooks/useDebounce";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isError, setIsError] = useState(false);
  const currentPageInURL = searchParams.get("page")
    ? checkInterger(searchParams.get("page"), "page")
    : 1;
  const currentPageSizeInURL = searchParams.get("pageSize")
    ? checkInterger(searchParams.get("pageSize"), "pageSize")
    : 5;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(currentPageSizeInURL);
  const [page, setPage] = useState(currentPageInURL);
  const [totalPage, setTotalPage] = useState(1);
  const [query, setQuery] = useState("");
  const queryDebounce = useDebounce(query, 500);
  const ROOT_URL = "https://localhost:7252/api";
  const [dataUpdate, setDataUpdate] = useState([]);

  function checkInterger(value, type) {
    var numberRegex = /^\d+$/;
    if (!numberRegex.test(value)) {
      return type === "page" ? 1 : 5;
    }
    return parseInt(value);
  }
  async function getData(page, pageSize) {
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 5;
      setRowsPerPage(5);
    }
    let filterParams = searchParams.get("sortby");
    console.log("Sprt by: ", filterParams);
    const dataMock = await axios.get(
      `${ROOT_URL}/User/GetAllUser?page=${parseInt(page)}&pageSize=${pageSize}${
        filterParams ? "&sortby=" + filterParams : ""
      }`
    );
    console.log("Data Mock: ", dataMock.data.data.data);
    setPage(page - 1);

    setSearchParams(
      `page=${parseInt(page)}&pageSize=${pageSize}${
        filterParams ? "&sortby=" + filterParams : ""
      }`
    );
    setData(dataMock.data.data.data);
    setTotalPage(dataMock.data.data.totalPages);
    setLoading(false);
  }
  useEffect(() => {
    getData(page, rowsPerPage);
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    getData(page, parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    const newPageInteger = parseInt(newPage);
    setPage(newPageInteger);
    console.log("New Page: ", newPageInteger);
    getData(newPageInteger + 1, rowsPerPage);
  };
  function openModalEdit(modalId) {
    const modals = document.querySelectorAll(".modal_change");
    const currentModal = document.querySelector(`#${modalId}`);
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    currentModal.style.display = "block";
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!queryDebounce) {
        console.log("Query Dobounce empty: ", queryDebounce);
        await getData(page, rowsPerPage);
      } else {
        const response = await axios.get(
          `${ROOT_URL}/User/GetAllUser?keyword=${queryDebounce}&page=${parseInt(
            page + 1
          )}&pageSize=${rowsPerPage}`
        );
        setSearchParams(
          `keyword=${queryDebounce}&page=${parseInt(
            page + 1
          )}&pageSize=${rowsPerPage}`
        );
        setData(response.data.data?.data || []);
        setTotalPage(response.data.data?.totalPages || 0);
      }
      setLoading(false);
    }
    fetchData();
    console.log("Query Debounce: ", queryDebounce);
  }, [queryDebounce]);

  function handleOnchange(e) {
    console.log("Query: ", e.target.value);
    setQuery(e.target.value);
  }
  useEffect(() => {
    function handleClickOutSide(e) {
      console.log("id:", e.target.id);
      if (!e.target.id.includes("modaIcon")) {
        const modals = document.querySelectorAll(".modal_change");
        modals.forEach((modal) => {
          modal.style.display = "none";
        });
      }
    }
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const handleOnSubmitAdd = () => {
    var username = document.getElementById("username-id");
    var password = document.getElementById("password-id");
    var fullName = document.getElementById("fullName-id");
    var email = document.getElementById("email-id");
    var dob = document.getElementById("dob-id");
    var address = document.getElementById("address-id");
    var gender = document.querySelector('input[name="gender"]:checked');
    var phone = document.getElementById("phone-id");
    var role = document.getElementById("role-id");
    var status = document.querySelector('input[name="status"]:checked');
    var form = document.getElementById("form-add");
    var userDataNew = {
      userName: username.value,
      password: password.value,
      fullName: fullName.value,
      email: email.value,
      dob: dob.value,
      address: address.value,
      gender: gender.value,
      phone: phone.value,
      role: role.value,
      status: status.value === "true" ? true : false,
    };
    var userNewDisplay = {
      userName: username.value,
      password: password.value,
      fullName: fullName.value,
      email: email.value,
      dob: formatDate(dob.value),
      address: address.value,
      gender: gender.value,
      phone: phone.value,
      role: role.value,
      status: status.value === "true" ? true : false,
    };
    const dataNewArray = [...data, userNewDisplay];
    setData(dataNewArray);
    setRowsPerPage((rowsPerPage) => rowsPerPage + 1);
    setTotalPage((totalPage) => totalPage + 1);
    console.log("data New Array: ", JSON.stringify(userDataNew));
    async function createUser() {
      try {
        const result = await axios.post(
          "https://localhost:7252/api/User/CreateNewUser",
          userDataNew
        );
        if (result.data) {
          toast.success("Add User Success", {
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
        toast.error("Add User Failed", {
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
    createUser();
    form.reset();
  };
  const [updateObject, setUpdateObject] = useState({
    userName: "",
    password: "",
    fullName: "",
    email: "",
    dob: "",
    address: "",
    gender: true,
    phone: "",
    role: "",
    status: true,
  });
  useEffect(() => {
    setUpdateObject((previous) => {
      return {
        ...previous,
        userName: dataUpdate?.userName,
        password: dataUpdate?.password,
        fullName: dataUpdate?.fullName,
        email: dataUpdate?.email,
        dob: dataUpdate?.dob,
        address: dataUpdate?.address,
        gender: dataUpdate?.gender,
        phone: dataUpdate?.phone,
        role: dataUpdate?.role,
        status: dataUpdate?.status,
      };
    });
  }, [dataUpdate]);
  function handleClickUpdateForm(dataUpdate) {
    console.log("DataUpdate click: ", dataUpdate);
    setDataUpdate(dataUpdate);
  }
  console.log("Data Update: ", dataUpdate);
  const onObjectChangeHandler = (property, value) => {
    setUpdateObject((previous) => {
      console.log("Update object: ", previous);
      previous[property] = value;
      return { ...previous };
    });
  };
  const handleOnSubmitUpdate = () => {
    var userDataUpdate = {
      userID: dataUpdate.userID,
      userName: updateObject?.userName,
      password: updateObject.password,
      fullName: updateObject.fullName,
      email: updateObject.email,
      dob: updateObject.dob,
      address: updateObject.address,
      gender: updateObject.gender,
      phone: updateObject.phone,
      role: updateObject.role,
      status: updateObject.status,
    };
    setData((prev) => {
      const oldDataIndex = prev.findIndex(
        (x) => x.userID === userDataUpdate.userID
      );
      prev[oldDataIndex] = { ...userDataUpdate };
      return [...prev];
    });
    console.log("User data Update: ", JSON.stringify(userDataUpdate));
    fetch(`https://localhost:7252/api/User/UpdateInformation`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Send your data in the request body as JSON
      body: JSON.stringify(userDataUpdate),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Update User Success", {
            position: "bottom-right",
            autoClose: 3000, // Thời gian tự động đóng toast (ms)
            hideProgressBar: false, // Hiển thị thanh tiến trình
            closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
            pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
            draggable: true, // Cho phép kéo-toast
            progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
          });
          return res.json();
        }
      })
      .catch((error) => {
        toast.error("Update User Failed", {
          position: "bottom-right",
          autoClose: 3000, // Thời gian tự động đóng toast (ms)
          hideProgressBar: false, // Hiển thị thanh tiến trình
          closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
          pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
          draggable: true, // Cho phép kéo-toast
          progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
        });
        console.log("Post API Error: ", error);
      });
  };
  const [userDelete, setUserDelete] = useState();
  const hanleDeleteRow = (item) => {
    console.log("Delete item: ", item);
    setUserDelete(item);
  };
  const handleConfirmDelete = () => {
    console.log("Delete User: ", userDelete);

    console.log("Status: ", userDelete.status);
    console.log("Status ID: ", userDelete.userID);

    fetch(
      `https://localhost:7252/api/User/ChangeStatusUser?userId=${
        userDelete.userID
      }&status=${!userDelete.status}`,
      {
        method: "PUT",
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Update Status Success", {
            position: "bottom-right",
            autoClose: 3000, // Thời gian tự động đóng toast (ms)
            hideProgressBar: false, // Hiển thị thanh tiến trình
            closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
            pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
            draggable: true, // Cho phép kéo-toast
            progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
          });
          return res.json();
        }
      })
      .catch((error) => {
        toast.error("Update Status Failed", {
          position: "bottom-right",
          autoClose: 3000, // Thời gian tự động đóng toast (ms)
          hideProgressBar: false, // Hiển thị thanh tiến trình
          closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
          pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
          draggable: true, // Cho phép kéo-toast
          progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
        });
        console.log("Error when delete user: ", error);
      });
    setData((prev) => {
      let dataAfterDeleteIndex = prev.findIndex(
        (x) => x.userID === userDelete.userID
      );
      prev[dataAfterDeleteIndex].status = !userDelete.status;
      return [...prev];
    });
  };
  function formatDate(date) {
    const originalDate = new Date(date);
    const day = originalDate.getDate().toString().padStart(2, "0");
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = originalDate.getFullYear().toString();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  function convertToSetArray(arr) {
    const newArr = new Set(arr);
    console.log(newArr);
    return [...newArr];
  }
  const [headerSort, setHeaderSort] = useState({
    username: true,
    fullName: true,
    email: true,
    dob: true,
    address: true,
    gender: true,
    phone: true,
    role: true,
    status: true,
  });
  console.log("Header Sort: ", headerSort);
  async function sortData(filter) {
    setLoading(true);
    try {
      const response = await axios.get(
        `${ROOT_URL}/User/GetAllUser?keyword=${queryDebounce}&page=${parseInt(
          page + 1
        )}&pageSize=${rowsPerPage}&sortby=${filter}`
      );
      setSearchParams(
        `keyword=${queryDebounce}&page=${parseInt(
          page + 1
        )}&pageSize=${rowsPerPage}&sortby=${filter}`
      );
      setData(response.data.data?.data || []);
      setTotalPage(response.data.data?.totalPages || 0);
      setLoading(false);
    } catch (error) {
      setIsError(true);
    }
  }

  function handleSort(e) {
    setHeaderSort((prev) => {
      const updatedSort = { ...prev }; // Create a copy of the previous sort state

      // Reset the sort order for all other columns except the clicked one
      for (const key in updatedSort) {
        if (key !== e.target.id) {
          updatedSort[key] = false;
        }
      }

      // Toggle the sort order for the clicked column
      updatedSort[e.target.id] = !updatedSort[e.target.id];
      let filter = "";
      switch (e.target.id) {
        case "username":
          filter = prev[e.target.id] ? "UserName_desc" : "UserName_asc";
          sortData(filter);
          break;
        case "fullName":
          filter = prev[e.target.id] ? "FullName_desc" : "FullName_asc";
          sortData(filter);
          break;
        case "email":
          filter = prev[e.target.id] ? "Email_desc" : "Email_asc";
          sortData(filter);
          break;
        case "dob":
          filter = prev[e.target.id] ? "DOB_desc" : "DOB_asc";
          sortData(filter);
          break;
        case "address":
          filter = prev[e.target.id] ? "Address_desc" : "Address_asc";
          sortData(filter);
          break;
        case "gender":
          filter = prev[e.target.id] ? "Gender_desc" : "Gender_asc";
          sortData(filter);
          break;
        case "phone":
          filter = prev[e.target.id] ? "Phone_desc" : "Phone_asc";
          sortData(filter);
          break;
        case "role":
          filter = prev[e.target.id] ? "Role_desc" : "Role_asc";
          sortData(filter);
          break;
        case "status":
          filter = prev[e.target.id] ? "Status_desc" : "Status_asc";
          sortData(filter);
          break;
        default:
          break;
      }

      return { ...prev, ...updatedSort };
    });

    console.log(e.target.id);
  }

  function checkLegitPhoneNumber(e) {
    let message = document.querySelector(".warning-message");
    if (/^0\d{9,12}$/.test(e.target.value) || !e.target.value) {
      message.style.display = "none";
    } else {
      message.style.display = "inline-block";
    }
  }
  function checkLegitPhoneNumberUpdate(e) {
    let messageUpdate = document.querySelector(".warning-message-update");
    if (/^0\d{9,12}$/.test(e.target.value) || !e.target.value) {
      messageUpdate.style.display = "none";
    } else {
      messageUpdate.style.display = "inline-block";
    }
  }
  return (
    <div className="list-user">
      <div className="header-list_user">
        <h2>List User</h2>
        <div className="d-flex">
          <div className="list_class-import">
            <button
              className="btn_import"
              data-bs-toggle="modal"
              data-bs-target="#importModal"
              style={{ marginRight: "5px" }}
            >
              <PublishRoundedIcon></PublishRoundedIcon>
              <span>Import</span>
            </button>
            <ImportUserForm
              getDataFromFile={(data) => {
                setData((prev) => [...prev, ...data]);
              }}
              setRowsPerPage={(rows) => setRowsPerPage(rows)}
              setTotalPage={(totalPage) => setTotalPage(totalPage)}
            ></ImportUserForm>
          </div>
          <button
            className="btn-add_user"
            data-bs-toggle="modal"
            data-bs-target="#modalAddNewUser"
          >
            <AddIcon></AddIcon>
            <span className="btn-add_text">New User</span>
          </button>
        </div>
        <div
          class="modal fade addNewModal"
          id="modalAddNewUser"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div
                class="modal-header"
                style={{ backgroundColor: "#2D3748", color: "white" }}
              >
                <h5
                  class="modal-title modal-addNew_title"
                  id="exampleModalLabel"
                >
                  Add User
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
                      <label for="username-id" class="col-form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="username-id"
                      ></input>
                    </div>
                    <div class="col-lg-6">
                      <label for="password-id" class="col-form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        class="form-control"
                        id="password-id"
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-lg-6">
                      <label for="fullName-id" class="col-form-label">
                        FullName
                      </label>
                      <input
                        type="text"
                        id="fullName-id"
                        className="form-control me-2 pointer"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
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
                  </div>
                  <div className="mb-3 row">
                    <div className="col-lg-6">
                      <label for="dob-id" class="col-form-label">
                        Day Of Birth
                      </label>
                      <input
                        type="datetime-local"
                        class="form-control"
                        id="dob-id"
                      />
                    </div>
                    <div class="col-lg-6">
                      <label for="address-id" class="col-form-label">
                        Address
                      </label>
                      <input type="text" class="form-control" id="address-id" />
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
                          value="male"
                          className="me-2 pointer"
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          for="gender_male-id"
                          style={{ cursor: "pointer" }}
                        >
                          Male
                        </label>
                        <input
                          type="radio"
                          id="gender_female-id"
                          name="gender"
                          value="female"
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
                    <div className="col-lg-6">
                      <label for="phone-id" class="col-form-label">
                        Phone
                      </label>
                      <div class="warning-message">
                        <span class="message-text">
                          Invalid phone number format!
                        </span>
                        <div class="arrow"></div>
                      </div>
                      <input
                        type="tel"
                        class="form-control"
                        id="phone-id"
                        onBlur={checkLegitPhoneNumber}
                      ></input>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div class="col-lg-6">
                      <label for="role-id" class="col-form-label">
                        Role
                      </label>
                      <select class="form-control" id="role-id">
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
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
                  onClick={handleOnSubmitAdd}
                >
                  Add new
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-search">
        <div className="header-search_user">
          <SearchIcon></SearchIcon>
          <input
            onChange={handleOnchange}
            className="header-search_input"
            type="search"
            placeholder="Search User by FullName"
          />
        </div>
      </div>
      <div className="list_info-user">
        <table>
          <thead>
            <tr className="list_info-header ">
              <td id="username" onClick={handleSort}>
                Username
              </td>
              <td id="fullName" onClick={handleSort}>
                FullName
              </td>
              <td id="email" onClick={handleSort}>
                Email
              </td>
              <td id="dob" onClick={handleSort}>
                DOB
              </td>
              <td id="address" onClick={handleSort}>
                Address
              </td>
              <td id="gender" onClick={handleSort}>
                Gender
              </td>
              <td id="phone" onClick={handleSort}>
                Phone
              </td>
              <td id="role" onClick={handleSort}>
                Role
              </td>
              <td id="status" onClick={handleSort}>
                Status
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Loading></Loading>
            ) : (
              data &&
              data.length > 0 &&
              data.map((item, index) => (
                <tr key={index}>
                  <td title={`${item.userName}`}>{item.userName}</td>
                  <td>{item.fullName}</td>
                  <td title={`${item.email}`}>{item.email}</td>
                  <td>{formatDate(item.dob)}</td>
                  <td title={`${item.address}`}>{item.address}</td>
                  <td>{item.gender}</td>
                  <td title={`${item.phone}`}>{item.phone}</td>
                  <td>{item.role}</td>
                  <td>
                    <span
                      className={`status ${
                        item.status ? "active_status" : "banned_status"
                      }`}
                    >
                      {item.status ? "Active" : "Banned"}
                    </span>
                  </td>
                  <td className="edit">
                    <IconButton
                      onClick={() => openModalEdit(`modal-${index}`)}
                      id={`modaIcon-${index}`}
                    >
                      <MoreVertIcon
                        onClick={() => openModalEdit(`modal-${index}`)}
                        id={`modaIcon-${index}`}
                      ></MoreVertIcon>
                    </IconButton>
                    <div id={`modal-${index}`} className="modal_change">
                      <ul className="modal_change-list">
                        <li className="modal_change-item">
                          <div
                            className="modal_change-link update-item"
                            data-bs-toggle="modal"
                            data-bs-target="#modalUpdateUser"
                            onClick={() => handleClickUpdateForm(item)}
                          >
                            {console.log("In Edit Icon: ", item.dob)}
                            <CreateIcon></CreateIcon>
                            <span>Edit</span>
                          </div>
                        </li>
                        <li className="modal_change-item">
                          <div
                            className={`modal_change-link ${
                              item.status ? "delete-item" : "active-item"
                            }`}
                            onClick={() => hanleDeleteRow(item)}
                            data-bs-toggle="modal"
                            data-bs-target="#modalUserDelete"
                            titleAccess="Delete"
                          >
                            {item.status ? (
                              <>
                                <RemoveCircleIcon></RemoveCircleIcon>
                                <span> Banned</span>
                              </>
                            ) : (
                              <>
                                <CheckCircleRoundedIcon></CheckCircleRoundedIcon>
                                <span> Active</span>
                              </>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <div
                    class="modal fade"
                    id="modalUpdateUser"
                    tabindex="-1"
                    aria-labelledby="updateModal"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div
                          class="modal-header"
                          style={{
                            backgroundColor: "#2D3748",
                            color: "white",
                          }}
                        >
                          <h5
                            class="modal-title modal-addNew_title"
                            id="modalUpdateUser"
                          >
                            Update User
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
                                <label for="username-id" class="col-form-label">
                                  Username
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="username-id"
                                  defaultValue={dataUpdate?.userName}
                                  onChange={(e) =>
                                    onObjectChangeHandler(
                                      "userName",
                                      e.target.value
                                    )
                                  }
                                ></input>
                              </div>
                              <div className="col-lg-6">
                                <label for="fullName-id" class="col-form-label">
                                  FullName
                                </label>
                                <input
                                  type="text"
                                  id="fullName-id"
                                  className="form-control me-2 pointer"
                                  style={{ cursor: "pointer" }}
                                  defaultValue={dataUpdate?.fullName}
                                  onChange={(e) =>
                                    onObjectChangeHandler(
                                      "fullName",
                                      e.target.value
                                    )
                                  }
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
                                  defaultValue={dataUpdate?.email}
                                  onChange={(e) =>
                                    onObjectChangeHandler(
                                      "email",
                                      e.target.value
                                    )
                                  }
                                ></input>
                              </div>
                              <div className="col-lg-6">
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
                                />
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
                                    onObjectChangeHandler(
                                      "address",
                                      e.target.value
                                    )
                                  }
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
                                    checked={
                                      updateObject?.gender === "Male"
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      onObjectChangeHandler("gender", "Male");
                                    }}
                                  />
                                  <label
                                    for="gender_male-id"
                                    style={{ cursor: "pointer" }}
                                  >
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
                                      updateObject?.gender === "Female"
                                        ? true
                                        : false
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
                              <div className="col-lg-6">
                                <label for="phone-id" class="col-form-label">
                                  Phone
                                </label>
                                <div class="warning-message-update">
                                  <span class="message-text">
                                    Invalid phone number format!
                                  </span>
                                  <div class="arrow"></div>
                                </div>
                                <input
                                  type="tel"
                                  class="form-control"
                                  id="phone-id"
                                  defaultValue={dataUpdate?.phone}
                                  onChange={(e) => {
                                    checkLegitPhoneNumberUpdate(e);
                                    onObjectChangeHandler(
                                      "phone",
                                      e.target.value
                                    );
                                  }}
                                ></input>
                              </div>
                              <div class="col-lg-6">
                                <label for="role-id" class="col-form-label">
                                  Role
                                </label>
                                <select
                                  class="form-control"
                                  id="role-id"
                                  defaultValue={dataUpdate?.role}
                                  onChange={(e) =>
                                    onObjectChangeHandler(
                                      "role",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option
                                    value="Admin"
                                    selected={
                                      dataUpdate?.role === "Admin"
                                        ? true
                                        : false
                                    }
                                  >
                                    Admin
                                  </option>
                                  <option
                                    value="SuperAdmin"
                                    selected={
                                      dataUpdate?.role === "SuperAdmin"
                                        ? true
                                        : false
                                    }
                                  >
                                    Super Admin
                                  </option>
                                  <option
                                    value="Teacher"
                                    selected={
                                      dataUpdate?.role === "Teacher"
                                        ? true
                                        : false
                                    }
                                  >
                                    Teacher
                                  </option>
                                  <option
                                    value="Student"
                                    selected={
                                      dataUpdate?.role === "Student"
                                        ? true
                                        : false
                                    }
                                  >
                                    Student
                                  </option>
                                </select>
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
                                    checked={
                                      updateObject?.status ? true : false
                                    }
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
                                    checked={
                                      !updateObject?.status ? true : false
                                    }
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
                            onClick={() => handleOnSubmitUpdate(item)}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="modal fade"
                    id="modalUserDelete"
                    tabindex="-1"
                    aria-labelledby="deleteModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      class="modal-dialog modal-dialog-centered"
                      style={{ width: "350px" }}
                    >
                      <div class="modal-content">
                        <div
                          class="modal-header"
                          style={{
                            backgroundColor: "#2D3748",
                            color: "white",
                          }}
                        >
                          <h1
                            class="modal-title fs-5"
                            id="deleteModalLabel"
                            style={{ textAlign: "center" }}
                          >
                            {userDelete?.status ? "Banned User" : "Active User"}
                          </h1>
                          <HighlightOffRoundedIcon
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: "pointer" }}
                          ></HighlightOffRoundedIcon>
                        </div>
                        <div class="modal-body text-center text-danger fw-bolder fs-6">
                          Are you sure you want to{" "}
                          {userDelete?.status
                            ? "banned user: "
                            : "active user: "}
                          {userDelete?.userName}
                        </div>
                        <div
                          class="modal-footer"
                          style={{ justifyContent: "space-between" }}
                        >
                          <button
                            type="button"
                            class="btn btn-secondary outline-none"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className={`btn ${
                              userDelete?.status ? "btn-danger" : "btn-primary"
                            } `}
                            onClick={handleConfirmDelete}
                            data-bs-dismiss="modal"
                          >
                            {userDelete?.status ? "Banned" : "Active"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data && data?.length <= 0 && (
          <h4 style={{ textAlign: "center", color: "red" }}>No user match</h4>
        )}
        {loading
          ? ""
          : data.length > 0 && (
              <TablePagination
                rowsPerPageOptions={convertToSetArray([
                  rowsPerPage,
                  5,
                  10,
                  20,
                  100,
                ])}
                component="div"
                count={totalPage}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
      </div>
    </div>
  );
};

export default UserManagement;
