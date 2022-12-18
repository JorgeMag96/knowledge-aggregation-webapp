import {extend} from '@react-three/fiber';
import {Mesh, BoxGeometry, MeshStandardMaterial} from 'three';
import React, {useEffect, useRef, useState} from "react";
import {Select} from '@react-three/postprocessing'
import {Text} from "@react-three/drei";
import {randInt} from "three/src/math/MathUtils";

extend({ Mesh, BoxGeometry, MeshStandardMaterial })

const Highlight = ({props}) => {

    const ref = useRef();
    const [hovered, hover] = useState(false);
    const [holding, hold] = useState(false);
    const [position, setPosition] = useState([props.x, props.y, props.z]);
    const [holdingPosition, setHoldingPosition] = useState([0, 0]);
    const [text, setText] = useState(props.text);
    const [textEdit, setTextEdit] = useState(false);
    const colors = ['#96ccf8', '#d7a9f4', '#e38987', '#f4de8d', '#a3f0ae'];
    const [selectedColorIndex, setSelectedColorIndex] = useState( () => {
        if(props.color) {
            return props.color
        }
        const initialColorIndex = randInt(0, colors.length - 1);
        localStorage.setItem(props.userData, JSON.stringify({x: position[0], y: position[1], z: position[2], text: text, color: initialColorIndex}))
        return initialColorIndex
    });

    const changeColor = (e) => {
        let selectedColorIndexTemp = (selectedColorIndex + 1) % colors.length;
        setSelectedColorIndex(selectedColorIndexTemp);
        let localHighlight = JSON.parse(localStorage.getItem(props.userData));
        localHighlight.color = selectedColorIndexTemp;
        localStorage.setItem(props.userData, JSON.stringify(localHighlight));
    }

    useEffect(() => {
        if (hovered) document.body.style.cursor = 'pointer'
        return () => (document.body.style.cursor = 'auto')
    }, [hovered])

    function handleKeyDown(e) {
        if(textEdit) {
            if (e.key === 'Enter') {
                setTextEdit(false)
            }
            else if (e.key === 'Backspace') {
                setText(text.slice(0, -1))
            }
            else {
                console.log("new text: ", text + e.key)
                setText(text + e.key)
            }
        }
    }

    return (
        <>
            <Text
                scale={[80, 80, 1]}
                color="black"
                anchorX="center"
                anchorY="bottom"
                textAlign="justify"
                maxWidth= "1"
                lineHeight="1"
                position={[position[0], position[1] + 15, position[2]]}
                text={text}
            />
            <Select enabled={holding}>
                <mesh
                    {...props}
                    ref={ref}

                    onContextMenu={changeColor}

                    position={position}

                    onClick={(e) => {
                        console.log("clicked: ", props)
                        setText(text + "a")
                    }}

                    onDoubleClick={(e) => {
                        console.log("double clicked: ", props.userData)
                        setTextEdit(true)
                    }}

                    onPointerOver={(e) => {
                        hover(true)
                        console.log("hovered: ", props.userData)
                    }}

                    onPointerOut={(e) => {
                        hover(false)
                        hold(false)
                        console.log("un-hovered: ", props.userData)
                    }}

                    onPointerDown={(e) => {
                        if(hovered) {
                            hold(true)
                            setHoldingPosition([e.point.x - position[0], e.point.y - position[1]])
                            props.setCanvasControlsEnabled(false)
                            console.log(`holding ${props.userData}`)
                        }
                    }}

                    onPointerUp={(e) => {
                        if(holding) {
                            hold(false)
                            props.setCanvasControlsEnabled(true)
                            let localHighlight = JSON.parse(localStorage.getItem(props.userData))
                            localHighlight.x = position[0]
                            localHighlight.y = position[1]
                            localStorage.setItem(props.userData, JSON.stringify(localHighlight))
                            console.log("released: ", props.userData)
                        }
                    }}

                    onPointerMove={(e) => {
                        if(holding) {
                            //console.log(`moving ${props.userData} from mouse position ${holdingPosition}`)
                            setPosition([e.point.x - holdingPosition[0], e.point.y - holdingPosition[1], position[2]])
                        }
                    }}
                >
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color={colors[selectedColorIndex]} />
                </mesh>
            </Select>
        </>
    );
};

export default Highlight;