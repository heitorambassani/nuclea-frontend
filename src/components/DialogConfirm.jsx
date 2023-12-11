import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import {useState} from "react";

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const DialogConfirm = (props) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAndReturnId = () => {
        handleClose();
        props.callbackDeleteById(props.idToDelete);
    };

    return (
        <span>
            <Button variant="contained" onClick={handleClickOpen}>
                {props.text}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.confirmMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCloseAndReturnId}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}

export default DialogConfirm;