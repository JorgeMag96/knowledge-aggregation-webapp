import { extend } from "@react-three/fiber";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";
import React, { useEffect, useRef, useState } from "react";
import { Select } from "@react-three/postprocessing";
import { Text } from "@react-three/drei";
import { randInt } from "three/src/math/MathUtils";

extend({ Mesh, BoxGeometry, MeshStandardMaterial });

const Highlight = ({ props }) => {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [holding, hold] = useState(false);
  const [position, setPosition] = useState([props.x, props.y, props.z]);
  const [holdingPosition, setHoldingPosition] = useState([0, 0]);
  const [text, setText] = useState(props.text);
  const [textEdit, setTextEdit] = useState(false);
  const colors = ["#96ccf8", "#d7a9f4", "#e38987", "#f4de8d", "#a3f0ae"];
  const [selectedColorIndex, setSelectedColorIndex] = useState(() => {
    if (props.color != null) {
      return props.color;
    }
    const initialColorIndex = randInt(0, colors.length - 1);
    localStorage.setItem(
      props.highlightKey,
      JSON.stringify({
        x: position[0],
        y: position[1],
        z: position[2],
        text: text,
        color: initialColorIndex,
      })
    );
    return initialColorIndex;
  });
  const [deleted, setDeleted] = useState(false);

  const changeColor = (e) => {
    let selectedColorIndexTemp = (selectedColorIndex + 1) % colors.length;
    setSelectedColorIndex(selectedColorIndexTemp);
    let localHighlight = JSON.parse(localStorage.getItem(props.highlightKey));
    localHighlight.color = selectedColorIndexTemp;
    localStorage.setItem(props.highlightKey, JSON.stringify(localHighlight));
  };

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "move";
    } else {
      document.body.style.cursor = "auto"
    }
  }, [hovered]);

  useEffect(() => {
    if (!deleted) {
      document.body.style.cursor = "move";
    } else {
      document.body.style.cursor = "auto"
    }
  }, [deleted]);

  return (
    <>
      <Text
        scale={[100, 100, 1]}
        color="black"
        anchorX="center"
        anchorY="bottom"
        textAlign="justify"
        maxWidth="80"
        lineHeight="1"
        visible={!deleted}
        position={[position[0], position[1] + 15, position[2] + 5]}
        text={text}
      />
      <Select enabled={holding}>
        <mesh
          {...props}
          ref={ref}
          visible={!deleted}
          onContextMenu={(e) => {
            if (deleted) return;
            changeColor();
          }}
          position={position}
          onClick={(e) => {
            if (deleted) return;
          }}
          onDoubleClick={(e) => {
            if (deleted) return;
            setDeleted(true);
            props.removeHighlightFunc();
          }}
          onPointerOver={(e) => {
            if (deleted) return;
            hover(true);
          }}
          onPointerOut={(e) => {
            if (deleted) return;
            hover(false);
            hold(false);
          }}
          onPointerDown={(e) => {
            if (deleted) return;
            if (hovered) {
              hold(true);
              setHoldingPosition([
                e.point.x - position[0],
                e.point.y - position[1],
              ]);
              props.setCanvasControlsEnabled(false);
            }
          }}
          onPointerUp={(e) => {
            if (deleted) return;
            if (holding) {
              hold(false);
              props.setCanvasControlsEnabled(true);
              let localHighlight = JSON.parse(
                localStorage.getItem(props.highlightKey)
              );
              localHighlight.x = position[0];
              localHighlight.y = position[1];
              localStorage.setItem(
                props.highlightKey,
                JSON.stringify(localHighlight)
              );
              localStorage.setItem(
                "cameraPosition",
                JSON.stringify({ x: localHighlight.x, y: localHighlight.y })
              );
            }
          }}
          onPointerMove={(e) => {
            if (deleted) return;
            if (holding) {
              setPosition([
                e.point.x - holdingPosition[0],
                e.point.y - holdingPosition[1],
                position[2],
              ]);
            }
          }}
        >
          <planeBufferGeometry attach="geometry" args={[100, 100]} />
          <meshStandardMaterial color={colors[selectedColorIndex]} />
        </mesh>
      </Select>
    </>
  );
};

export default Highlight;
