import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Wifi, WifiOff } from "@material-ui/icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from "@material-ui/core/Badge";
import ComponentGetDataDBCloud from './ComponentGetDataDBCloud';
import ComponentGetDataDBCloudAdmin from './ComponentGetDataDBCloudAdmin';
import ComponentVentasToCloud from './ComponentVentasToCloud';

export default function ComponentOnline ({isOnline, classes, ventasToCloud, sesion, fromVentas}) {
    const [openMenu, setOpenMenu] = useState(null);
    const handleClick = (event) => {
      setOpenMenu(event.currentTarget);
    };
    const handleClose = () =>{
      setOpenMenu(null);
    }
  
    return (
        <Box display="flex" alignItems={'center'}  >
          <Button
            onClick={handleClick}
        
            className={classes.buttonIcon}
            style={
              { color: "white", 
              borderColor: "white",
              
              }
            }
          >
          {
            (isOnline) ? 
              (ventasToCloud.length) ? 
                <Badge
                  badgeContent={1}
                  variant="dot"
                  color="secondary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Wifi htmlColor="#81c784" style={{fontSize: 20}} />
                </Badge>
              :
                <Wifi htmlColor="#81c784" style={{fontSize: 20}} />
            :
            <WifiOff htmlColor="#bdbdbd"  style={{fontSize: 20}} />
          }
           
          </Button>
          {
            (fromVentas) ? 
              <Menu
              id="simple-menu"
              anchorEl={openMenu}
              keepMounted
              open={openMenu}
              onClose={handleClose}
              >
            
                <MenuItem onClick={handleClose}>
                  <ComponentVentasToCloud ventasToCloud={ventasToCloud} isOnline={isOnline} classes={classes} />
                </MenuItem>
          
                <MenuItem onClick={handleClose}>
                  <ComponentGetDataDBCloud isOnline={isOnline} classes={classes} empresa={sesion.empresa} sucursal={sesion.sucursal} /> 
                </MenuItem>
             
              </Menu>
           :
           <Menu
            id="simple-menu"
            anchorEl={openMenu}
            keepMounted
            open={openMenu}
            onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <ComponentGetDataDBCloudAdmin isOnline={isOnline} classes={classes} empresa={sesion.empresa} sucursal={sesion.sucursal} /> 
              </MenuItem>                                                                
            </Menu>   
          }  
        </Box>
    );
  };