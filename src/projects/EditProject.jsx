import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormGroup, Grid,
    Input,
    InputLabel,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {editProject, getAllManagers, getProject} from "../service/api";
import {Link, useNavigate, useParams} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers";
import {DateTime} from "luxon";
import CustomSnackbar from "../components/CustomSnackbar";

const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% auto 0 auto;

    & > div {
        margin-top: 20px
    }
`

const initialValues = {
    nome: '',
    descricao: '',
    orcamento: '',
    status: '',
    risco: '',
};

const optionsStatus = [
    {label: 'Em análise', status: "EM_ANALISE"},
    {label: 'Análise realizada', status: "ANALISE_REALIZADA"},
    {label: 'Análise aprovada', status: "ANALISE_APROVADA"},
    {label: 'Iniciado', status: "INICIADO"},
    {label: 'Planejado', status: "PLANEJADO"},
    {label: 'Em andamento', status: "EM_ANDAMENTO"},
    {label: 'Encerrado', status: "ENCERRADO"},
    {label: 'Cancelado', status: "CANCELADO"},
];

const getStatus = (itemToFind) => {
    const foundOption = optionsStatus.find(option => option.status === itemToFind);
    return foundOption ? foundOption : null;
};

const getRisco = (itemToFind) => {
    const foundOption = optionsRisco.find(option => option.risco === itemToFind);
    return foundOption ? foundOption : null;
};

const optionsRisco = [
    {label: 'Baixo', risco: "BAIXO"},
    {label: 'Médio', risco: "MEDIO"},
    {label: 'Alto', risco: "ALTO"},
];

const EditProject = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [project, setProject] = useState(initialValues);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedRisco, setSelectedRisco] = useState(null);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataPrevisaoFim, setdataPrevisaoFim] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getManagers();
        getProjectData();
    }, []);

    const getManagers = async () => {
        try {
            const response = await getAllManagers();
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees: ", error);
        }
    }

    const getProjectData = async () => {
        try {
            const response = await getProject(id);
            setProject(response.data);

            const parsedDataInicio = DateTime.fromISO(response.data.dataInicio);
            setDataInicio(parsedDataInicio);

            const parsedDataPrevisaoFim = DateTime.fromISO(response.data.dataPrevisaoFim);
            setdataPrevisaoFim(parsedDataPrevisaoFim);

            setSelectedStatus(getStatus(response.data.status));
            setSelectedRisco(getRisco(response.data.risco));

            setSelectedEmployee(response.data.gerente);

        } catch (error) {
            console.error("Error fetching project data: ", error);
        }
    }

    const showMessageSnackbar = (message, type) => {
        setTypeSnackbar(type);
        setMessageSnackbar(message);
        setShowSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar(false);
    };

    const onValueChange = (e) => {
        setProject({...project, [e.target.name]: e.target.value});
    };

    const editProjectDetail = async () => {
        if (project.nome === "") {
            showMessageSnackbar("Por favor, digite o nome do projeto", "error");
            return;
        }

        if (project.descricao === "") {
            showMessageSnackbar("Por favor, digite a descrição do projeto", "error");
            return;
        }

        const orcamento = parseFloat(project['orcamento']);
        if (isNaN(orcamento)) {
            showMessageSnackbar("Por favor, digite um valor numérico para o orçamento", "error");
            return;
        }

        if (!selectedStatus) {
            showMessageSnackbar("Por favor, selecione o status", "error");
            return;
        }
        const {status} = selectedStatus;
        project['status'] = status;

        if (!selectedRisco) {
            showMessageSnackbar("Por favor, selecione o risco", "error");
            return;
        }
        const {risco} = selectedRisco;
        project['risco'] = risco;

        if (!dataInicio) {
            showMessageSnackbar("Por favor, digite a data início", "error");
            return;
        }
        project['dataInicio'] = dataInicio.toFormat('yyyy-MM-dd');

        if (!dataPrevisaoFim) {
            showMessageSnackbar("Por favor, digite a data previsão fim", "error");
            return;
        }
        project['dataPrevisaoFim'] = dataPrevisaoFim.toFormat('yyyy-MM-dd');

        if (dataInicio > dataPrevisaoFim) {
            showMessageSnackbar("A data de início precisa ser anterior a data previsão fim", "error");
            return;
        }

        if (!selectedEmployee) {
            showMessageSnackbar("Por favor, escolha um gerente", "error");
            return;
        }
        project['gerente'] = { id: selectedEmployee.id };


        try {
            await editProject(project);
            navigate('/all');
        } catch (error) {
            showMessageSnackbar("Erro ao editar projeto", "error");
        }
    }

    return (
        <Container>
            <Typography variant="h4">Editar Projeto</Typography>

            <FormControl>
                <InputLabel>Projeto</InputLabel>
                <Input name="nome" onChange={(e) => onValueChange(e)} value={project.nome} inputProps={{maxLength: 200}}/>
            </FormControl>
            <FormControl>
                <InputLabel>Descrição</InputLabel>
                <Input name="descricao" onChange={(e) => onValueChange(e)} value={project.descricao} inputProps={{maxLength: 5000}} multiline rows="5"/>
            </FormControl>
            <FormControl>
                <InputLabel>Orçamento</InputLabel>
                <Input name="orcamento" onChange={(e) => onValueChange(e)} value={project.orcamento} inputProps={{maxLength: 50}}/>
            </FormControl>
            <FormControl>
                <Autocomplete
                    disablePortal
                    id="combo-status"
                    value={selectedStatus}
                    options={optionsStatus}
                    getOptionLabel={(option) => option.label}
                    sx={{width: 300}}
                    onChange={(event, newValue) => setSelectedStatus(newValue)}
                    renderInput={(params) => <TextField {...params} label="Status" variant="outlined"/>}
                />
            </FormControl>
            <FormControl>
                <Autocomplete
                    disablePortal
                    id="combo-risco"
                    value={selectedRisco}
                    options={optionsRisco}
                    getOptionLabel={(option) => option.label}
                    sx={{width: 300}}
                    onChange={(event, newValue) => setSelectedRisco(newValue)}
                    renderInput={(params) => <TextField {...params} label="Risco" variant="outlined"/>}
                />
            </FormControl>
            <FormControl>
                <DatePicker
                    label="Data Início"
                    value={dataInicio}
                    onChange={(newValue) => setDataInicio(newValue)}
                    format="dd/MM/yyyy"
                    sx={{width: 300}}
                />
            </FormControl>
            <FormControl>
                <DatePicker
                    label="Data Previsão Fim"
                    value={dataPrevisaoFim}
                    onChange={(newValue) => setdataPrevisaoFim(newValue)}
                    format="dd/MM/yyyy"
                    sx={{width: 300}}
                />
            </FormControl>

            <FormControl>
                <Autocomplete
                    disablePortal
                    id="combo-gerente"
                    value={selectedEmployee}
                    options={employees}
                    getOptionLabel={(option) => option.nome}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{width: 300}}
                    onChange={(event, newValue) => setSelectedEmployee(newValue)}
                    renderInput={(params) => <TextField {...params} label="Gerente" variant="outlined"/>}
                />
            </FormControl>

            <FormControl>
                <Grid item container spacing={1}>
                    <Grid item>
                        <Button variant="contained" color="error" style={{width: 150}} component={Link}
                                to={`/all`}>Cancelar</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" style={{width: 150}}
                                onClick={() => editProjectDetail()}>Salvar</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" style={{marginRight: 10, width: 200}}
                                component={Link} to={`/edit/${id}/employee`}>Membros</Button>
                    </Grid>
                </Grid>
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

export default EditProject;