import { gql } from '@apollo/client';

// ============== AUTHENTICATION ==============

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      user {
        id
        username
        email
      }
      accessToken
    }
  }
`;

export const SIGN_IN_USER = gql`
  mutation SignInUser($input: SignInUserInput!) {
    signInUser(input: $input) {
      user {
        id
        username
        email
        wins
        losses
        draws
        points
      }
      accessToken
    }
  }
`;

// ============== ROOMS ==============

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      room {
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
      }
    }
  }
`;

export const JOIN_ROOM = gql`
  mutation JoinRoom($input: JoinRoomInput!) {
    joinRoom(input: $input) {
      room {
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
      }
    }
  }
`;

export const LEAVE_ROOM = gql`
  mutation LeaveRoom($input: LeaveRoomInput!) {
    leaveRoom(input: $input) {
      room {
        id
        guest {
          id
        }
      }
    }
  }
`;

// ============== GAME ==============

export const START_GAME = gql`
  mutation StartGame($input: StartGameInput!) {
    startGame(input: $input) {
      game {
        id
        status
        boardState
        turnNumber
        player1 {
          id
          username
        }
        player2 {
          id
          username
        }
        currentTurnPlayer {
          id
          username
        }
        winner {
          id
          username
        }
        winningPositions
        resultType
      }
    }
  }
`;

export const MAKE_MOVE = gql`
  mutation MakeMove($input: MakeMoveInput!) {
    makeMove(input: $input) {
      move {
        id
        row
        col
        symbol
        turnNumber
      }
      game {
        id
        boardState
        status
        currentTurnPlayer {
          id
          username
        }
        winner {
          id
          username
        }
      }
      gameEnded
      winner {
        id
        username
      }
    }
  }
`;

export const FORFEIT_GAME = gql`
  mutation ForfeitGame($input: ForfeitGameInput!) {
    forfeitGame(input: $input) {
      game {
        id
        status
        winner {
          id
          username
        }
        resultType
      }
    }
  }
`;
