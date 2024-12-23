import { Object3D, Object3DEventMap } from "three";
import { PLAYER_INFO } from "../constants";

/**
 * Check who is winner
 * @param board
 * @returns
 */
const checkWinner = (board: Map<string, Object3D<Object3DEventMap>[]>) => {
  const player1Name = PLAYER_INFO.PLAYER1.NAME;
  const player2Name = PLAYER_INFO.PLAYER2.NAME;

  const topLeftToButtomRightDiagonalPlayers = [];
  const buttomLeftToTopRightDiagonalPlayers = [];
  for (let i = 1; i <= 3; i++) {
    const columnPlayers = [];
    const rowPlayers = [];
    for (let j = 1; j <= 3; j++) {
      // add row gobblers into array to check
      let gobblers = board.get(i + "" + j);
      let playerName =
        gobblers && gobblers.length > 0
          ? gobblers[gobblers.length - 1].userData.player
          : null;
      rowPlayers.push(playerName);

      // add diagonal gobblers into array to check
      if (i === j) {
        topLeftToButtomRightDiagonalPlayers.push(playerName);
      }
      if (4 - i === j) {
        buttomLeftToTopRightDiagonalPlayers.push(playerName);
      }

      // add column gobblers into array to check
      gobblers = board.get(j + "" + i);

      playerName =
        gobblers && gobblers.length > 0
          ? gobblers[gobblers.length - 1].userData.player
          : null;
      columnPlayers.push(playerName);
    }

    if (rowPlayers.every((player) => player === player1Name))
      return player1Name;
    if (rowPlayers.every((player) => player === player2Name))
      return player2Name;
    if (columnPlayers.every((player) => player === player1Name))
      return player1Name;
    if (columnPlayers.every((player) => player === player2Name))
      return player2Name;
  }
  if (
    topLeftToButtomRightDiagonalPlayers.every(
      (player) => player === player1Name
    )
  )
    return player1Name;
  if (
    topLeftToButtomRightDiagonalPlayers.every(
      (player) => player === player2Name
    )
  )
    return player2Name;
  if (
    buttomLeftToTopRightDiagonalPlayers.every(
      (player) => player === player1Name
    )
  )
    return player1Name;
  if (
    buttomLeftToTopRightDiagonalPlayers.every(
      (player) => player === player2Name
    )
  )
    return player2Name;
  return null;
};

export default checkWinner;
