import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@material-ui/core";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import routes from "./config/routes";
import theme from "./config/colors";
import ConexionDetect from "./components/Connection/ConexionDetect";
import client from "./config/apollo";
import { ApolloProvider } from "@apollo/client";
import { AccesosProvider } from "./context/Accesos/accesosCtx";
import { ClienteProvider } from "./context/Catalogos/crearClienteCtx";

function App() {
  return (
    <Box height="100vh" className="App">
      <CssBaseline />
      <ApolloProvider client={client}>
        <AccesosProvider>
          <ClienteProvider>
            <ThemeProvider theme={theme}>
              <ConexionDetect/>
              <Router>
                <Switch>
                  {routes.map((route, index) => (
                    <RoutesWithSubRoutes key={index} {...route} />
                  ))}
                </Switch>
              </Router>
            </ThemeProvider>
          </ClienteProvider>
        </AccesosProvider>
      </ApolloProvider>
    </Box>
  );
}

function RoutesWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component routes={route.routes} {...props} />}
    />
  );
}

export default App;
