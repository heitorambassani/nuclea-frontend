import {Autocomplete, Box, Button, FormControl, FormGroup, styled, TextField, Typography} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {addEmployeeToProject, getAllEmployees} from "../service/api";
import CustomSnackbar from "../components/CustomSnackbar";

const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% auto 0 auto;

    & > div {
        margin-top: 20px
    }
`
const AddEmployeeProject = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await getAllEmployees();
            setEmployees(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar(false);
    };

    const showMessageSnackbar = (message, type) => {
        setTypeSnackbar(type);
        setMessageSnackbar(message);
        setShowSnackbar(true);
    };

    const saveEmployeeToProject = async () => {
        if (!selectedEmployee) {
            showMessageSnackbar("Por favor, selecione o membro", "error");
            return;
        }

        try {
            await addEmployeeToProject(id, selectedEmployee.id);
            navigate(`/edit/${id}/employee`);
        } catch (error) {
            showMessageSnackbar("Erro ao adicionar membro ao projeto", "error");
        }
    }

    return (
        <Container>
            <Typography variant="h4">Adicionar Membro ao Projeto</Typography>
            <FormControl>
                <Autocomplete
                    disablePortal
                    id="combo-membro"
                    options={employees}
                    getOptionLabel={(option) => option.nome}
                    sx={{width: 300}}
                    onChange={(event, newValue) => setSelectedEmployee(newValue)}
                    renderInput={(params) => <TextField {...params} label="Membro" variant="outlined"/>}
                />
            </FormControl>
            <FormControl>
                <Box display="flex" justifyContent="space-between" style={{width: 310}}>
                    <Button variant="contained" color="error" style={{width: 150}} component={Link}
                            to={`/edit/${id}/employee`}>Cancelar</Button>
                    <Button variant="contained" style={{width: 150}} onClick={() => saveEmployeeToProject()}>Salvar</Button>
                </Box>
            </FormControl>
            <CustomSnackbar
                open={showSnackbar}
                message={messageSnackbar}
                severity={typeSnackbar}
                handleClose={handleCloseSnackbar}
            >
            </CustomSnackbar>
        </Container>

    )
}

export default AddEmployeeProject;