// import { useHelper } from "@react-three/drei";
// import { useRef } from "react";
// import {
//   DirectionalLight,
//   DirectionalLightHelper,
//   SpotLight,
//   SpotLightHelper,
//   OrthographicCamera,
//   PerspectiveCamera,
//   CameraHelper,
// } from "three";

export default function Light() {
  /**
   * Light Helper
   */
  // const dirLight = useRef<DirectionalLight>(null);
  // const dirLightShadowHelper = useRef<OrthographicCamera>(null);
  // const spotLight1 = useRef<SpotLight>(null);
  // const spotLightShadowHelper1 = useRef<PerspectiveCamera>(null);
  // const spotLight2 = useRef<SpotLight>(null);
  // const spotLightShadowHelper2 = useRef<PerspectiveCamera>(null);
  // useHelper(dirLight, DirectionalLightHelper, 1, "red");
  // useHelper(dirLightShadowHelper, CameraHelper);
  // useHelper(spotLight1, SpotLightHelper, 1);
  // useHelper(spotLightShadowHelper1, CameraHelper);
  // useHelper(spotLight2, SpotLightHelper, 1);
  // useHelper(spotLightShadowHelper2, CameraHelper);

  return (
    <>
      <ambientLight intensity={1.8} />
      <spotLight
        // ref={spotLight1}
        castShadow
        position={[6, 15, 12]}
        angle={0.3}
        penumbra={0.5}
        intensity={2.1}
        decay={0.2}
      >
        <perspectiveCamera
          // ref={spotLightShadowHelper1}
          attach="shadow-camera"
          far={22}
          near={14}
        />
      </spotLight>
      <spotLight
        // ref={spotLight2}
        castShadow
        position={[-6, 12, 12]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.9}
        decay={0.2}
      >
        <perspectiveCamera
          // ref={spotLightShadowHelper2}
          attach="shadow-camera"
          far={20}
          near={12}
        />
      </spotLight>
      <pointLight position={[-5, -5, -5]} />
      <directionalLight
        // ref={dirLight}
        castShadow
        position={[-4.6, 9, 9]}
        intensity={0.9}
        color={0xffffff}
        shadow-mapSize={[1024, 1024]}
        shadow-normalBias={0.05}
      >
        <orthographicCamera
          // ref={dirLightShadowHelper}
          attach="shadow-camera"
          args={[-10, 10, 10, -10, 10, 20]}
        />
      </directionalLight>
    </>
  );
}
