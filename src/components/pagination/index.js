import { Box, Pagination } from "@mui/material";
import { React, useEffect, useState } from "react";

// const pageSize = 5;
export default function AppPagination({ setData, pageSize = 5 }) {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });
  // useEffect(() => {
  //   setPagination({ ...pagination, count: originalData.length });
  // }, [originalData]);
  // useEffect(() => {
  //   setData(data);
  // }, [pagination.from, pagination.to]);

  const handlePageChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      display={"flex"}
      sx={{
        margin: "20px 0px",
      }}
    >
      <Pagination
        color="primary"
        count={Math.ceil(pagination.count / pageSize)}
        onChange={handlePageChange}
      ></Pagination>
    </Box>
  );
}
