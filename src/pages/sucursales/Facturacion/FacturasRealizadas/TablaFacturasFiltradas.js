import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, IconButton } from "@material-ui/core";
import { formatoMexico } from "../../../../config/reuserFunctions";
import moment from "moment";
import DetallesFacturaModal from "./DetallesFacturaModal";
import { OBTENER_DOCUMENTO_FACTURA } from "../../../../gql/Facturacion/Facturacion";
import { useApolloClient } from "@apollo/client";
import Snackbar from "@material-ui/core/Snackbar";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ComplementosFactura from "./TablaComplementosFactura";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { label: "expand", padding: "checkbox" },
  { label: "Serie", padding: "checkbox" },
  { label: "Folio", padding: "checkbox" },
  { label: "Folio venta", minWidth: 90 },
  { label: "Fecha", minWidth: 90 },
  { label: "Tipo CDFI", minWidth: 110 },
  { label: "M. de pago", minWidth: 90 },
  { label: "F. de pago", minWidth: 110 },
  { label: "Cliente", minWidth: 100 },
  { label: "Descuento", minWidth: 90 },
  { label: "Subtotal", minWidth: 90 },
  { label: "Total", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    height: "67vh",
  },
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  notas_credito: {
    borderLeft: " 6px solid #FFEAAD",
  },
  complementos: {
    borderLeft: "6px solid #C0DEFF"
  }
}));

export default function TablaFacturasFiltradas({
  data,
  page,
  setPage,
  refetch,
  filtro,
  limit,
}) {
  const classes = useStyles();
  const [factura, setFactura] = useState();
  const [facturaBase64, setFacturaBase64] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: filtro,
      offset: nextPage,
    });
  };

  const handleSelectFactura = (e, factura) => {
    if (e.detail === 2) {
      setFactura(factura);
      setOpen(true);
      getDocumentCfdi(factura.id_cfdi);
    }
  };

  //consultar documento cfdi
  const client = useApolloClient();

  const getDocumentCfdi = async (id) => {
    try {
      setLoading(true);
      const response = await client.query({
        query: OBTENER_DOCUMENTO_FACTURA,
        variables: {
          id,
        },
        fetchPolicy: "network-only",
      });
      setLoading(false);
      setFacturaBase64(response.data.obtenerDocumentCfdi);
    } catch (error) {
      setLoading(false);
      setAlert(true);
    }
  };

  return (
    <Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-labelledby="detalles-factura-modal-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="detalles-factura-modal-title">
          Detalles factura
        </DialogTitle>
        <DetallesFacturaModal
          factura={factura}
          facturaBase64={facturaBase64}
          setOpen={setOpen}
          loading={loading}
        />
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert}
        onClose={() => setAlert(false)}
        message="Hubo un error al cargar los productos"
        autoHideDuration={3000}
      />
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    /* align={column.align} */
                    padding={column.padding}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((data, index) => {
                return (
                  <RenderListFacturas
                    key={index}
                    data={data}
                    handleSelectFactura={handleSelectFactura}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={data.totalDocs}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}

const RenderListFacturas = ({ data, handleSelectFactura }) => {
  const [desplegar, setDesplegar] = useState(false);
  const complement = data.complementos.length > 0 ? true : false;
  const classes = useStyles();

  return (
    <Fragment>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        onClick={(e) => handleSelectFactura(e, data)}
        className={classes.root}
      >
        <TableCell className={data.tipo === "NOTA_CREDITO" ? classes.notas_credito : complement ? classes.complementos : null}>
          {complement ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDesplegar(!desplegar);
              }}
            >
              {desplegar ? (
                <KeyboardArrowUpIcon style={{ fontSize: 18 }} />
              ) : (
                <KeyboardArrowDownIcon style={{ fontSize: 18 }} />
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>{data.serie}</TableCell>
        <TableCell>{data.folio}</TableCell>
        <TableCell>{data.folio_venta}</TableCell>
        <TableCell>
          {moment(data.fecha_registro).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell>{data.cfdi_type}</TableCell>
        <TableCell>{data.payment_method.split("-")[0]}</TableCell>
        <TableCell>{data.payment_form.split("-")[0]}</TableCell>
        <TableCell>{data.receiver.Name}</TableCell>
        <TableCell>${formatoMexico(data.discount)}</TableCell>
        <TableCell>${formatoMexico(data.sub_total)}</TableCell>
        <TableCell>${formatoMexico(data.total)}</TableCell>
      </TableRow>
      <ComplementosFactura
        data={data}
        open={desplegar}
        handleSelectFactura={handleSelectFactura}
      />
    </Fragment>
  );
};
