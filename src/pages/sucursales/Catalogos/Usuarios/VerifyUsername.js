import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  CircularProgress,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { UsuarioContext } from "../../../../context/Catalogos/usuarioContext";
import { VERIFY_USER } from "../../../../gql/Catalogos/usuarios";
import { useDebounce } from "use-debounce/lib";
import { useMutation } from "@apollo/client";
import { Done } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "500",
    "& span": {
      color: "red",
    },
  },
}));

export default function VerifyUsername({ accion }) {
  const classes = useStyles();
  const { usuario, username, setUsername } = useContext(
    UsuarioContext
  );
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [verifyUserName] = useMutation(VERIFY_USER);
  const [value] = useDebounce(username, 800);

  const verificar = async (value) => {
    if (!value) return;
    try {
      setLoading(true);
      await verifyUserName({
        variables: {
          username: value,
        },
      });
      setStatus(true);
      setLoading(false);
    } catch (error) {
      setStatus(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    verificar(value);
  }, [value]);

  return (
    <Fragment>
      <Typography className={classes.title}>Username</Typography>
      <TextField
        fullWidth
        placeholder="Ej: Juan96"
        autoComplete="new-password"
        type="text"
        size="small"
        disabled={accion !== "registrar" && usuario.username_login}
        error={status === false}
        variant="outlined"
        value={usuario.username_login ? usuario.username_login : username}
        helperText={status === false ? "Este username ya existe" : ""}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : status === true ? (
                <Done color="primary" />
              ) : null}
            </InputAdornment>
          ),
        }}
        onChange={(e) => setUsername(e.target.value)}
      />
    </Fragment>
  );
}
