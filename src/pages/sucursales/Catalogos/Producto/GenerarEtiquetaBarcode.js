import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { Print } from "@material-ui/icons";
import Barcode from "react-barcode";

export default function GenerarEtiquetaBarcode({ barcode }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const options = {
    width: 2,
    height: 50,
    format: "CODE128",
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined
  }

  return (
    <Box display="flex" alignItems="center">
      {/* <IconButton
        size="small"
        disabled={!barcode}
        variant="outlined"
        color="default"
        onClick={handleClickOpen}
      >
        <Print />
      </IconButton>
      <Box mx={1} /> */}
      <Typography>{barcode}</Typography>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Barcode value={barcode} {...options} />,
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="primary" startIcon={<Print />}>
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
