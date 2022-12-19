import Highlight from "./components/Highlight";
import Bucket from "./components/Bucket";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { MapControls } from "@react-three/drei";

function App() {
  const [highlights, setHighlights] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [activeElementForText, setActiveElementForText] = useState("");
  const cameraPosition = JSON.parse(localStorage.getItem("cameraPosition")) || {
    x: 0,
    y: 0,
  };

  function removeHighlight(key) {
    localStorage.removeItem(key);
    let localStorageHighlight = localStorage
      .getItem("highlights")
      .split("|")
      .filter((highlight) => highlight !== key);
    localStorage.setItem("highlights", localStorageHighlight.join("|"));
  }

  function removeBucket(key) {
    localStorage.removeItem(key);
    let localStorageBuckets = localStorage
      .getItem("buckets")
      .split("|")
      .filter((bucket) => bucket !== key);
    localStorage.setItem("buckets", localStorageBuckets.join("|"));
    setBuckets(buckets.filter((bucket) => bucket.key !== key));
  }

  function setTextEditActive(key) {
    setActiveElementForText(key);
  }

  function getActiveElementForText() {
      return activeElementForText;
  }

  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  function createHighlight(x, y, z) {
    const key = generateKey("highlight");

    let localStorageHighlights = localStorage.getItem("highlights");

    if (localStorageHighlights != null && localStorageHighlights !== "") {
      localStorage.setItem("highlights", localStorageHighlights + "|" + key);
    } else {
      localStorage.setItem("highlights", key);
    }

    let text = "Your text here";
    localStorage.setItem(key, JSON.stringify({ x, y, z, text }));
    return (
      <Highlight
        key={key}
        props={{
          highlightKey: key,
          x: x,
          y: y,
          z: z,
          text: text,
          setCanvasControlsEnabled: setControlsEnabled,
          removeHighlightFunc: () => removeHighlight(key),
          activeElementForTextEdit: getActiveElementForText,
          setThisTextEditActive: () => setTextEditActive(key)
        }}
      />
    );
  }

  function createBucket(x, y) {
    const key = generateKey("bucket");
    let localStorageBuckets = localStorage.getItem("buckets");

    if (localStorageBuckets != null && localStorageBuckets !== "") {
      localStorage.setItem("buckets", localStorageBuckets + "|" + key);
    } else {
      localStorage.setItem("buckets", key);
    }

    let text = "Your text here";
    localStorage.setItem(key, JSON.stringify({ x, y, text }));
    return (
      <Bucket
        key={key}
        props={{
            bucketKey: key,
            x: 0,
            y: 0,
            text: text,
            setCanvasControlsEnabled: setControlsEnabled,
            removeBucketFunc: () => removeBucket(key),
            activeElementForTextEdit: getActiveElementForText,
            setThisTextEditActive: () => setTextEditActive(key)
        }}
      />
    );
  }

  function initBuckets() {
    let localStorageBuckets = localStorage.getItem("buckets");
    let parsedBuckets = [];
    if (localStorageBuckets) {
      localStorageBuckets.split("|").forEach((bucket) => {
        let bucketData = JSON.parse(localStorage.getItem(bucket));
        parsedBuckets.push(
          <Bucket
            key={bucket}
            props={{
                bucketKey: bucket,
                x: bucketData.x,
                y: bucketData.y,
                text: bucketData.text,
                setCanvasControlsEnabled: setControlsEnabled,
                removeBucketFunc: () => removeBucket(bucket),
                activeElementForTextEdit: getActiveElementForText,
                setThisTextEditActive: () => setTextEditActive(bucket)
            }}
          />
        );
      });
      setBuckets(parsedBuckets);
    } else {
      setBuckets([createBucket(-300, 150)]);
    }
  }

  function initHighlights() {
    const localStorageHighlights = localStorage.getItem("highlights");
    let parsedHighlights = [];
    if (localStorageHighlights) {
      localStorageHighlights.split("|").forEach((highlight) => {
        let highlightData = JSON.parse(localStorage.getItem(highlight));
        parsedHighlights.push(
          <Highlight
            key={highlight}
            props={{
              highlightKey: highlight,
              x: highlightData.x,
              y: highlightData.y,
              z: highlightData.z,
              text: highlightData.text,
              color: highlightData.color,
              setCanvasControlsEnabled: setControlsEnabled,
              removeHighlightFunc: () => removeHighlight(highlight),
              activeElementForTextEdit: getActiveElementForText,
              setThisTextEditActive: () => setTextEditActive(highlight)
            }}
          />
        );
      });
      setHighlights(parsedHighlights);
    } else {
      setHighlights([createHighlight(0, 0, 10)]);
    }
  }

  useEffect(() => {
    initBuckets();
    initHighlights();
  }, []);

  return (
    <>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 1, up: [0, 0, 1], far: 1000 }}
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "white",
          zIndex: 0,
        }}
        dpr={[1, 2]}
        frameloop={"demand"}
      >
        <ambientLight intensity={0.5} />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false}>
            <Outline
              blur
              visibleEdgeColor="black"
              edgeStrength={2}
              width={500}
            />
          </EffectComposer>
          {buckets}
          {highlights}
        </Selection>
        <MapControls
          enabled={controlsEnabled}
          enableRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 1,
          marginTop: "10px",
          marginLeft: "10px",
        }}
      >
        <a
          href={
            "https://www.google.com/search?q=enable+hardware+acceleration+on+browser"
          }
          target={"_blank"}
          style={{ textDecoration: "none" }}
        >
          ❗Make sure to enable hardware acceleration
        </a>
        <br />
        <br />
        <button
          style={{ height: "2vh", zIndex: 0 }}
          onClick={(e) => {
            setHighlights([...highlights, createHighlight(0, 0, 10)]);
          }}
        >
          <b>Create Sticky Note</b>
        </button>
        {" | "}
        <button
          style={{ height: "2vh", zIndex: 0 }}
          onClick={(e) => {
            setBuckets([...buckets, createBucket(0, 0)]);
          }}
        >
          <b>Create Bucket</b>
        </button>
        {" | "}
        <label style={{ height: "2vh", zIndex: 0 }}>
          <b>Double click</b> any element to delete
        </label>
        {" | "}
        <label style={{ height: "2vh", zIndex: 0 }}>
          <b>Right click</b> any note to change its color
        </label>
      </div>
    </>
  );
}

export default App;
