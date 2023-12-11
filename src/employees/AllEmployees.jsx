import {Button, Container, styled, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {deleteEmployee, getAllEmployees} from "../service/api";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import DialogConfirm from "../components/DialogConfirm";
import CustomSnackbar from "../components/CustomSnackbar";

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

const AllEmployees = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [employee, setEmployee] = useState([]);

    const findAllEmployees = async () => {
        let response = await getAllEmployees();
        if (!response) {
            showMessageSnackbar("Erro ao buscar pessoas", "error");
            return;
        }
        setEmployee(response.data);
    };

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

    const deleteById = async (id) => {
        try {
            await deleteEmployee(id);
            await findAllEmployees();
            showMessageSnackbar("Pessoa apagada com sucesso", "success");
        } catch (e) {
            showMessageSnackbar("Erro ao apagar pessoa. Verifique se está associado a algum projeto antes.", "error");
        }
    }

    useEffect(() => {
        findAllEmployees();
    }, []);

    return (
        <Container>
            <Button variant="contained" style={{marginTop: 10, marginLeft: 60}}
                    component={Link} to={`/add-employee`}>Adicionar Pessoa</Button>
            <StyledTable>
                <TableHead>
                    <Thead>
                        <TableCell>Nome</TableCell>
                        <TableCell>É funcionário?</TableCell>
                        <TableCell></TableCell>
                    </Thead>
                </TableHead>
                <TableBody>
                    {
                        employee.map(item => (
                            <TBody key={item.id}>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell><div className="description">{item.funcionario ? "Sim" : "Não"}</div></TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" style={{marginRight: 10}}
                                            component={Link} to={`/edit-employee/${item.id}`}>Editar</Button>
                                    <DialogConfirm text="Apagar" title="Confirmação"
                                                   confirmMessage="Tem certeza que deseja apagar a pessoa?"
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

export default AllEmployees;