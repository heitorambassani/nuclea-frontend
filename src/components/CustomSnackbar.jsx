import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CustomSnackbar = ({open, message, severity, handleClose}) => {
    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <MuiAlert onClose={handleClose} severity={severity}>
                    {message}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default CustomSnackbar;