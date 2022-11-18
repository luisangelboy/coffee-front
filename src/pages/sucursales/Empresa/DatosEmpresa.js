import React,{useState} from 'react';
import {  DialogContent, Button, Box, Dialog, Slide, Typography, AppBar, Toolbar } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import { FcNook } from "react-icons/fc";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MisDatos from './Datos/MisDatos';
import InformacionFiscal from './InformacionFiscal/InformacionFiscal';
const useStyles = makeStyles((theme) => ({

  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
  subtitle: {
    marginLeft: "10px",
    width: "100%",
  },
  require: {
    "& span": {
      color: "red",
    },
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    border: "dashed 2px black",
    borderRadius: "100%",
  },
  avatar: {
    width: "90%",
    height: "90%",
    "& > .icon": {
      fontSize: 100,
    },
  },
 
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function MiEmpresa() {
  const classes = useStyles();
	const [value, setValue] = useState(0);
	const [open, setOpen] = useState(false);
	
  const handleChange = (event, value) => {
    setValue(value);
    
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
	
  const handleClose = () => {
    setOpen(false);
  };

  const RenderViews = () => {
    switch (value) {
      case 1:
        return(<InformacionFiscal setOpen={setOpen} />);
      default:
        return(<MisDatos setOpen={setOpen} />);
    }
  }
  
	return (
		<div>
    <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcNook className={classes.icon} />
          </Box>
          Datos de empresa
        </Box>
      </Button>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Datos
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        
          <Box >
            <Tabs
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              centered
            >
              <Tab label="Datos empresa" value={0} />
              <Tab label="Datos fiscales" value={1} />
            </Tabs>
          </Box>
          <DialogContent>  
            <RenderViews />
          </DialogContent>
      </Dialog>  
      
     
			
		</div>
	);
}
