import Highlight from "./components/Highlight";
import {Canvas} from "@react-three/fiber";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {EffectComposer, Outline, Selection} from "@react-three/postprocessing";
import Bucket from "./components/Bucket";
import {MapControls} from "@react-three/drei";

function App() {

    const [highlights, setHighlights] = useState([]);
    const [buckets, setBuckets] = useState([]);
    const [controlsEnabled, setControlsEnabled] = useState(true);

    function removeHighlight(key) {
        setHighlights(highlights.filter(highlight => highlight.key !== key))
    }

    function removeBucket(key) {
        setBuckets(buckets.filter(bucket => bucket.key !== key))
    }

    function initBuckets() {
        const localStorageBuckets = localStorage.getItem("buckets");
        let parsedBuckets = [];
        if (localStorageBuckets) {
            console.log("found buckets in localstorage: ", localStorageBuckets);
            localStorageBuckets.split("|").forEach((bucket) => {
                let bucketData = JSON.parse(localStorage.getItem(bucket));
                console.log("found bucket data in localstorage: ", bucketData);
                parsedBuckets.push(<Bucket key={bucket} props={{userData: bucket, x: bucketData.x, y: bucketData.y, setCanvasControlsEnabled: setControlsEnabled }}/>)
            })
            setBuckets(parsedBuckets);
        }
    }

    function initHighlights() {
        const localStorageHighlights = localStorage.getItem("highlights");
        let parsedHighlights = [];
        if (localStorageHighlights) {
            console.log("found highlights in localstorage: ", localStorageHighlights);
            localStorageHighlights.split("|").forEach((highlight) => {
                let highlightData = JSON.parse(localStorage.getItem(highlight));
                console.log("found highlight data in localstorage: ", highlightData);
                parsedHighlights.push(<Highlight key={highlight} props={{userData: highlight,
                    x: highlightData.x, y: highlightData.y, z: highlightData.z,
                    text: highlightData.text, color: highlightData.color, setCanvasControlsEnabled: setControlsEnabled}}/>)
            })
            setHighlights(parsedHighlights);
        }
    }

    useEffect(() => {
        initBuckets();
        initHighlights();
    }, [])

    const generateKey = (pre) => {
        return `${ pre }_${ new Date().getTime() }`;
    }

    function createHighlight(x, y, z) {
        const key = generateKey("highlight");

        let localStorageHighlights = localStorage.getItem("highlights");

        if(localStorageHighlights != null) {
            localStorage.setItem("highlights", localStorageHighlights + "|" + key);
        } else {
            localStorage.setItem("highlights", key);
        }
        localStorage.setItem(key, JSON.stringify({x, y, z}));
        return <Highlight key={key} props={{userData: key, x: x, y: y, z: z, text: "Your text here", setCanvasControlsEnabled: setControlsEnabled}}/>
    }

    function createBucket(x, y) {
        const key = generateKey("bucket");
        let localStorageHighlights = localStorage.getItem("buckets");

        if(localStorageHighlights != null) {
            localStorage.setItem("buckets", localStorageHighlights + "|" + key);
        } else {
            localStorage.setItem("buckets", key);
        }
        localStorage.setItem(key, JSON.stringify({x, y}));
        return <Bucket key={key} props={{userData: key, x: 0, y: 0, setCanvasControlsEnabled: setControlsEnabled}}/>
    }

    return (
        <>
            <Canvas
                orthographic
                camera={{ position: [0, 0, 100], zoom: 1, up: [0, 0, 1], far: 1000 }}
                style={{ width: '100%', height: '98vh', backgroundColor: 'white', zIndex: 0}}
                dpr={[1, 2]}
                frameloop={'demand'}
            >
                <ambientLight intensity={0.5} />
                <Selection>
                    <EffectComposer multisampling={8} autoClear={false}>
                        <Outline blur visibleEdgeColor="black" edgeStrength={2} width={500} />
                    </EffectComposer>
                    {buckets}
                    {highlights}
                </Selection>
                <MapControls enabled={controlsEnabled} enableRotate={false}/>
            </Canvas>
            <button style={{ height: '2vh', zIndex: 0}} onClick={(e) => {
                setHighlights([...highlights, createHighlight(0, 0, 1)])
            }}>Create Highlight</button>
            <button style={{ height: '2vh', zIndex: 0}} onClick={(e) => {
                setBuckets([...buckets, createBucket(0, 0)])
            }}>Create Bucket</button>
        </>

    );
}

export default App;
