import React from "react";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import PrintIcon from "@material-ui/icons/Print";
import SettingsIcon from "@material-ui/icons/Settings";
import SelectPrinter from "./SelectPrinter";

export default function TicketPrinterComponent({ turnoEnCurso, icon, text }) {
  const [open, setOpen] = React.useState(false);
  const [print, setPrint] = React.useState(
    localStorage.getItem("cafiTicketPrint")
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => handleClickOpen()}
        startIcon={
          <Badge
            badgeContent={1}
            variant="dot"
            color={print ? "default" : "secondary"}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {icon ? (
              <SettingsIcon style={{ fontSize: 20 }} />
            ) : (
              <PrintIcon style={{ fontSize: 20 }} />
            )}
          </Badge>
        }
        style={!turnoEnCurso ? { color: "white", borderColor: "white" } : null}
      >
        {text ? text : "Impresora"}
      </Button>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="select-printer"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="select-printer">
          Configuración impresora de tickets
        </DialogTitle>
        <SelectPrinter
          handleClose={handleClose}
          print={print}
          setPrint={setPrint}
        />
      </Dialog>
    </div>
  );
}
