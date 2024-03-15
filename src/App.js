import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Admin,
  Calendar,
  Class,
  Home,
  LearningMaterials,
  Settings,
  Student,
  TrainingProgram,
  UserManagement,
} from "./pages";
import { StudentList, ReserveList } from "./pages";
import { TopNav, Footer } from "./pages";
import Login from "./pages/Login";
import { ClassProvider } from "./pages/contexts/ClassDataContext";
import { jwtDecode } from "jwt-decode";
import EnhancedTableStudent from "./pages/class/TableStudent";
import { ToastContainer } from "react-toastify";
import ScoreStudent from "./pages/score/ScoreStudent";
import AuthContextProvider from "./pages/contexts/AuthenticationContext";

const ProtectedRoute = ({ isAllowed, redirectPath = "/Login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = sessionStorage.getItem("token");
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setRole(decodedToken.role);
      if (decodedToken.role === "Admin") {
        navigate("/Admin");
      }
    } else {
      navigate("/Login");
    }
  }, [location]);

  // useEffect(() => {
  //    console.log(role);
  // }, [role]);

  return (
    <main className="App">
      <div className="wrapper">
        {/* <div className="header"> */}
        <TopNav />
        {/* </div> */}

        <div>
          <AuthContextProvider>
            <Routes>
              {/* public */}
              <Route path="/">
                <Route index element={<Home />} />

                <Route path="Login" element={<Login />} />
                <Route path="Home" element={<Home />} />
                <Route path="Settings" element={<Settings />} />
              </Route>

              {/* Admin */}
              {role === "Admin" && (
                <>
                  <Route path="/Admin" element={<Admin />}>
                    <Route path="Home" element={<Home />} />
                    <Route
                      path="Class"
                      element={
                        <ClassProvider>
                          <Class />
                        </ClassProvider>
                      }
                    />
                    <Route
                      path="Class/ListStudent"
                      element={<EnhancedTableStudent></EnhancedTableStudent>}
                    />
                    <Route path="Student" element={<Student />} />
                    <Route path="StudentList" element={<StudentList />} />
                    <Route path="ReserveList" element={<ReserveList />} />
                    <Route
                      path="TrainingProgram"
                      element={<TrainingProgram />}
                    />
                    <Route path="Calendar" element={<Calendar />} />
                    <Route path="UserManagement" element={<UserManagement />} />
                    <Route
                      path="LearningMaterials"
                      element={<LearningMaterials />}
                    />
                    <Route
                      path="Score"
                      element={<ScoreStudent></ScoreStudent>}
                    ></Route>
                  </Route>
                </>
              )}

              {/* Student */}
              {role === "Student" && (
                <>
                  <Route path="/Admin" element={<Admin />}>
                    <Route path="Home" element={<Home />} />
                    <Route
                      path="Class"
                      element={
                        <ClassProvider>
                          <Class />
                        </ClassProvider>
                      }
                    />
                    <Route
                      path="Class/ListStudent"
                      element={<EnhancedTableStudent></EnhancedTableStudent>}
                    />
                    <Route path="Student" element={<Student />} />
                    <Route path="StudentList" element={<StudentList />} />
                    <Route path="ReserveList" element={<ReserveList />} />
                    <Route
                      path="TrainingProgram"
                      element={<TrainingProgram />}
                    />
                    <Route path="Calendar" element={<Calendar />} />
                    <Route path="UserManagement" element={<UserManagement />} />
                    <Route
                      path="LearningMaterials"
                      element={<LearningMaterials />}
                    />
                    <Route
                      path="Score"
                      element={<ScoreStudent></ScoreStudent>}
                    ></Route>
                  </Route>
                </>
              )}
            </Routes>
          </AuthContextProvider>
        </div>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </main>
  );
}

export default App;
