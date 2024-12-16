import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import useStore from "@/store/store";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_INFO, SIZES } from "@/constants";

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

function Gobbler({ size, color, position, ...otherProps }: GobblerProps) {
  const [x, y, z] = position;
  const ref = useRef<Mesh>(null);
  const { nodes } = useGLTF("/models/gobbler.glb") as unknown as GLTFResult;
  const activePlayer = useStore((state) => state.activePlayer);
  const activeGobbler = useStore((state) => state.activeGobbler);
  const setActiveGobbler = useStore((state) => state.setActiveGobbler);
  const activeTile = useStore((state) => state.activeTile);
  const phase = useStore((state) => state.phase);
  const nextStep = useStore((state) => state.nextStep);

  const isActive = activeGobbler === ref.current && ref.current !== null;

  const tile = ref.current ? ref.current.userData.tile : null;

  const isActiveTile = activeTile === tile && activeTile !== null;

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
      if (isActive && isActiveTile && finished) {
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
          if (
            e.object.userData.player === activePlayer?.NAME &&
            phase === "playing"
          ) {
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
}

export default function Gobblers() {
  const gobblers = useMemo(() => {
    const gobblers = [];
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
        const leftName = `player${player}size${size}left`;
        const rightName = `player${player}size${size}right`;

        gobblers.push({
          name: leftName,
          position: [pos - gobblerSize / 2 - 0.1, y, z] as [
            number,
            number,
            number
          ],
          size: gobblerSize,
          color: color,
          userData: {
            size: SIZES[sizeKeys[size]],
            player: playerName,
          },
        });
        gobblers.push({
          name: rightName,
          position: [pos + gobblerSize / 2 + 0.1, y, z] as [
            number,
            number,
            number
          ],
          size: gobblerSize,
          color: color,
          userData: {
            size: SIZES[sizeKeys[size]],
            player: playerName,
          },
        });
      }
    }
    return gobblers;
  }, []);
  return (
    <>
      {gobblers.map((props) => (
        <Gobbler key={props.name} {...props} />
      ))}
    </>
  );
}

useGLTF.preload("/models/gobbler.glb");
