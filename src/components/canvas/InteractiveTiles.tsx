import useStore from "@/store/store";
import { useMemo } from "react";

type InterActiveTileProps = {
  color: string | number | [r: number, g: number, b: number];
  [x: string]: any;
};

function InterActiveTile({ color, ...otherProps }: InterActiveTileProps) {
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
}

export default function InteractiveTiles() {
  // Build Plane
  const tiles = useMemo(() => {
    const tiles = [];
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        const pos = [j - 2, 0.1, i - 2];
        tiles.push({
          color: 0xf9d3b7,
          position: pos,
          name: `plane${i}${j}`,
          userData: { key: `plane${i}${j}` },
          visible: false,
        });
      }
    }
    return tiles;
  }, []);
  return (
    <>
      {tiles.map((props) => (
        <InterActiveTile key={props.name} {...props} />
      ))}
    </>
  );
}
