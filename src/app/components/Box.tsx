import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

export default function Box() {
  const box = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (box.current) {
      box.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={box} position-y={0.5}>
      <boxGeometry />
      <meshBasicMaterial color={"mediumpurple"} />
    </mesh>
  );
}
