import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { AppBar, Box, Tabs } from "@material-ui/core";
import { Tab } from "@material-ui/core";
import { FcPaid, FcShop, FcSurvey, FcNews } from "react-icons/fc";

import Catalogos from "./Departamentos/Catalogos";
import MiEmpresa from "./Departamentos/MiEmpresa";

import SnackBarMessages from "../../../../../components/SnackBarMessages";
import Compras from "./Departamentos/Compras";
import Almacenes from "./Departamentos/Almacenes";
import Tesoreria from "./Departamentos/Tesoreria";
import Reportes from "./Departamentos/Reportes";
import Ventas from "./Departamentos/Ventas";
import Facturacion from "./Departamentos/Facturacion";
import almancenIcon from "../../../../../icons/almacen.svg"
import moneyIcon from "../../../../../icons/money.svg"
import facturaIcon from "../../../../../icons/factura.svg"
import cartIcon from "../../../../../icons/ventas/cart-add.svg"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-reg-product-${index}`}
      aria-labelledby={`reg-product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1} minHeight="20vh">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `reg-product-tab-${index}`,
    "aria-controls": `tabpanel-reg-product-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconSvg: {
    width: 30,
  },
  icon: {
    fontSize: 30,
  },
}));

export default function AsignarPermisos({ obtenerAccesos, arregloAccesos }) {
  const classes = useStyles();
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <AppBar position="static" color="transparent" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab
            label="Mi empresa"
            icon={<FcShop className={classes.icon} />}
            {...a11yProps(0)}
          />
          <Tab
            label="Almacenes"
            icon={
              <img
                src={almancenIcon}
                alt="icono almacen"
                className={classes.iconSvg}
              />
            }
            {...a11yProps(1)}
          />
          <Tab
            label="Compras"
            icon={<FcPaid className={classes.icon} />}
            {...a11yProps(2)}
          />
          <Tab
            label="Catalogos"
            icon={<FcNews className={classes.icon} />}
            {...a11yProps(3)}
          />
          <Tab
            label="Tesoreria"
            icon={
              <img
                src={moneyIcon}
                alt="icono money"
                className={classes.iconSvg}
              />
            }
            {...a11yProps(4)}
          />
          <Tab
            label="Reportes"
            icon={<FcSurvey className={classes.icon} />}
            {...a11yProps(5)}
          />
          <Tab
            label="Facturación"
            icon={
              <img
                src={facturaIcon}
                alt="icono factura"
                className={classes.iconSvg}
              />
            }
            {...a11yProps(6)}
          />
          <Tab
            label="Ventas"
            icon={
              <img
                src={cartIcon}
                alt="icono ventas"
                className={classes.iconSvg}
              />
            }
            {...a11yProps(7)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Box p={2}>
          <MiEmpresa
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box p={2}>
          <Almacenes
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box p={2}>
          <Compras
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box p={0}>
          <Catalogos
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Box p={2}>
          <Tesoreria
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Box p={2}>
          <Reportes
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <Box p={2}>
          <Facturacion
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={7}>
        <Box p={2}>
          <Ventas
            obtenerAccesos={obtenerAccesos}
            arregloAccesos={arregloAccesos}
          />
        </Box>
      </TabPanel>
    </Box>
  );
}
