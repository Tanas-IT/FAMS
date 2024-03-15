import React, { createContext, useContext, useState } from "react";
const ClassContext = createContext({
  data: null,
  setData: (data) => {},
  originalData: [],
  setOriginalData: (originalData) => {},
  updateElement: (dataUpdate) => {},
  deleteElement: (dataDelete) => {},
});

function ClassProvider({ children, ...props }) {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  function UpdateElementById(dataUpdate) {
    setData((prev) => {
      const oldDataIndex = prev.findIndex(
        (x) => x.classID === dataUpdate.classID
      );
      prev[oldDataIndex] = { ...dataUpdate };
      console.log("DataPreviousSubmit: ", prev);

      return [...prev];
    });
    setOriginalData((prev) => {
      const oldDataIndex = prev.findIndex(
        (x) => x.classID === dataUpdate.classID
      );
      prev[oldDataIndex] = { ...dataUpdate };
      return [...prev];
    });
  }

  function DeleteElementById(dataDelete) {
    setData((prev) => {
      const dataAfterDelete = prev.filter(
        (x) => x.classID !== dataDelete.classID
      );
      return [...dataAfterDelete];
    });
    setOriginalData((prev) => {
      const dataOriginalAfterDelete = prev.filter(
        (x) => x.classID !== dataDelete.classID
      );
      return [...dataOriginalAfterDelete];
    });
  }
  const value = {
    data: data,
    setData: (data) => setData(data),
    originalData: originalData,
    setOriginalData: (data) => setOriginalData(data),
    updateElement: UpdateElementById,
    deleteElement: DeleteElementById,
  };

  return (
    <ClassContext.Provider value={value} {...props}>
      {children}
    </ClassContext.Provider>
  );
}
function useClass() {
  const context = useContext(ClassContext);
  if (typeof context === "undefined") {
    throw new Error("useClass must be used within a CountProvider");
  }
  return context;
}
export { ClassProvider, useClass };
