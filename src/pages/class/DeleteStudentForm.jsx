import React from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DeleteStudentForm = ({ setDataStudent, dataDelete }) => {
  console.log("Data Delete: ", dataDelete);
  const handleConfirmDelete = () => {
    var deleteStudent = { ...dataDelete, classId: "update" };
    fetch(
      `https://localhost:7252/api/students/UpdateStudent/${dataDelete.studentId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        // Send your data in the request body as JSON
        body: JSON.stringify(deleteStudent),
      }
    )
      .then((res) => {
        if (res.ok) {
          setDataStudent((prev) => {
            const dataAfterDelete = prev.filter(
              (x) => x.studentId !== dataDelete.studentId
            );
            return [...dataAfterDelete];
          });
          toast.success("Delete Student Success", {
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
        console.log("Error from Delete: ", error);
        toast.error("Delete Student Failed", {
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

  return (
    <div
      class="modal fade"
      id="modalDelete"
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
              Delete Student
            </h1>
            <HighlightOffRoundedIcon
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ cursor: "pointer" }}
            ></HighlightOffRoundedIcon>
          </div>
          <div class="modal-body text-center text-danger fw-bolder fs-6">
            <div>Are you sure you want to delete student: </div>
            <div className="">{dataDelete?.fullName}</div>
          </div>
          <div class="modal-footer" style={{ justifyContent: "space-between" }}>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-danger"
              onClick={handleConfirmDelete}
              data-bs-dismiss="modal"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteStudentForm;
