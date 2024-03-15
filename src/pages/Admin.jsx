import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/AdminLayout.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div id="wrapper">
      {/* sidebar */}
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
            <Link to="/Admin">Admin</Link>
          </li>
          <div className="nav-items">
            <li>
              <Link to="Home" className="item">
                <HomeOutlinedIcon></HomeOutlinedIcon>
                <div id="nav-item-label">Home</div>
              </Link>
            </li>
            <li>
              <span onClick={() => setIsOpen(!isOpen)}>
                <Link to="Student" className="item">
                  <PeopleAltOutlinedIcon></PeopleAltOutlinedIcon>
                  <div id="nav-item-label">Student</div>
                </Link>
              </span>
              {isOpen && (
                <ul className="student-dropdown item">
                  <li>
                    <Link to="StudentList">
                      <div>Student List</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="ReserveList">
                      <div>Reserve List</div>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="TrainingProgram" className="item">
                <BiotechOutlinedIcon></BiotechOutlinedIcon>
                <div id="nav-item-label">Training Program</div>
              </Link>
            </li>
            <li>
              <Link to="Class" className="item">
                <SchoolOutlinedIcon></SchoolOutlinedIcon>
                <div id="nav-item-label">Class</div>
              </Link>
            </li>
            <li>
              <Link to="Calendar" className="item">
                <CalendarTodayIcon></CalendarTodayIcon>
                <div id="nav-item-label">Calendar</div>
              </Link>
            </li>
            <li>
              <Link to="UserManagement" className="item">
                <PersonOutlineIcon></PersonOutlineIcon>
                <div id="nav-item-label">User Management</div>
              </Link>
            </li>
            <li>
              <Link to="LearningMaterials" className="item">
                <AutoStoriesOutlinedIcon></AutoStoriesOutlinedIcon>
                <div id="nav-item-label">Learning Materials</div>
              </Link>
            </li>
            <li>
              <Link to="Settings" className="item">
                <SettingsOutlinedIcon></SettingsOutlinedIcon>
                <div id="nav-item-label">Settings</div>
              </Link>
            </li>
            <li>
              <Link to="Score" className="item">
                <HdrStrongIcon></HdrStrongIcon>
                <div id="nav-item-label">Score</div>
              </Link>
            </li>
            {/* <li>
          <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
        </li> */}
          </div>
        </ul>
      </div>
      <div id="page-content-wrapper">
        <div className="container-fluid content">
          <div className="row ">
            <div className="col-lg-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
