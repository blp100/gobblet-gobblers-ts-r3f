type GroundProps = {
  color: string | number | [r: number, g: number, b: number];
};

const Grid = ({ color }: GroundProps) => {
  return (
    <group>
      <mesh castShadow receiveShadow position={[-0.5, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.05, 0.5]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.05, -0.5]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export default Grid;
