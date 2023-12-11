import './App.css';
import NavBar from "./components/NavBar";
import AddProject from "./projects/AddProject";
import AllProjects from "./projects/AllProjects";
import ProjectApp from "./components/ProjectApp";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EditProject from "./projects/EditProject";
import EditEmployeeProject from "./projects/EditEmployeeProject";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon'
import AddEmployeeProject from "./projects/AddEmployeeProject";
import AllEmployees from "./employees/AllEmployees";
import EditEmployee from "./employees/EditEmployee";
import AddEmployee from "./employees/AddEmployee";

function App({children}) {
    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<ProjectApp/>}/>
                    <Route path="/all" element={<AllProjects/>}/>
                    <Route path="/add" element={<AddProject/>}/>
                    <Route path="/edit/:id" element={<EditProject/>}/>
                    <Route path="/edit/:id/employee" element={<EditEmployeeProject/>}/>
                    <Route path="/addEmployee/:id" element={<AddEmployeeProject/>}/>
                    <Route path="/employees" element={<AllEmployees/>}/>
                    <Route path="/add-employee" element={<AddEmployee/>}/>
                    <Route path="/edit-employee/:id" element={<EditEmployee/>}/>
                </Routes>
            </BrowserRouter>
        </LocalizationProvider>

    );
}

export default App;
