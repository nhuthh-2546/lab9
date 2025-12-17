export const ROOM_CREATED_SUBSCRIPTION = `
  subscription RoomCreated {
    roomCreated {
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

export const ROOM_UPDATED_SUBSCRIPTION = `
  subscription RoomUpdated {
    roomUpdated {
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
        game {
          id
        }
      }
      eventType
      updatedBy {
        id
        username
      }
    }
  }
`;

export const ROOM_UPDATED_BY_ID_SUBSCRIPTION = `
  subscription RoomUpdatedById($roomId: ID!) {
    roomUpdated(roomId: $roomId) {
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
        game {
          id
        }
      }
      eventType
      updatedBy {
        id
        username
      }
    }
  }
`;

export const ROOM_DELETED_SUBSCRIPTION = `
  subscription RoomDeleted {
    roomDeleted {
      id
    }
  }
`;

export const GAME_UPDATED_SUBSCRIPTION = `
  subscription GameUpdated($gameId: ID!) {
    gameUpdated(gameId: $gameId) {
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
      move {
        row
        col
        symbol
        turnNumber
        user {
          id
          username
        }
      }
      eventType
    }
  }
`;
