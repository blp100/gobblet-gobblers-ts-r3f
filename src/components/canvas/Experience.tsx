import { OrbitControls } from "@react-three/drei";
import { Fireworks } from "./Firework";
import { Perf } from "r3f-perf";
import WinnerText from "./WinnerText";
import IndicatorArrow from "./IndicatorArrow";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import Gobblers from "./Gobblers";
import { PLAYER_INFO, SIZES } from "@/constants";
import Ground from "./Ground";
import Grid from "./Grid";
import Light from "./Light";
import { useEffect } from "react";
import useStore from "@/store/store";
import checkGobbler from "@/lib/check-gobbler";
import checkWinner from "@/lib/check-winner";
import InteractiveTiles from "./InteractiveTiles";

export default function Experience() {
  // game object state
  const activePlayer = useStore((state) => state.activePlayer);
  const setPlayer = useStore((state) => state.setPlayer);
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
    if (activeGobbler && activeTile && phase === "playing") {
      const arr = board.get(activeTile.userData.key) || [];
      const newBoard = new Map(board); // create a new board for React state
      let tempWinner = null;
      if (checkGobbler(arr, activeGobbler)) {
        if (activeGobbler.userData.tile) {
          const TileKey = activeGobbler.userData.tile.userData.key;
          const tempArr = [...board.get(TileKey)!];
          const prevIndex = tempArr.indexOf(activeGobbler);
          tempArr.splice(prevIndex, 1);
          newBoard.set(TileKey, tempArr); // remove previous gobbler

          if (!tempWinner) {
            tempWinner = checkWinner(newBoard);
          }
        }

        activeGobbler.userData.tile = activeTile;
        const newArr = [...arr, activeGobbler];
        newBoard.set(activeTile.userData.key, newArr); // add gobbler in new position
        if (!tempWinner) {
          tempWinner = checkWinner(newBoard);
        }
        moveGobbler();
        if (tempWinner) {
          setWinner(
            tempWinner === PLAYER_INFO.PLAYER1.NAME
              ? PLAYER_INFO.PLAYER1
              : PLAYER_INFO.PLAYER2
          );
          end();
          setPlayer(null);
        }
        setBoard(newBoard);
      }
    }
  }, [activeGobbler, activeTile, activePlayer, board]);

  return (
    <>
      <color args={["#212123"]} attach="background" />

      <Perf position="top-left" />

      <Light />

      <OrbitControls />

      <EffectComposer>
        {/* <Bloom mipmapBlur intensity={1} luminanceThreshold={1.1} /> */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <Gobblers />
      <InteractiveTiles />

      <Ground color={0xf9d3b7} />
      <Grid color={0x967e76} />
      <IndicatorArrow
        color={[0.37, 4, 10]}
        positionX={-1}
        rotationZ={Math.PI / 2}
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
