import {
    Button,
    Container,
    Grid,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import DialogConfirm from "../components/DialogConfirm";
import CustomSnackbar from "../components/CustomSnackbar";
import {useEffect, useState} from "react";
import {deleteEmployeeFromProject, getEmployeeProjectData, getProject} from "../service/api";

const StyledTable = styled(Table)`
    width: 90%;
    margin: 10px auto 0 auto;
`;

const Thead = styled(TableRow)`
    background: #000;

    & > th {
        color: #fff;
        font-size: 20px;
    }
`;

const TBody = styled(TableRow)`
    & > td {
        color: #000;
        font-size: 20px;
    }
`;

const initialValues = {
    nome: '',
};
const EditEmployeeProject = () => {

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [employeeProject, setEmployeeProject] = useState([]);
    const [project, setProject] = useState(initialValues);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const responseProject = await getProject(id);
            setProject(responseProject.data);

            const response = await getEmployeeProjectData(id);
            setEmployeeProject(response.data);
        } catch (error) {
            console.error("Error fetching project data: ", error);
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

    const deleteById = async (idEmployee) => {
        try {
            await deleteEmployeeFromProject(id, idEmployee);
            await getData();
            showMessageSnackbar("Membro apagado do projeto com sucesso", "success");
        } catch (e) {
            showMessageSnackbar("Erro ao apagar membro", "error");
        }
    }

    return (
        <Container>
            <Grid item container spacing={1} style={{paddingLeft: 60, paddingTop: 10}}>
                <Grid item>
                    <Button variant="contained" color="secondary" style={{width: 150}} component={Link}
                            to={`/edit/${id}`}>Voltar</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" style={{width: 200}} component={Link}
                            to={`/addEmployee/${id}`}>Adicionar Membro</Button>
                </Grid>
            </Grid>

            <StyledTable>
                <TableHead>
                    <Thead>
                        <TableCell>
                            <Typography variant="h6">Membros</Typography>
                            <Typography variant="subtitle1">{project.nome}</Typography>
                        </TableCell>
                        <TableCell></TableCell>
                    </Thead>
                </TableHead>
                <TableBody>
                    {
                        employeeProject.map(item => (
                            <TBody key={item.id}>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell>
                                    <DialogConfirm text="Apagar" title="Confirmação"
                                                   confirmMessage="Tem certeza que deseja remover o membro?"
                                                   idToDelete={item.id}
                                                   callbackDeleteById={deleteById}
                                    />
                                </TableCell>
                            </TBody>
                        ))
                    }
                </TableBody>
            </StyledTable>

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

export default EditEmployeeProject;