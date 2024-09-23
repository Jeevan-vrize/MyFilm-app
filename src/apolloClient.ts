import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://accurate-grubworm-49.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': '32VE49dGtUiBH7pRRFZqV6pJGdV7yR56qH9rii8foXZaJyZTH2TBCdtMPeIgVYk9', // Ensure this is correct
  },
});

export default client;