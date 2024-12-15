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
  const phase = useStore((state) => state.phase);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (activeGobbler && phase === "playing") setActivePlane(e.object);
      }}
      {...otherProps}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};