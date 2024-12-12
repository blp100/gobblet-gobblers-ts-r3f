type GroundProps = {
  color: string | number | [r: number, g: number, b: number];
  [x: string]: any;
};

const Ground = ({ color, ...otherProps }: GroundProps) => {
  return (
    <mesh
      receiveShadow
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      {...otherProps}
    >
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Ground;
