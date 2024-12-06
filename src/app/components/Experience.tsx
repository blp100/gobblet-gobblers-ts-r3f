import { OrbitControls } from "@react-three/drei";
import Box from "./Box";
import {Fireworks} from "./Firework";
import { Perf } from "r3f-perf";
import { Sky } from "@react-three/drei";
import WinnerText from "./WinnerText";

export default function Experience() {
  return (
    <>
      <color args={["#212123"]} attach="background" />

      <Perf position="top-left" />

      <OrbitControls />

      {/* <Sky
        turbidity={10}
        rayleigh={3}
        mieCoefficient={0.005}
        mieDirectionalG={0.95}
        sunPosition={-2.2}
        azimuth={180}
      /> */}

      {/* <Box /> */}

      <Fireworks />

      <WinnerText text="winner!" color={0x5f9df7} />

      <mesh rotation-x={-Math.PI * 0.5} scale={2}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={"darkorange"} />
      </mesh>
    </>
  );
}
