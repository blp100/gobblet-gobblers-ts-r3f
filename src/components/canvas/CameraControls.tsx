import { PLAYER_INFO } from "@/constants";
import useStore from "@/store/store";
import { easings, useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";

type PositionType = [number, number, number];

export default function CameraControls() {
  const { camera } = useThree();
  const winner = useStore((state) => state.winner);
  const activePlayer = useStore((state) => state.activePlayer);

  const positions = [
    [1, 1, 10],
    [-3, 5, 5],
    [3, 5, 5],
    [6, 12, 15],
  ] as Array<PositionType>;

  const lookAtTargets = [
    [0, 3, 0],
    [-1.5, 0, 0],
    [1.5, 0, 0],
    [0, 0, 0],
  ] as Array<PositionType>;

  // Spring animation for the camera
  const { position, lookAtTarget } = useSpring({
    position:
      winner !== null
        ? positions[0] // If there's a winner
        : activePlayer === PLAYER_INFO.PLAYER1
        ? positions[1] // If active player is PLAYER1
        : activePlayer === PLAYER_INFO.PLAYER2
        ? positions[2] // If active player is PLAYER2
        : positions[3], // Default fallback,

    lookAtTarget:
      winner !== null
        ? lookAtTargets[0] // If there's a winner
        : activePlayer === PLAYER_INFO.PLAYER1
        ? lookAtTargets[1] // If active player is PLAYER1
        : activePlayer === PLAYER_INFO.PLAYER2
        ? lookAtTargets[2] // If active player is PLAYER2
        : lookAtTargets[3], // Default fallback,
    config: { easing: easings.easeOutQuint, duration: 2000 },
  });

  // Use `useFrame` to apply animated position values to the camera
  useFrame(() => {
    const [x, y, z] = position.get();
    const [lookAtX, lookAtY, lookAtZ] = lookAtTarget.get();
    camera.position.set(x, y, z);
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return null; // No visual components needed for camera control
}
