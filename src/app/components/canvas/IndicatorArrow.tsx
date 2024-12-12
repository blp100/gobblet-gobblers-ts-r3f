import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

type IndicatorArrowProps = {
  color: string | number | [r: number, g: number, b: number];
  positionX: number;
  rotationZ: number;
  [x: string]: any;
};

const IndicatorArrow = ({
  color,
  positionX,
  rotationZ,
  ...otherProps
}: IndicatorArrowProps) => {
  const ref = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 1.6;
    }
  });

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      position={[positionX, 0.25, 2]}
      rotation={[(Math.PI / 2) * 0.9, 0, rotationZ]}
      {...otherProps}
    >
      <coneGeometry args={[0.15, 0.5, 4]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

export default IndicatorArrow;
