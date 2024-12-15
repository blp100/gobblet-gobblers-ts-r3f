import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aTimeMultiplier;

  uniform float uSize;
  uniform float uProgress;

  float remap(
    float value,
    float originMin,
    float originMax,
    float destinationMin,
    float destinationMax
  ) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
  }

  void main() {
    float progress = uProgress * aTimeMultiplier;
    vec3 newPosition = position;

    // Exploding
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    // Falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    // Sacling
    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    sizeProgress = clamp(sizeProgress, 0.0, 1.0);

    // Twinkling
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;

    // Final Position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final Position
    gl_PointSize = uSize * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / -viewPosition.z;

    if(gl_PointSize < 1.0) {
    // Fix windows issue on Points limitation,
    // which it can't smaller than 1.0 size of the point.
    gl_Position = vec4(9999.0);
  }
  }
`;
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uColor;

  void main() {
    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    // Final color
    gl_FragColor = vec4(uColor, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type FireworkProps = {
  texture: THREE.Texture;
  position?: number[];
  count?: number;
  size?: number;
  delay?: number;
};

export function Firework({
  texture,
  position = [0, 0, 0],
  count = 500,
  size = 800,
  delay = 3000,
}: FireworkProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const fireworkMaterial = useRef<THREE.ShaderMaterial>(null);
  const duration = 3; // 3 seconds
  const progress = useRef(0); // 3 seconds
  texture.flipY = false;
  const newPosition = new THREE.Vector3(
    position[0] + (Math.random() - 0.5) * 4.5,
    position[1] + Math.random() * 2,
    position[2] + (Math.random() - 0.5) * 4.5
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const uniforms = useMemo(() => {
    const uniforms = {
      uSize: new THREE.Uniform(size),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(
        new THREE.Color().setHSL(Math.random(), 1, 0.7)
      ),
      uProgress: new THREE.Uniform(0),
    };
    return uniforms;
  }, []);

  const { positionsArray, sizesArray, timeMultipliersArray } = useMemo(() => {
    const radius = 0.5 + Math.random();
    const positionsArray = new Float32Array(count * 3);
    const sizesArray = new Float32Array(count);
    const timeMultipliersArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spherical Position
      const spherical = new THREE.Spherical(
        radius * (0.75 + Math.random() * 0.25),
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );

      const position = new THREE.Vector3();
      position.setFromSpherical(spherical);

      positionsArray[i3] = position.x;
      positionsArray[i3 + 1] = position.y;
      positionsArray[i3 + 2] = position.z;

      sizesArray[i] = Math.random();
      timeMultipliersArray[i] = 1 + Math.random();
    }

    return { positionsArray, sizesArray, timeMultipliersArray };
  }, []);

  useFrame((state, delta) => {
    // After Delay, then release firework
    if (isActive) {
      // animation value: 1, duration: 3 seconds.
      progress.current += Math.min(duration, delta);
      if (fireworkMaterial.current) {
        if (progress.current <= duration) {
          fireworkMaterial.current.uniforms.uProgress.value += Math.min(
            1,
            delta / duration
          );
        } 
      }
    }
  });

  return (
    <points position={newPosition}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positionsArray}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizesArray}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTimeMultiplier"
          array={timeMultipliersArray}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={fireworkMaterial}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

type FireworksProps = {
  visible? : boolean;
  count?: number;
};

export function Fireworks({ visible = false, count = 2 }: FireworksProps) {
  const textures = useTexture([
    "./particles/1.png",
    "./particles/2.png",
    "./particles/3.png",
    "./particles/4.png",
    "./particles/5.png",
    "./particles/6.png",
    "./particles/7.png",
    "./particles/8.png",
  ]);

  return (
    <>
      {visible && [...Array(100)].map((value, index) => (
        <Firework
          texture={textures[Math.floor(Math.random() * 8)]}
          position={[0, 4, 0]}
          key={index}
          delay={Math.random() * 5000}
        />
      ))}
    </>
  );
}
