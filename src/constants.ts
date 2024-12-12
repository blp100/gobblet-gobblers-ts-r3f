export const PLAYER_INFO = {
  PLAYER1: {
    COLOR: 0xff731d,
    NAME: "PLAYER1",
    ARROW_NAME: "ARROW1",
    WINNER_NAME: "PLAYER1 WINNER",
  },
  PLAYER2: {
    COLOR: 0x5f9df7,
    NAME: "PLAYER2",
    ARROW_NAME: "ARROW2",
    WINNER_NAME: "PLAYER2 WINNER",
  },
};

export const GOBBLER_TYPE = "GOBBLER";

type Size = {
  NAME: string;
  VALUE: number;
};

export const SIZES: Record<string, Size> = {
  SMALL: {
    NAME: "SMALL",
    VALUE: 0.5,
  },
  MEDIUM: {
    NAME: "MEDIUM",
    VALUE: 0.75,
  },
  LARGE: {
    NAME: "LARGE",
    VALUE: 1,
  },
};

export const PLANE_TYPE = "PLANE";
