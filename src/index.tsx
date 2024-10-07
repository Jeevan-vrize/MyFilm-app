import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  uri: 'https://premium-goshawk-67.hasura.app/v1/graphql', 
  headers: {
    'x-hasura-admin-secret': '09PMdL0o87MOH6Xm4ZU6sfh3dmw3I2bDbUVl0dA8S6ywVc8XFnLEe7vJOl5aFe3s',  
  },
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
     
    <App />
  
  </ApolloProvider>
  </React.StrictMode>
);

 