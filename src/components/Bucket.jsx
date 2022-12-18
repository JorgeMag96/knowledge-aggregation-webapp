import {extend} from "@react-three/fiber";
import React, {useRef, useState} from "react";
import {Mesh, PlaneGeometry, MeshStandardMaterial} from 'three';
import {Select} from '@react-three/postprocessing'
import {Text} from "@react-three/drei";

extend({ Mesh, PlaneGeometry, MeshStandardMaterial })

const Bucket = ({props}) => {

    const ref = useRef();
    const [position, setPosition] = useState([props.x, props.y, 1]);
    const [hovered, hover] = useState(false);
    const [holding, hold] = useState(false);
    const [holdingPosition, setHoldingPosition] = useState([0, 0]);

    return (
        <>
            <Text
                scale={[100, 100, 1]}
                color="black"
                anchorX="center"
                anchorY="bottom"
                position={[position[0], position[1] + 225, position[2]]}
            >
                Your Text Here
            </Text>
            <Select enabled={holding}>
                <mesh
                    {...props}
                    ref={ref}
                    position={position}

                    onPointerOver={(e) => {
                        hover(true)
                        console.log(`hovered: ${props.userData}`)
                    }}

                    onPointerOut={(e) => {
                        hover(false)
                        hold(false)
                        console.log(`un-hovered: ${props.userData}`)
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
                            localStorage.setItem(props.userData, JSON.stringify({x: position[0], y: position[1]}))
                            console.log(`released: ${props.userData}`)
                        }
                    }}

                    onPointerMove={(e) => {
                        if(holding) {
                            //console.log(`moving ${props.userData} from mouse position ${holdingPosition}`)
                            setPosition([e.point.x - holdingPosition[0], e.point.y - holdingPosition[1], position[2]])
                        }
                    }}
                >
                    <planeGeometry args={[400, 500]} />
                    <meshStandardMaterial color='grey' transparent='true' opacity='0.3'/>
                </mesh>
            </Select>
        </>

    );
};

export default Bucket;