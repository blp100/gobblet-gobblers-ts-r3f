import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import useStore from "@/store/store";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { useSpring, animated } from "@react-spring/three";

type GobblerProps = {
  size: number;
  color: string | number | [r: number, g: number, b: number];
  position: [x: number, y: number, z: number];
  [x: string]: any;
};

type GLTFResult = GLTF & {
  nodes: { cylinder: Mesh };
};

type tilePositionType = { tilePosition: [number, number, number] };

const Gobbler = ({ size, color, position, ...otherProps }: GobblerProps) => {
  const [x, y, z] = position;
  const ref = useRef<Mesh>(null);
  const { nodes } = useGLTF("/models/cylinder.gltf") as unknown as GLTFResult;
  const activePlayer = useStore((state) => state.activePlayer);
  const activeGobbler = useStore((state) => state.activeGobbler);
  const setActiveGobbler = useStore((state) => state.setActiveGobbler);
  const activePlane = useStore((state) => state.activePlane);
  const setActivePlane = useStore((state) => state.setActivePlane);
  const phase = useStore((state) => state.phase);
  const nextStep = useStore((state) => state.nextStep);

  const isActive = activeGobbler === ref.current && ref.current !== null;

  const tile = ref.current ? ref.current.userData.plane : null;

  const isActiveTile = activePlane === tile && activePlane !== null;

  const { positionY } = useSpring({ positionY: isActive ? 1 : 0 });
  const { tilePosition } = useSpring<tilePositionType>({
    from: { tilePosition: [x, y, z] },
    to: async (next) => {
      await next({
        tilePosition: [
          tile ? tile.position.x : x,
          isActiveTile ? y : y,
          tile ? tile.position.z : z,
        ],
      });
      await next({
        tilePosition: [
          tile ? tile.position.x : x,
          y,
          tile ? tile.position.z : z,
        ],
      });
    },
    onRest: ({ finished }) => {
      // Animation completed, set active gobbler here
      if (tile && isActive && isActiveTile && finished) {
        nextStep();
      }
      // console.log(tile);
    },
  });

  return (
    <animated.group position-y={positionY}>
      <animated.mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.cylinder.geometry}
        scale={size}
        onClick={(e) => {
          e.stopPropagation();
          if (e.object.userData.player === activePlayer?.NAME && phase === "playing") {
            setActiveGobbler(e.object);
          }
        }}
        position={tilePosition}
        {...otherProps}
      >
        <meshStandardMaterial color={color} />
      </animated.mesh>
    </animated.group>
  );
};

export default Gobbler;

useGLTF.preload("/models/cylinder.gltf");
