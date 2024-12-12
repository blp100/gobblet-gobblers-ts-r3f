import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import useStore from "../../store/store";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

type GobblerProps = {
  size: number;
  color: string | number | [r: number, g: number, b: number];
  position: [x: number, y: number, z: number];
  [x: string]: any;
};

type GLTFResult = GLTF & {
  nodes: { cylinder: Mesh };
};

const Gobbler = ({ size, color, position, ...otherProps }: GobblerProps) => {
  const [x, y, z] = position;
  const ref = useRef<Mesh>(null);
  const { nodes } = useGLTF("/models/cylinder.gltf") as unknown as GLTFResult;
  const activePlayer = useStore((state) => state.activePlayer);
  const activeGobbler = useStore((state) => state.activeGobbler);
  const setActiveGobbler = useStore((state) => state.setActiveGobbler);
  const isActive = activeGobbler === ref.current;

  const plane = ref.current ? ref.current.userData.plane : null;

  // console.log(activePlayer.NAME, ref.current?.userData?.player);

  return (
    <group>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.cylinder.geometry}
        scale={size}
        onClick={(e) => {
          e.stopPropagation();
          if (e.object.userData.player === activePlayer?.NAME) {
            setActiveGobbler(e.object);
          }
        }}
        position={position}
        {...otherProps}
      >
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export default Gobbler;

useGLTF.preload("/models/cylinder.gltf");
