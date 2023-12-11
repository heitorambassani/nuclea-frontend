import {Button, Container, styled, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {deleteProject, getAllProjects} from "../service/api";
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

const AllProjects = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("success");

    const [project, setProject] = useState([]);

    const findAllProjects = async () => {
        let response = await getAllProjects();
        if (!response) {
            showMessageSnackbar("Erro ao buscar projetos", "error");
            return;
        }
        setProject(response.data);
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
            await deleteProject(id);
            await findAllProjects();
            showMessageSnackbar("Projeto apagado com sucesso", "success");
        } catch (e) {
            showMessageSnackbar(e.response.data, "error");
        }
    }

    useEffect(() => {
        findAllProjects();
    }, []);

    return (
        <Container>
            <Button variant="contained" style={{marginTop: 10, marginLeft: 60}}
                    component={Link} to={`/add`}>Adicionar Projeto</Button>
            <StyledTable>
                <TableHead>
                    <Thead>
                        <TableCell>Projeto</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell></TableCell>
                    </Thead>
                </TableHead>
                <TableBody>
                    {
                        project.map(item => (
                            <TBody key={item.id}>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell><div className="description">{item.descricao}</div></TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" style={{marginRight: 10}}
                                            component={Link} to={`/edit/${item.id}`}>Editar</Button>
                                    <DialogConfirm text="Apagar" title="Confirmação"
                                                   confirmMessage="Tem certeza que deseja apagar o projeto?"
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

export default AllProjects;