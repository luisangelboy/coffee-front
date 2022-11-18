import React from "react";
import { FaRegFilePdf } from "react-icons/fa";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../../config/reuserFunctions";
import { formaPago } from "../../../Facturacion/catalogos";
import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import cafiLogo from "../../../../../img/Cafi.svg";
import {
  Close,
  CheckBoxOutlineBlankOutlined,
  CheckBox,
  InfoOutlined,
} from "@material-ui/icons";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useApolloClient } from "@apollo/client";
import { OBTENER_REPORTE_VENTAS_VENTA } from "../../../../../gql/Ventas/ventas_generales";

const useStyles = makeStyles((theme) => ({
  textTable: {
    fontSize: "12px",
  },
}));

export default function ExportarRVPDF({ filtros }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState(false);
  const [loadingPdf, setLoadingPdf] = React.useState(false) 

  const client = useApolloClient();

  /* Queries */
  const getProductos = async () => {
    try {
      setLoading(true);
      const response = await client.query({
        query: OBTENER_REPORTE_VENTAS_VENTA,
        variables: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          filtros,
          limit: 0,
          offset: 0,
        },
        fetchPolicy: "network-only",
      });
      setLoading(false);
      if (response.data) {
        setData(response.data.obtenerVentasByVentaReportes)
        setOpen(true);
      };
      if(response.error) setError(true);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error)
    }
  };

  const handleClickOpen = () => {
    getProductos();
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const printDocument = () => {
    setLoadingPdf(true);
    const divInformation = document.getElementById(
      "filtros-reporte-ventas-container"
    );
    html2canvas(divInformation).then((canvas) => {
      const doc = new jsPDF("p", "mm", "letter");
      //Filter Information
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 5;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, "JPEG", 5, 0, pdfWidth, pdfHeight);
      //Table information
      doc.autoTable({
        html: "#tabla-reporte-ventas",
        theme: "plain",
        margin: { left: 2, right: 1, top: 37 },
        styles: {
          fontSize: 8,
        },
        didDrawPage: function (data) {
          console.log(data);
          let footerStr = `Pagina ${data.pageNumber}`;
          doc.setFontSize(10);
          doc.text(footerStr, 195, 275);
        },
      });
      doc.save("Reporte de ventas.pdf");
      setLoadingPdf(false);
    });
  };

  if (loading) {
    return (
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<CircularProgress size={20} color="inherit" />}
      >
        Exportar PDF
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<InfoOutlined />}
      >
        Exportar PDF
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<FaRegFilePdf />}
        onClick={() => handleClickOpen()}
      >
        Exportar PDF
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <Button
              startIcon={loadingPdf ? <CircularProgress size={20} color="inherit" /> : <FaRegFilePdf />}
              color="primary"
              onClick={() => printDocument()}
            >
              Exportar PDF
            </Button>
            <Box mx={1} />
            <Button startIcon={<Close />} onClick={handleClose}>
              Cerrar
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ContentPDF data={data} filtros={filtros} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ContentPDF = ({ data, filtros }) => {
  const classes = useStyles();
  let total = 0;
  data.docs.forEach((element) => {
    total += element.total;
  });

  return (
    <Box id="reporte-ventas-pdf-container">
      <FiltrosComponentPDF filtros={filtros} />
      <Box mt={2} pb={5}>
        <TableContainer>
          <Table
            size="small"
            stickyHeader
            aria-label="a dense table"
            id="tabla-reporte-ventas"
          >
            <TableHead>
              <TableRow>
                <TableCell>Folio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell width={100}>Cliente</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Caja</TableCell>
                <TableCell>F. Pago</TableCell>
                <TableCell>M. Pago</TableCell>
                <TableCell>Cred. Pendiente</TableCell>
                <TableCell>F. lim. cred.</TableCell>
                <TableCell>Desc.</TableCell>
                <TableCell>SubTotal</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((data, index) => {
                let forma_pago = "-";
                if (data.forma_pago) {
                  const resultForma = formaPago.filter(
                    (res) => res.Value === data.forma_pago
                  );
                  forma_pago = resultForma[0];
                }
                return (
                  <TableRow key={index} role="checkbox" tabIndex={-1}>
                    <TableCell className={classes.textTable}>
                      {data.folio}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {moment(data.fecha_registro).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {data.cliente !== null
                        ? data.cliente.nombre_cliente
                        : "Público general"}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {data.usuario.nombre}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {data.id_caja.numero_caja}
                    </TableCell>
                    <TableCell
                      className={classes.textTable}
                    >{`${forma_pago.Name}`}</TableCell>
                    <TableCell className={classes.textTable}>{`${
                      data.credito ? "Credito" : "Contado"
                    }`}</TableCell>
                    <TableCell className={classes.textTable}>
                      {`$${
                        data.credito
                          ? formatoMexico(data.saldo_credito_pendiente)
                          : 0
                      }`}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {data.credito
                        ? moment(data.fecha_de_vencimiento_credito).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      {`$${data.descuento ? formatoMexico(data.descuento) : 0}`}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      ${formatoMexico(data.subTotal)}
                    </TableCell>
                    <TableCell className={classes.textTable}>
                      ${formatoMexico(data.total)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data) => {
                  return <TableCell key={data} />;
                })}
                <TableCell>Total</TableCell>
                <TableCell>${formatoMexico(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const FiltrosComponentPDF = ({ filtros }) => {
  const {
    fecha_inicio,
    fecha_fin,
    usuario,
    cliente,
    caja,
    publico_general,
    metodo_pago,
    forma_pago,
    canceladas,
    facturadas,
    notas_credito,
    vigentes,
    vencidas,
    liquidadas
  } = filtros;
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const obtenerFormaPago = () => {
    let formaP = "todas";
    if (forma_pago) {
      const forma = formaPago.filter((res) => res.Value === forma_pago);
      formaP = forma[0].Name;
    }

    return formaP;
  };
  return (
    <Box mx={2} id="filtros-reporte-ventas-container">
      <Box display="flex" style={{ height: 80 }} alignItems="center" mb={2}>
        <img
          src={sesion.empresa.imagen ? sesion.empresa.imagen : cafiLogo}
          alt="cafi punto de venta"
          height="100%"
        />
        <Box mx={2} />
        <Typography variant="h6">Reporte de ventas</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item>
          <Box display="flex">
            <Typography>
              <b>Fecha Inicio:</b>
            </Typography>
            <Box mx={1} />
            <Typography>
              {fecha_inicio && fecha_fin
                ? formatoFechaCorta(fecha_inicio)
                : "-"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography>
              <b>Fecha Fin:</b>
            </Typography>
            <Box mx={1} />
            <Typography>
              {fecha_fin && fecha_inicio ? formatoFechaCorta(fecha_fin) : "-"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography>
              <b>Vendedor:</b>
            </Typography>
            <Box mx={1} />
            <Typography>{usuario ? usuario : "todos"}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex">
            <Typography>
              <b>Cliente:</b>
            </Typography>
            <Box mx={1} />
            <Typography>
              {publico_general
                ? "Público general"
                : cliente
                ? cliente
                : "todos"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography>
              <b>Caja:</b>
            </Typography>
            <Box mx={1} />
            <Typography>{caja ? caja : "todas"}</Typography>
          </Box>
          <Box display="flex">
            <Typography>
              <b>Sucursal:</b>
            </Typography>
            <Box mx={1} />
            <Typography>{sesion.sucursal.nombre_sucursal}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex">
            <Typography>
              <b>Método de pago:</b>
            </Typography>
            <Box mx={1} />
            <Typography>
              {metodo_pago
                ? metodo_pago === "PPD"
                  ? "crédito"
                  : "Contado"
                : "todos"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography>
              <b>Forma de pago:</b>
            </Typography>
            <Box mx={1} />
            <Typography>{obtenerFormaPago()}</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex">
            {canceladas ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Canceladas</b>
            </Typography>
          </Box>
          <Box display="flex">
            {facturadas ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Facturadas</b>
            </Typography>
          </Box>
          <Box display="flex">
            {notas_credito ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Notas crédito</b>
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex">
            {vigentes ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Vigentes</b>
            </Typography>
          </Box>
          <Box display="flex">
            {vencidas ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Vencidas</b>
            </Typography>
          </Box>
          <Box display="flex">
            {liquidadas ? <CheckBox /> : <CheckBoxOutlineBlankOutlined />}
            <Box mx={0.5} />
            <Typography>
              <b>Pagadas</b>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
