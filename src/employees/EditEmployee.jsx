import {
    Autocomplete,
    Button,
    FormControl,
    FormGroup,
    Grid,
    Input,
    InputLabel,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {editEmployee, getEmployee} from "../service/api";
import {Link, useNavigate, useParams} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers";
import CustomSnackbar from "../components/CustomSnackbar";
import {DateTime} from "luxon";

const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% auto 0 auto;

    & > div {
        margin-top: 20px
    }
`

const initialValues = {
    nome: '',
    dataNascimento: '',
    cpf: '',
    funcionario: '',
};

const optionsEmployee = [
    {label: 'Sim', value: "true"},
    {label: 'Não', value: "false"}
];

const getOptionsEmployee = (itemToFind) => {
    const foundOption = optionsEmployee.find(option => {
        return (option.value + "") === (itemToFind + "");
    });

    return foundOption ? foundOption : null;
};

const EditEmployee = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [employee, setEmployee] = useState(initialValues);
    const [dataNascimento, setDataNascimento] = useState(null);
    const [isEmployee, setIsEmployee] = useState(false);

    const {id} = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getEmployeeData();
    }, []);

    const getEmployeeData = async () => {
        try {
            const response = await getEmployee(id);
            setEmployee(response.data);

            const parsedDataNascimento = DateTime.fromISO(response.data.dataNascimento);
            setDataNascimento(parsedDataNascimento);

            setIsEmployee(getOptionsEmployee(response.data.funcionario));
        } catch (error) {
            console.error("Error fetching employee data: ", error);
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
        setEmployee({...employee, [e.target.name]: e.target.value});
    };

    const editEmployeeDetail = async () => {
        if (employee.nome === "") {
            showMessageSnackbar("Por favor, digite o nome da pessoa", "error");
            return;
        }

        if (employee.cpf === "") {
            showMessageSnackbar("Por favor, digite o CPF da pessoa", "error");
            return;
        }

        if (!dataNascimento) {
            showMessageSnackbar("Por favor, digite a data de nascimento", "error");
            return;
        }
        employee['dataNascimento'] = dataNascimento.toFormat('yyyy-MM-dd');

        employee.funcionario = isEmployee.value === 'true';

        try {
            await editEmployee(employee);
            navigate('/employees');
        } catch (error) {
            showMessageSnackbar("Erro ao editar pessoa", "error");
        }
    }

    return (
        <Container>
            <Typography variant="h4">Editar Pessoa</Typography>

            <FormControl>
                <InputLabel>Nome</InputLabel>
                <Input name="nome" onChange={(e) => onValueChange(e)} value={employee.nome} inputProps={{maxLength: 100}}/>
            </FormControl>
            <FormControl>
                <DatePicker
                    label="Data de Nascimento"
                    value={dataNascimento}
                    onChange={(newValue) => setDataNascimento(newValue)}
                    format="dd/MM/yyyy"
                    sx={{width: 300}}
                />
            </FormControl>
            <FormControl>
                <InputLabel>CPF</InputLabel>
                <Input name="cpf" onChange={(e) => onValueChange(e)} value={employee.cpf} inputProps={{maxLength: 15}}/>
            </FormControl>

            <FormControl>
                <Autocomplete
                    disablePortal
                    id="combo-status"
                    value={isEmployee}
                    options={optionsEmployee}
                    getOptionLabel={(option) => option.label || "true"}
                    sx={{width: 300}}
                    onChange={(event, newValue) => setIsEmployee(newValue)}
                    renderInput={(params) => <TextField {...params} label="É funcionário?" variant="outlined"/>}
                />
            </FormControl>

            <FormControl>
                <Grid item container spacing={1}>
                    <Grid item>
                        <Button variant="contained" color="error" style={{width: 150}} component={Link}
                                to={`/employees`}>Cancelar</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" style={{width: 150}}
                                onClick={() => editEmployeeDetail()}>Salvar</Button>
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

export default EditEmployee;