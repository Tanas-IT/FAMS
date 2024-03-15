import React, { useState } from "react";
// Bootstrap CSS
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/class.css";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
const ROOT_URL = "https://localhost:7252/api";
const ImportUserForm = ({ getDataFromFile, setRowsPerPage, setTotalPage }) => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  let parsedData = null;
  const handleFileUpload = (e) => {
    var input = document.querySelector(".inputfile");
    var label = input.nextElementSibling;
    var fileName = e.target.value.split("\\").pop();
    if (data && fileName) {
      label.innerHTML = e.target.value.split("\\").pop();
      label.setAttribute("title", e.target.value.split("\\").pop());
    } else {
      label.innerHTML = "Select";
      label.setAttribute("title", "Select");
    }
    if (e.target.files.length === 0) {
      setData([]);
      return;
    }
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workBook = XLSX.read(data, { type: "binary" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      parsedData = XLSX.utils.sheet_to_json(sheet);
    };
  };
  const templateDownload = "http://localhost:3000/Template User List.xlsx";
  const fileName = templateDownload.split("/").pop();

  async function getData() {
    var fd = new FormData();
    fd.append("file", file);
    console.log("File", file);
    try {
      const importFileToServer = await axios.post(
        `${ROOT_URL}/User/import-excel`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // Send your data in the request body as JSON
        }
      );
      if (importFileToServer.data) {
        toast.success("Import User Success", {
          position: "bottom-right",
          autoClose: 3000, // Thời gian tự động đóng toast (ms)
          hideProgressBar: false, // Hiển thị thanh tiến trình
          closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
          pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
          draggable: true, // Cho phép kéo-toast
          progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
        });
        setData(parsedData);
        setRowsPerPage((rowsPerPage) => rowsPerPage + parsedData.length);
        setTotalPage((totalPage) => totalPage + parsedData.length);
      }
    } catch (error) {
      toast.error("Import User Failed", {
        position: "bottom-right",
        autoClose: 3000, // Thời gian tự động đóng toast (ms)
        hideProgressBar: false, // Hiển thị thanh tiến trình
        closeOnClick: true, // Đóng toast khi nhấp chuột vào nó
        pauseOnHover: true, // Dừng thời gian tự động đóng khi di chuột vào toast
        draggable: true, // Cho phép kéo-toast
        progress: undefined, // Tùy chỉnh tiến trình, nếu không sử dụng mặc định
      });
      setData((data) => data);
    }
    getDataFromFile(data);
  }
  return (
    <div
      className="modal fade"
      id="importModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div
            className="modal-header"
            style={{
              backgroundColor: "#2D3748",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h5
              className="modal-title"
              id="exampleModalLabel"
              style={{ textAlign: "center" }}
            >
              Import User
            </h5>
          </div>
          <div className="modal-body">
            <div className="modal-import">
              <h5 className="modal-import_title">Import setting</h5>
              <span className="modal-import-type">
                File:{" "}
                <span style={{ color: "red", fontSize: "20px" }}>
                  .xlsx, .xls
                </span>
              </span>
              <div className="modal-import-input">
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="inputfile"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
                <label className="label-import" for="file">
                  Select
                </label>
              </div>
            </div>
            <div className="modal-import-template">
              <span className="modal-import_title">Import template</span>
              <a
                href={templateDownload}
                download={fileName}
                className="modal-import_link"
              >
                Download
              </a>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="text-decoration-underline fw-bold border-0 bg-white"
              data-bs-dismiss="modal"
              style={{ color: "#E95B4D" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-light"
              data-bs-dismiss="modal"
              style={{
                backgroundColor: "#2D3748",
                width: "100px",
                borderRadius: "8px",
              }}
              onClick={getData}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImportUserForm;
