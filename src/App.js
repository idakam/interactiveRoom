// import logo from "./logo.svg";
import "./App.css";
import React, { Suspense, useState } from "react";
import Camera from "./components/Camera";
// import Canvas from "./components/Canvas";
import { Canvas } from "@react-three/fiber";
import Model from "./components/Three/Model.js";
import Lights from "./components/Three/lights.js";
import CameraView from "./components/CameraView";

function App() {
  let kp;

  const mapJoints = (keypoints) => {
    kp = keypoints;
  };

  const getJoints = () => {
    return kp;
  };

  return (
    <div className="App">
      {/* <header className="App-header"></header> */}

      {/* <Canvas /> */}

      <div style={{ position: "relative", width: 600, height: 600 }}>
        <Canvas
          colormanagement="true"
          shadowmap="true"
          camera={{ position: [0, 0, 2], fov: 60 }}
        >
          <Lights />
          <Suspense fallback={null}>
            <mesh position={[0, -1, 0]}>
              <Model getJoints={getJoints} />
            </mesh>
          </Suspense>
        </Canvas>
        {/* <Camera mapJoints={mapJoints} /> */}
      </div>
      {/* <CameraView mapJoints={mapJoints} /> */}
      <Camera mapJoints={mapJoints} />
    </div>
  );
}

export default App;
