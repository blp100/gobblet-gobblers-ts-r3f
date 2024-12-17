import useStore from "@/store/store";
import styles from "./game-ui.module.css";
import { PLAYER_INFO } from "@/constants";

export default function GameUI() {
  const phase = useStore((state) => state.phase);
  const setPlayer = useStore((state) => state.setPlayer);
  const start = useStore((state) => state.start);
  const restart = useStore((state) => state.restart);

  console.log(phase);

  return (
    <>
      <div className={styles.interface}>
        {phase === "ready" && (
          <div className={styles.ready}>
            <h1>CHOOSE PLAYER</h1>
            <button
              onClick={() => {
                setPlayer(PLAYER_INFO.PLAYER1);
                start();
              }}
              className={styles.player1}
            >
              Player 1
            </button>
            <button
              onClick={() => {
                setPlayer(PLAYER_INFO.PLAYER2);
                start();
              }}
              className={styles.player2}
            >
              Player 2
            </button>
          </div>
        )}
        {phase === "ended" && (
          <div className={styles.restart} onClick={() => restart()}>
            RESTART
          </div>
        )}
      </div>
    </>
  );
}
