import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { FcShop, FcPaid, FcSurvey, FcNews } from "react-icons/fc";
import { Box, Tab, Tabs, AppBar } from "@material-ui/core";
import Empresa from "./Empresa/Empresa";
import Compras from "./Compras/Compras";
import Catalogos from "./Catalogos/Catalogos";
import IndexTesoreria from "./Tesoreria/IndexTesoreria";
import Facturacion from "./Facturacion/Facturacion";
import Almacenes from "./Almacenes/Almacenes";
import { withRouter } from "react-router";
import Reportes from "./Reportes/Reportes";
import AlmacenImg from "../../icons/almacen.svg"
import MoneyImg from "../../icons/money.svg"
import FacturaImg from "../../icons/factura.svg"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} my={6} minHeight="50vh">
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
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "94vh",
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    fontSize: 100,
  },
  iconSvg: {
    width: 100,
  },
  iconSvgVenta: {
    width: 90,
  },
}));

function AdminInicio(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      {/* <Toolbar /> */}
      <Box>
        <AppBar position="static" color="default" elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered /* variant="scrollable" */
            scrollButtons="on"
          >
            <Tab
              label="Mi empresa"
              icon={<FcShop className={classes.icon} />}
              {...a11yProps(0)}
            />

            <Tab
              label="Catalogos"
              icon={<FcNews className={classes.icon} />}
              {...a11yProps(1)}
            />
            <Tab
              label="Almacenes"
              icon={
                <img
                  src={AlmacenImg}
                  alt="icono almacen"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(2)}
            />

            <Tab
              label="Compras"
              icon={<FcPaid className={classes.icon} />}
              {...a11yProps(3)}
            />
            {/*  <Tab
              label="Ventas"
              icon={
                <img
                  src="cart-add.svg"
                  alt="icono ventas"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(4)}
              onClick={() => props.history.push("/ventas/venta-general")}
            /> */}
            <Tab
              label="Reportes"
              icon={<FcSurvey className={classes.icon} />}
              {...a11yProps(4)}
            />
            <Tab
              label="Tesoreria"
              icon={
                <img
                  src={MoneyImg}
                  alt="icono money"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(5)}
            />
            <Tab
              label="Facturación"
              icon={
                <img
                  src={FacturaImg}
                  alt="icono factura"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(6)}
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0}>
            <Empresa />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Catalogos />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Almacenes />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Compras />
          </TabPanel>
          {/* <TabPanel value={value} index={4}>
            ventas
          </TabPanel> */}
          <TabPanel value={value} index={4}>
            <Reportes />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <IndexTesoreria />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <Facturacion />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}

export default withRouter(AdminInicio);
