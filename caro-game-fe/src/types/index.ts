// ============== USER ==============

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
  totalGames?: number;
  winRate?: number;
}

export interface GamePlayer extends User {
  symbol: 'X' | 'O';
}

// ============== INPUT TYPES ==============

// Authentication Inputs
export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignInUserInput {
  email: string;
  password: string;
}

// Room Inputs
export interface CreateRoomInput {
  name: string;
}

export interface JoinRoomInput {
  roomId: string;
}

export interface LeaveRoomInput {
  roomId: string;
}

// Game Inputs
export interface StartGameInput {
  roomId: string;
}

export interface MakeMoveInput {
  gameId: string;
  row: number;
  col: number;
}

export interface ForfeitGameInput {
  gameId: string;
}

// ============== ROOM ==============

export interface Room {
  id: string;
  name: string;
  status?: string;
  master: User;
  guest?: User | null;
  createdAt: string;
  game?: Game | null;
}

export interface CreateRoomResponse {
  createRoom: {
    room: Room;
  };
}

export interface JoinRoomResponse {
  joinRoom: {
    room: Room;
  };
}

export interface LeaveRoomResponse {
  leaveRoom: {
    room: Room;
  };
}

// ============== GAME ==============

export interface Game {
  id: string;
  status: 'Playing' | 'Finished';
  boardState: (string | null)[][];
  winningPositions?: [number, number][];
  turnNumber: number;
  currentTurnPlayer: User;
  player1: User;
  player2: User;
  winner: User | null;
  resultType: 'Win' | 'Draw' | 'Forfeit' | null;
  moves?: Move[];
}

export interface Move {
  id: string;
  row: number;
  col: number;
  symbol: 'X' | 'O';
  turnNumber: number;
  user: User;
}

// Game Response Types
export interface StartGameResponse {
  startGame: {
    game: Game;
  };
}

export interface GetGameResponse {
  game: Game;
}

export interface MakeMoveResponse {
  makeMove: {
    move: Move;
    game: Game;
    gameEnded: boolean;
    winner: User | null;
  };
}

export interface ForfeitGameResponse {
  forfeitGame: {
    game: Game;
  };
}

// ============== LEADERBOARD ==============

export interface LeaderboardEntry {
  id: string;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  totalGames: number;
  winRate: number;
}

export interface GetLeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

// ============== GAME HISTORY ==============

export interface GameHistory {
  id: string;
  status: string;
  resultType: string;
  player1: User;
  player2: User;
  winner: User | null;
  startedAt: string;
  finishedAt: string;
}

export interface GetGameHistoryResponse {
  gameHistory: GameHistory[];
}

// ============== AUTH ==============

export interface RegisterUserResponse {
  registerUser: {
    user: User;
    accessToken: string;
  };
}

export interface SignInUserResponse {
  signInUser: {
    user: User;
    accessToken: string;
  };
}

export interface GetMeResponse {
  me: User;
}

export interface GetRoomResponse {
  room: Room;
}

export interface GetRoomsResponse {
  rooms: Room[];
}
