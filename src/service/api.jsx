import axios from 'axios';

const API_URL = 'http://localhost:8080';
// const API_URL = 'https://nuclea-backend-184a4fac3b44.herokuapp.com';

export const addProject = async (data) => {
    try {
        return await axios.post(`${API_URL}/projetos`, data);
    } catch (error) {
        console.log('Error saving project', error.message);
        throw error;
    }
}

export const editProject = async (data) => {
    try {
        return await axios.put(`${API_URL}/projetos/${data.id}`, data);
    } catch (error) {
        console.log('Error updating project', error.message);
        throw error;
    }
}

export const deleteProject = async (id) => {
    try {
        return await axios.delete(`${API_URL}/projetos/${id}`);
    } catch (error) {
        console.log('Error deleting project', error.message);
        throw error;
    }
}

export const getProject = async (data) => {
    try {
        return await axios.get(`${API_URL}/projetos/${data}`);
    } catch (error) {
        console.log('Error while calling get project: ', error.message);
    }
}

export const getAllProjects = async () => {
    try {
        return await axios.get(`${API_URL}/projetos`);
    } catch (error) {
        console.log('Error calling getAllProjects', error.message);
    }
}

export const getEmployeeProjectData = async (idprojeto) => {
    try {
        return await axios.get(`${API_URL}/projetos/${idprojeto}/membros`);
    } catch (error) {
        console.log('Error calling get employee project: ', error.message);
    }
}

export const deleteEmployeeFromProject = async (idProject, idEmployee) => {
    try {
        return await axios.delete(`${API_URL}/projetos/${idProject}/membros?idPessoa=${idEmployee}`);
    } catch (error) {
        console.log('Error deleting project', error.message);
        throw error;
    }
}

export const getAllEmployeesContracted = async () => {
    try {
        return await axios.get(`${API_URL}/pessoas?funcionario=true`);
    } catch (error) {
        console.log('Error calling get all employees: ', error.message);
    }
}

export const getAllEmployees = async () => {
    try {
        return await axios.get(`${API_URL}/pessoas`);
    } catch (error) {
        console.log('Error calling get all employees: ', error.message);
    }
}

export const getAllManagers = async () => {
    try {
        return await axios.get(`${API_URL}/pessoas?funcionario=true`);
    } catch (error) {
        console.log('Error calling get all managers: ', error.message);
    }
}

export const addEmployeeToProject = async (idProject, idEmployee) => {
    try {
        return await axios.post(`${API_URL}/projetos/${idProject}/membros?idPessoa=${idEmployee}`);
    } catch (error) {
        console.log('Error adding employee to project', error.message);
        throw error;
    }
}

export const deleteEmployee = async (id) => {
    try {
        return await axios.delete(`${API_URL}/pessoas/${id}`);
    } catch (error) {
        console.log('Error deleting employee', error.message);
        throw error;
    }
}

export const getEmployee = async (data) => {
    try {
        return await axios.get(`${API_URL}/pessoas/${data}`);
    } catch (error) {
        console.log('Error while calling get employee: ', error.message);
    }
}

export const editEmployee = async (data) => {
    try {
        return await axios.put(`${API_URL}/pessoas/${data.id}`, data);
    } catch (error) {
        console.log('Error updating employee', error.message);
        throw error;
    }
}

export const addEmployee = async (data) => {
    try {
        return await axios.post(`${API_URL}/pessoas`, data);
    } catch (error) {
        console.log('Error saving employee', error.message);
        throw error;
    }
}