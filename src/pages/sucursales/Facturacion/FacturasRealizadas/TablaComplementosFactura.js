import React from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { formatoMexico } from "../../../../config/reuserFunctions";
import moment from "moment";
import { makeStyles } from "@material-ui/core";

const columns = [
  { label: "Serie", padding: "checkbox" },
  { label: "Folio", padding: "checkbox" },
  { label: "Folio venta", minWidth: 90 },
  { label: "Fecha", minWidth: 90 },
  { label: "Tipo CDFI", minWidth: 110 },
  { label: "M. de pago", minWidth: 90 },
  { label: "F. de pago", minWidth: 110 },
  { label: "Cliente", minWidth: 100 },
  { label: "Parcialidad", minWidth: 90 },
  { label: "Saldo anterior", minWidth: 90 },
  { label: "Cantidad", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
  }));

export default function ComplementosFactura({ data, open, handleSelectFactura }) {
    const classes = useStyles();

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Complementos de pago
            </Typography>
            <Table size="small" aria-label="purchases">
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
                {data.complementos?.map((cfdi, index) => {
                  return (
                    <TableRow hover key={index} onClick={(e) => handleSelectFactura(e, cfdi)} className={data.complementos.length === index+1 ? classes.root : ""}>
                      <TableCell>{cfdi.serie}</TableCell>
                      <TableCell>{cfdi.folio}</TableCell>
                      <TableCell>{cfdi.folio_venta}</TableCell>
                      <TableCell>
                        {moment(cfdi.fecha_registro).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{cfdi.cfdi_type}</TableCell>
                      <TableCell>
                        {
                          cfdi.complement?.Payments[0]?.RelatedDocuments[0]
                            ?.PaymentMethod
                        }
                      </TableCell>
                      <TableCell>
                        {cfdi.complement?.Payments[0]?.PaymentForm}
                      </TableCell>
                      <TableCell>{cfdi.receiver.Name}</TableCell>
                      <TableCell>
                        {
                          cfdi.complement?.Payments[0]?.RelatedDocuments[0]
                            ?.PartialityNumber
                        }
                      </TableCell>
                      <TableCell>
                        ${formatoMexico(cfdi.complement?.Payments[0]?.RelatedDocuments[0]
                            ?.PreviousBalanceAmount)}
                      </TableCell>
                      <TableCell>
                        ${formatoMexico(cfdi.complement?.Payments[0]?.Amount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
