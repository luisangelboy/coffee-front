import {
  ApolloClient,
  /* createHttpLink, */ InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_ENDPOINT,
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: httpLink,
});

export default client;
