import { Center, Float, Text3D } from "@react-three/drei";

type WinnerTextProps = {
  color: string | number;
  text: string;
  [x: string]: any;
};

export default function WinnerText({
  color,
  text,
  ...otherProps
}: WinnerTextProps) {
  return (
    <Float speed={3}>
      <Center top position={[0, 2.5, 0]} rotation={[0, 0, 0]} {...otherProps}>
        <Text3D font="./fonts/Mansalva_Regular.json">
          {text}
          <meshStandardMaterial color={color} />
        </Text3D>
      </Center>
    </Float>
  );
}
