import React, { useState } from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Typography, Box, Snackbar } from "@material-ui/core";
import { Button } from "@material-ui/core";

export default function DescripcionCatalogo({ texto, width }) {
  const [active, setActive] = useState(false);
  const handleClose = () => {
    setActive(false);
  };
  return (
    /*    <Box width={'100%'} flexDirection="column" display="flex" justifyContent="center" alignItems="center">
            <Box   p={2} mt={3} borderRadius={3} boxShadow={0.5}  width={width} style={{backgroundColor:'rgba(161, 236, 248, 0.8)'}}>
                <Typography align="center"  style={{ fontSize: 18, color: 'rgba(38, 78, 84, 0.8)' }}>
                    {texto}
                </Typography>
            </Box>
        </Box> */

    <Box mx={1}>
      <Button
        variant="text"
        color="secondary"
        onClick={() => setActive(true)}
        size="large"
      >
        <HelpOutlineIcon style={{ fontSize: 35, color: "white" }} />
      </Button>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={active}
        onClose={handleClose}
        autoHideDuration={10000}
        message={
          <Box display="flex">
            <Box mr={1} />
            <Typography>{texto}</Typography>
          </Box>
        }
      />
    </Box>
  );
}
