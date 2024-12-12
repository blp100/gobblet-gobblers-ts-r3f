import useStore from "@/store/store";

type InterActiveTileProps = {
  color: string | number | [r: number, g: number, b: number];
  [x: string]: any;
};

export default function InterActiveTile ({
  color,
  ...otherProps
}: InterActiveTileProps) {
  const setActivePlane = useStore((state) => state.setActivePlane);
  const activeGobbler = useStore((state) => state.activeGobbler);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (activeGobbler) setActivePlane(e.object);
      }}
      {...otherProps}
    >
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};