import { Mesh, Object3D } from "three";

const checkGobbler = (dstGobblers:Mesh[], gobbler:Object3D) => {
  if (dstGobblers.length > 0) {
    const dstSize = dstGobblers[dstGobblers.length - 1].userData.size.VALUE;
    const gobblerSize = gobbler.userData.size.VALUE;
    return gobblerSize > dstSize;
  } else {
    return true;
  }
};

export default checkGobbler;
