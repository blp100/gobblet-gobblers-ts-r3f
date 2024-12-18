import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import useStore from "@/store/store";
import { Fireworks } from "./Firework";
import { Perf } from "r3f-perf";
import WinnerText from "./WinnerText";
import IndicatorArrow from "./IndicatorArrow";
import { ToneMappingMode } from "postprocessing";
import Gobblers from "./Gobblers";
import Ground from "./Ground";
import Grid from "./Grid";
import Light from "./Light";
import InteractiveTiles from "./InteractiveTiles";
import { PLAYER_INFO } from "@/constants";
import checkGobbler from "@/lib/check-gobbler";
import checkWinner from "@/lib/check-winner";

export default function Experience() {
  // game object state
  const activePlayer = useStore((state) => state.activePlayer);
  const activeGobbler = useStore((state) => state.activeGobbler);
  const activeTile = useStore((state) => state.activeTile);
  const board = useStore((state) => state.board);
  const setBoard = useStore((state) => state.setBoard);
  const winner = useStore((state) => state.winner);
  const setWinner = useStore((state) => state.setWinner);
  const moveGobbler = useStore((state) => state.moveGobbler);
  const phase = useStore((state) => state.phase);
  const end = useStore((state) => state.end);

  // game rule
  useEffect(() => {
    if (activeGobbler && activeTile) {
      const arr = board.get(activeTile.userData.key) || [];
      const newBoard = new Map(board); // create a new board for React state

      if (checkGobbler(arr, activeGobbler)) {
        // Check if the gobbler is on the board. If the answer is yes, remove it.
        if (activeGobbler.userData.tile) {
          const tileKey = activeGobbler.userData.tile.userData.key;
          const tempArr = [...board.get(tileKey)!];
          const prevIndex = tempArr.indexOf(activeGobbler);
          tempArr.splice(prevIndex, 1);
          newBoard.set(tileKey, tempArr);
        }

        // add gobbler in new position
        activeGobbler.userData.tile = activeTile;
        const newArr = [...arr, activeGobbler];
        newBoard.set(activeTile.userData.key, newArr);

        // update the state
        moveGobbler();
        setBoard(newBoard);
      }
    }
  }, [activeGobbler, activeTile, activePlayer, board]);

  // game rule, check winner
  useEffect(() => {
    if (phase === "playing") {
      const winner = checkWinner(board);
      if (winner) {
        setWinner(
          winner === PLAYER_INFO.PLAYER1.NAME
            ? PLAYER_INFO.PLAYER1
            : PLAYER_INFO.PLAYER2
        );
        end();
      }
    }
  }, [board, phase]);

  return (
    <>
      <color args={["#212123"]} attach="background" />

      <Perf position="top-left" />

      <Light />

      <OrbitControls />

      <EffectComposer>
        <Bloom mipmapBlur intensity={1} luminanceThreshold={1.1} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <Gobblers />
      <InteractiveTiles />

      <Ground color={0xf9d3b7} />
      <Grid color={0x967e76} />
      <IndicatorArrow
        color={[10,0.9, 0.11]}
        positionX={-1}
        rotationZ={Math.PI / 2}
        visible={activePlayer === PLAYER_INFO.PLAYER1}
      />
      <IndicatorArrow
        color={[0.37, 0.9, 10]}
        positionX={1}
        rotationZ={-Math.PI / 2}
        visible={activePlayer === PLAYER_INFO.PLAYER2}
      />

      <WinnerText
        key={PLAYER_INFO.PLAYER1.WINNER_NAME}
        name={PLAYER_INFO.PLAYER1.WINNER_NAME}
        color={PLAYER_INFO.PLAYER1.COLOR}
        text={"winner!"}
        visible={winner === PLAYER_INFO.PLAYER1}
      />
      <WinnerText
        key={PLAYER_INFO.PLAYER2.WINNER_NAME}
        name={PLAYER_INFO.PLAYER2.WINNER_NAME}
        color={PLAYER_INFO.PLAYER2.COLOR}
        text={"winner!"}
        visible={winner === PLAYER_INFO.PLAYER2}
      />

      <Fireworks visible={!!winner} />
    </>
  );
}
