import { gql } from '@apollo/client';

// ============== ROOMS ==============

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      createdAt
      master {
        id
        username
        email
      }
      guest {
        id
        username
        email
      }
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($roomId: ID!) {
    room(roomId: $roomId) {
      id
      name
      status
      createdAt
      master {
        id
        username
        email
      }
      guest {
        id
        username
        email
      }
      game {
        id
        status
      }
    }
  }
`;

// ============== GAME ==============

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      status
      boardState
      winningPositions
      turnNumber
      currentTurnPlayer {
        id
        username
      }
      player1 {
        id
        username
      }
      player2 {
        id
        username
      }
      winner {
        id
        username
      }
      resultType
      moves {
        id
        row
        col
        symbol
        turnNumber
        user {
          id
          username
        }
      }
    }
  }
`;

// ============== USER ==============

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      wins
      losses
      draws
      points
      totalGames
      winRate
    }
  }
`;

// ============== LEADERBOARD ==============

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($limit: Int) {
    leaderboard(limit: $limit) {
      id
      username
      wins
      losses
      draws
      points
      totalGames
      winRate
    }
  }
`;

// ============== GAME HISTORY ==============

export const GET_GAME_HISTORY = gql`
  query GetGameHistory($userId: ID!) {
    gameHistory(userId: $userId) {
      id
      status
      resultType
      player1 {
        id
        username
      }
      player2 {
        id
        username
      }
      winner {
        id
        username
      }
      startedAt
      finishedAt
    }
  }
`;
