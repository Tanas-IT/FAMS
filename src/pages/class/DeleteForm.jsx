import React from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useClass } from "../contexts/ClassDataContext";
const DeleteForm = ({ dataDelete }) => {
  const classCtx = useClass();
  console.log("Data Delete: ", dataDelete);
  const handleConfirmDelete = () => {
    // const dataDeleteArray = classCtx.data.filter((x) => x.id !== dataDelete.id);
    // const originalDataDeleteArray = classCtx.originalData.filter(
    //   (x) => x.classID !== dataDelete.classID
    // );
    // setDataDelete(dataDeleteArray, originalDataDeleteArray);

    classCtx.deleteElement(dataDelete);
    fetch(
      `https://localhost:7252/api/Class/DeleteClass/${dataDelete.classID}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch((error) => {
        console.log("Error from Delete: ", error);
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
              Delete Class
            </h1>
            <HighlightOffRoundedIcon
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ cursor: "pointer" }}
            ></HighlightOffRoundedIcon>
          </div>
          <div class="modal-body text-center text-danger fw-bolder fs-6">
            <div>Are you sure you want to delete class: </div>
            <div className="">{dataDelete?.className}</div>
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
export default DeleteForm;
