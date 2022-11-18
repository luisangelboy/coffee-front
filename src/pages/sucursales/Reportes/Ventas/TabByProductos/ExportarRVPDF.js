import React from "react";
import { FaRegFilePdf } from "react-icons/fa";
import Button  from "@material-ui/core/Button";

function ExportarRVPDF() {
  return (
    <div>
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<FaRegFilePdf />}
        //onClick={handleClickOpen}
      >
        Exportar PDF
      </Button>
    </div>
  );
}

export default ExportarRVPDF;
