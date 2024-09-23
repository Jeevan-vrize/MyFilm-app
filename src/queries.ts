import { gql } from '@apollo/client';

// Movies Query
export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      title
      id
      poster_path
      release_date
      vote_average
    }
  }
`;

// Favorites Queries & Mutations
export const GET_FAVORITES = gql`
  query GetFavorites {
    favorites {
      id
      movie_id
      user_id
      created_at
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($id: Int!, $movie_id: Int!, $user_id: UUID!, $created_at: String!) {
    insert_favorites(objects: { id: $id, movie_id: $movie_id, user_id: $user_id, created_at: $created_at }) {
      affected_rows
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($id: Int!) {
    delete_favorites(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

// Watchlist Queries & Mutations
export const GET_WATCHLIST = gql`
  query GetWatchlist {
    watchlist {
      id
      movie_id
      user_id
      created_at
    }
  }
`;

export const ADD_TO_WATCHLIST = gql`
  mutation AddToWatchlist($id: Int!, $movie_id: Int!, $user_id: UUID!, $created_at: String!) {
    insert_watchlist(objects: { id: $id, movie_id: $movie_id, user_id: $user_id, created_at: $created_at }) {
      affected_rows
    }
  }
`;

export const REMOVE_FROM_WATCHLIST = gql`
  mutation RemoveFromWatchlist($id: Int!) {
    delete_watchlist(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;