import { Center, Float, Text3D } from "@react-three/drei";

type WinnerTextProps = {
  color: string | number;
  text: string;
  [x: string]: any;
};

const WinnerText = (props: WinnerTextProps) => {
  const { color, text, ...otherProps } = props;

  return (
    <Center top position={[0, 2.5, 0]} rotation={[0, 0, 0]} {...otherProps}>
      <Text3D font="./fonts/Mansalva_Regular.json">
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </Center>
  );
};

export default WinnerText;
