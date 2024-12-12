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
import Gobbler from "./Gobbler";
import { PLAYER_INFO, SIZES } from "@/constants";
import Ground from "./Ground";
import Grid from "./Grid";
import Light from "./Light";
import { useEffect, useMemo } from "react";
import InterActiveTile from "./InteractiveTile";
import useStore from "@/store/store";
import checkGobbler from "@/lib/check-gobbler";
import checkWinner from "@/lib/check-winner";

export default function Experience() {
  // game object state
  const activePlayer = useStore((state) => state.activePlayer);
  const setPlayer = useStore((state) => state.setPlayer);
  const activeGobbler = useStore((state) => state.activeGobbler);
  const activePlane = useStore((state) => state.activePlane);
  const setActiveGobbler = useStore((state) => state.setActiveGobbler);
  const setActivePlane = useStore((state) => state.setActivePlane);
  const board = useStore((state) => state.board);
  const setBoard = useStore((state) => state.setBoard);
  const winner = useStore((state) => state.winner);
  const setWinner = useStore((state) => state.setWinner);

  // game rule
  useEffect(() => {
    if (activeGobbler && activePlane) {
      const arr = board.get(activePlane.userData.key);
      const newBoard = new Map(board); // create a new board for React state
      let tempWinner = null;
      if (arr && checkGobbler(arr, activeGobbler)) {
        if (activeGobbler.userData.plane) {
          const planeKey = activeGobbler.userData.plane.userData.key;
          const tempArr = [...board.get(planeKey)];
          const prevIndex = tempArr.indexOf(activeGobbler);
          tempArr.splice(prevIndex, 1);
          newBoard.set(planeKey, tempArr); // remove previous gobbler

          if (!tempWinner) {
            tempWinner = checkWinner(newBoard);
          }
        }

        activeGobbler.userData.plane = activePlane;
        const newArr = [...arr, activeGobbler];
        newBoard.set(activePlane.userData.key, newArr); // add gobbler in new position
        if (!tempWinner) {
          tempWinner = checkWinner(newBoard);
        }
        if (tempWinner) {
          setWinner(
            tempWinner === PLAYER_INFO.PLAYER1.NAME
              ? PLAYER_INFO.PLAYER1
              : PLAYER_INFO.PLAYER2
          );
        }

        setActiveGobbler(null);
        setActivePlane(null);
        setPlayer(
          activePlayer === PLAYER_INFO.PLAYER1
            ? PLAYER_INFO.PLAYER2
            : PLAYER_INFO.PLAYER1
        );
        if (tempWinner) {
          setPlayer(null);
        }
        setBoard(newBoard);
      }
    }
  }, [activeGobbler, activePlane, activePlayer, board]);

  // Build gobblers
  const gobblers = useMemo(() => {
    const g = [];
    const sizeKeys = Object.keys(SIZES);
    for (let player = 0; player < 2; player++) {
      for (let size = 0; size < 3; size++) {
        const color =
          player === 0 ? PLAYER_INFO.PLAYER1.COLOR : PLAYER_INFO.PLAYER2.COLOR;
        const playerName =
          player === 0 ? PLAYER_INFO.PLAYER1.NAME : PLAYER_INFO.PLAYER2.NAME;
        const pos = player === 0 ? -3 : 3;
        const gobblerSize = SIZES[sizeKeys[size]].VALUE;
        const z = (size - 1) * 1.2;
        const y = gobblerSize / 2;
        const leftName = "player" + player + "size" + size + "left";
        const rightName = "player" + player + "size" + size + "right";
        g.push(
          <Gobbler
            key={leftName}
            name={leftName}
            position={[pos - gobblerSize / 2 - 0.1, y, z]}
            size={gobblerSize}
            color={color}
            userData={{
              size: SIZES[sizeKeys[size]],
              player: playerName,
            }}
          />
        );
        g.push(
          <Gobbler
            key={rightName}
            name={rightName}
            position={[pos + gobblerSize / 2 + 0.1, y, z]}
            size={gobblerSize}
            color={color}
            userData={{
              size: SIZES[sizeKeys[size]],
              player: playerName,
            }}
          />
        );
      }
    }
    return g;
  }, []);

  // Build Plane
  const tiles = useMemo(() => {
    const p = [];
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        const pos = [(j - 2) * 10, 0.1, (i - 2) * 10];
        p.push(
          <InterActiveTile
            key={"plane" + i + "" + j}
            color={0xf9d3b7}
            position={pos}
            name={"plane" + i + "" + j}
            userData={{ key: i + "" + j }}
            visible={false}
          />
        );
      }
    }
    return p;
  }, []);

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

      {gobblers}
      {tiles}

      <Ground color={0xf9d3b7} />
      <Grid color={0x967e76} />
      <IndicatorArrow
        color={[0.37, 4, 10]}
        positionX={-1}
        rotationZ={Math.PI / 2}
      />

      {/* <Fireworks /> */}

      <WinnerText text="winner!" color={0x5f9df7} />

      {/* <mesh
        receiveShadow
        rotation-x={-Math.PI * 0.5}
        scale={2}
        position-y={0.1}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={"darkorange"} />
      </mesh> */}
    </>
  );
}
