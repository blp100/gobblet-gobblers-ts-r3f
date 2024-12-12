import { OrbitControls } from "@react-three/drei";
import Box from "./Box";
import { Fireworks } from "./Firework";
import { Perf } from "r3f-perf";
import { Sky } from "@react-three/drei";
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
import { useMemo } from "react";

export default function Experience() {
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

      {/* <Sky
        turbidity={10}
        rayleigh={3}
        mieCoefficient={0.005}
        mieDirectionalG={0.95}
        sunPosition={-2.2}
        azimuth={180}
      /> */}

      {gobblers}
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
