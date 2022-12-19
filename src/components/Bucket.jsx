import { extend } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Mesh, PlaneGeometry, MeshStandardMaterial } from "three";
import { Select } from "@react-three/postprocessing";
import { Text } from "@react-three/drei";

extend({ Mesh, PlaneGeometry, MeshStandardMaterial });

const Bucket = ({ props }) => {
  const ref = useRef();
  const [position, setPosition] = useState([props.x, props.y, 1]);
  const [hovered, hover] = useState(false);
  const [holding, hold] = useState(false);
  const [text, setText] = useState(props.text);
  const [hoveredText, hoverText] = useState(false);
  const [textEdit, setTextEdit] = useState(false);
  const [holdingPosition, setHoldingPosition] = useState([0, 0]);
  const [deleted, setDeleted] = useState(false);

  const keyDownHandler = (e) => {
    if (textEdit) {
      if (e.key === "Enter") {
        setTextEdit(false);
      } else if (e.key === "Backspace") {
        setText(text.substring(0, text.length - 1));
      } else if (/[a-zA-Z0-9-_ ]/.test(String.fromCharCode(e.keyCode))) {
        setText(text + e.key);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [text]);

  useEffect(() => {
    if (hoveredText) {
        document.body.style.cursor = "text";
    } else {
      document.body.style.cursor = hovered ? "move" : "auto";
    }
  }, [hovered]);

  useEffect(() => {
    document.body.style.cursor = hoveredText ? "text" : "auto";
  }, [hoveredText]);

  useEffect(() => {
    document.body.style.cursor = "auto"
  }, [deleted]);

  return (
    <>
      <Text
        scale={[100, 100, 1]}
        color="black"
        anchorX="center"
        anchorY="bottom"
        position={[position[0], position[1] + 225, position[2] + 5]}
        text={text}
        onPointerUp={(e) => {
          setTextEdit(true);
        }}
        onPointerOver={(e) => {
          hoverText(true);
        }}

        onPointerOut={(e) => {
          hoverText(false);
        }}
      />
      <Select enabled={holding}>
        <mesh
          {...props}
          ref={ref}
          position={position}
          visible={!deleted}
          onKeyDown={(e) => {
          }}
          onDoubleClick={(e) => {
            setDeleted(true);
            props.removeBucketFunc();
          }}
          onPointerOver={(e) => {
            hover(true);
          }}
          onPointerOut={(e) => {
            hover(false);
            hold(false);
          }}
          onPointerDown={(e) => {
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
            if (holding) {
              hold(false);
              props.setCanvasControlsEnabled(true);
              localStorage.setItem(
                props.bucketKey,
                JSON.stringify({ x: position[0], y: position[1], text: text })
              );
              localStorage.setItem(
                "cameraPosition",
                JSON.stringify({ x: position[0], y: position[1] })
              );
            }
          }}
          onPointerMove={(e) => {
            if (holding) {
              setPosition([
                e.point.x - holdingPosition[0],
                e.point.y - holdingPosition[1],
                position[2],
              ]);
            }
          }}
        >
          <planeBufferGeometry attach="geometry" args={[400, 500]} />
          <meshStandardMaterial color="grey" transparent="true" opacity="0.3" />
        </mesh>
      </Select>
    </>
  );
};

export default Bucket;
