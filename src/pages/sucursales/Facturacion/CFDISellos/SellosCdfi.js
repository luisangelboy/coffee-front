import React, { forwardRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ListaSellosCDFI from "./ListaSellos";
import RegistroSellos from "./RegistrarSellos";
import IconFactura from "../../../../icons/factura-4.png"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SellosCDFI() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <img
              src={IconFactura}
              alt="icono Factura"
              style={{ width: 100 }}
            />
          </Box>
          Registrar Sellos CFDI
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Seleccion de sellos digitales
            </Typography>
            <Box mx={3}></Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <ContentSellosCFDI />
      </Dialog>
    </div>
  );
}

const ContentSellosCFDI = () => {
  /* const sesion = JSON.parse(localStorage.getItem("sesionCafi")); */

  /* const { loading, data, error, refetch } = useQuery(OBTENER_SERIES, {
      variables: {
        sucursal: sesion.sucursal._id,
        empresa: sesion.empresa._id,
      },
      fetchPolicy: "network-only",
    }); */

  /* if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return <ErrorPage error={error} />;
    }
  
    const { obtenerSeriesCdfi } = data; */

  return (
    <Container>
      <Box my={2}>
        <RegistroSellos /* refetch={refetch} */ />
      </Box>
      <ListaSellosCDFI
      /* obtenerSeriesCdfi={obtenerSeriesCdfi}
          refetch={refetch} */
      />
    </Container>
  );
};
