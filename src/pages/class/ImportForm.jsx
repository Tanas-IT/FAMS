import React, { useState } from "react";
// Bootstrap CSS
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/class.css";
import * as XLSX from "xlsx";
import axios from "axios";
const ImportForm = ({ classGetById, setDataFromFile }) => {
  console.log("Class Get By Id: ", classGetById?.classID);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const handleFileUpload = async (e) => {
    var input = document.querySelector(".inputfile");
    console.log("Handle File Upload", e.target.files[0]);
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
    // Add a new column by modifying the sheet's data

    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workBook = XLSX.read(data, { type: "binary" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      parsedData.forEach((item) => (item.classID = classGetById.classID));
      console.log("Parsed Data: ", parsedData);
    };
  };
  const templateDownload = "http://localhost:3000/Template Student List.xlsx";
  const fileName = templateDownload.split("/").pop();

  async function getData() {
    var fd = new FormData();
    fd.append("file", file);
    console.log("File", file);
    const importFileToServer = await axios.post(
      `https://localhost:7252/api/students/student/import-excel/${classGetById.classID}`,
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
        // Send your data in the request body as JSON
      }
    );
    console.log("Import File: ", importFileToServer);
    setDataFromFile([]);
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
              Import Class
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
export default ImportForm;
