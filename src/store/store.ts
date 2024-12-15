import { create } from "zustand";
import { SIZES, GOBBLER_TYPE, PLANE_TYPE, PLAYER_INFO } from "../constants";
import { Mesh, Object3D } from "three";

const initialMap = new Map<string, Array<Mesh>>();
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    initialMap.set(i + "" + j, []);
  }
}

interface GameState {
  board: Map<string, Array<Object3D>>;
  setBoard: (board: Map<string, Array<Object3D>>) => void;
  activePlayer: typeof PLAYER_INFO.PLAYER1 | null;
  setPlayer: (activePlayer: typeof PLAYER_INFO.PLAYER1 | null) => void;
  activeGobbler: Object3D | null;
  setActiveGobbler: (activeGobbler: Object3D | null) => void;
  unsetActiveGobbler: () => void;
  activePlane: Object3D | null;
  setActivePlane: (activePlane: Object3D | null) => void;
  winner: typeof PLAYER_INFO.PLAYER1 | null;
  setWinner: (winner: typeof PLAYER_INFO.PLAYER1) => void;
  phase: "ready" | "playing" | "animated" | "ended";
  start: () => void;
  moveGobbler: () => void;
  nextStep: () => void;
  restart: () => void;
  end: () => void;
}

const useStore = create<GameState>((set, get) => ({
  board: initialMap,
  setBoard: (board) => set(() => ({ board })),
  activePlayer: PLAYER_INFO.PLAYER1,
  setPlayer: (activePlayer) => set(() => ({ activePlayer })),
  activeGobbler: null,
  setActiveGobbler: (activeGobbler) => set(() => ({ activeGobbler })),
  unsetActiveGobbler: () => set(() => ({ activeGobbler: null })),
  activePlane: null,
  setActivePlane: (activePlane) => set(() => ({ activePlane })),
  winner: null,
  setWinner: (winner) => set(() => ({ winner })),
  /**
   * Phases
   */
  phase: "playing",
  start: () => {
    set((state) => {
      if (state.phase === "ready") {
        return {
          phase: "playing",
          board: initialMap,
          activeGobbler: null,
          activePlane: null,
          winner: null,
        };
      }
      return {};
    });
  },
  moveGobbler: () => {
    set((state) => {
      if (state.phase === "playing") {
        return { phase: "animated" };
      }
      return {};
    });
  },
  nextStep: () => {
    set((state) => {
      if (state.phase === "animated") {
        return {
          phase: "playing",
          activeGobbler: null,
          activePlane: null,
          activePlayer:
            state.activePlayer === PLAYER_INFO.PLAYER1
              ? PLAYER_INFO.PLAYER2
              : PLAYER_INFO.PLAYER1,
        };
      }
      return {};
    });
  },
  restart: () => {
    set((state) => {
      if (state.phase === "playing" || state.phase === "ended") {
        return { phase: "ready" };
      }
      return {};
    });
  },
  end: () => {
    set((state) => {
      if (state.phase === "playing") {
        return { phase: "ended" };
      }
      return {};
    });
  },
}));

export default useStore;
