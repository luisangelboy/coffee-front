import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { FaRegFileCode, FaRegFilePdf } from "react-icons/fa";
import { Close } from "@material-ui/icons";
import ErrorPage from "../../../../components/ErrorPage";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import InnerHTML from "dangerously-set-html-content";

const base64toBlob = (data, type) => {
  const bytes = atob(data);
  let length = bytes.length;
  let out = new Uint8Array(length);

  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type });
};

export default function DetallesFacturaModal({
  factura,
  facturaBase64,
  setOpen,
  loading,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Fragment>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <CircularProgress />
            <Typography variant="h6">Cargando...</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" startIcon={<Close />}>
            Cerrar
          </Button>
          <Button startIcon={<FaRegFilePdf />} disabled>
            PDF
          </Button>
          <Button startIcon={<FaRegFileCode />} disabled>
            XML
          </Button>
        </DialogActions>
      </Fragment>
    );
  }

  if (!facturaBase64 || !factura) {
    return (
      <Fragment>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <ErrorPage />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" startIcon={<Close />}>
            Cerrar
          </Button>
          <Button startIcon={<FaRegFilePdf />} disabled>
            PDF
          </Button>
          <Button startIcon={<FaRegFileCode />} disabled>
            XML
          </Button>
        </DialogActions>
      </Fragment>
    );
  }
  //decodificar base64 an html
  var decodedHTML = window.atob(facturaBase64.htmlBase64);
  //decodificar pdfBase64 a pdf
  const blob_pdf = base64toBlob(facturaBase64.pdfBase64, "application/pdf");
  const url_pdf = URL.createObjectURL(blob_pdf);

  //decodificar xmlBase64 a xml
  const blob_xml = base64toBlob(facturaBase64.xmlBase64, "text/plain");
  const url_xml = URL.createObjectURL(blob_xml);

  return (
    <Fragment>
      <DialogContent>
        <InnerHTML html={decodedHTML} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" startIcon={<Close />}>
          Cerrar
        </Button>
        <Button
          color="primary"
          startIcon={<FaRegFilePdf />}
          download={`CFDI ${factura.fecha_registro} ${factura.receiver.Name}`}
          href={url_pdf}
        >
          PDF
        </Button>
        <Button
          color="primary"
          startIcon={<FaRegFileCode />}
          download={`CFDI ${factura.fecha_registro} ${factura.receiver.Name}.xml`}
          href={url_xml}
        >
          XML
        </Button>
      </DialogActions>
    </Fragment>
  );
}
