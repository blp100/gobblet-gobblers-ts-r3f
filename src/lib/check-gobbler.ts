import { Mesh, Object3D } from "three";

/**
 * Check gobblers can move into the destination tile,
 * if destionation tile has gobblers, check the size first.
 * @param dstGobblers 
 * @param gobbler 
 * @returns 
 */
const checkGobbler = (dstGobblers: Object3D[], gobbler: Object3D) => {
  if (dstGobblers.length > 0) {
    const dstSize = dstGobblers[dstGobblers.length - 1].userData.size.VALUE;
    const gobblerSize = gobbler.userData.size.VALUE;
    return gobblerSize > dstSize;
  } else {
    return true;
  }
};

export default checkGobbler;
