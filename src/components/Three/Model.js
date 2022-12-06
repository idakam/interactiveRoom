import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
import { useGLTF } from "@react-three/drei/core/useGLTF";
// import { useGLTF } from "@react-three/drei/core/useGLTF";
const CONFIDENCE = 0.3;

const getAngle = (p1, p2, c1, c2, m) => {
  // console.log("p1", p1);
  // console.log("p2", p2);
  if (p1["score"] > CONFIDENCE && p2["score"] > CONFIDENCE) {
    return (Math.atan2(p2["y"] - p1["y"], p2["x"] - p1["x"]) + c1) * m;
  }
  return c2 * m;
};

const normalize = (min, max, val) => {
  return ((val - min) / (max - min)) * Math.PI;
};

const getYRotation = (p1, p2, p3) => {
  if (
    p1["score"] > CONFIDENCE &&
    p2["score"] > CONFIDENCE &&
    p3["score"] > CONFIDENCE
  ) {
    let e1 = Math.abs(p1["x"] - p3["x"]);
    let e2 = Math.abs(p2["x"] - p3["x"]);
    return normalize(-100, 100, e2 - e1) - Math.PI / 2;
  }
  return 0;
};

const getZRotation = (p1, p2) => {
  if (p1["score"] > CONFIDENCE && p2["score"] > CONFIDENCE) {
    let e1 = Math.abs(p1["y"]);
    let e2 = Math.abs(p2["y"]);
    return normalize(-80, 80, e2 - e1) - Math.PI / 2;
  }
  return 0;
};

export default function Model(props) {
  let kp;
  const group = useRef();
  // const loader = new GLTFLoader();
  useGLTF.preload("./model.glb");
  const { nodes, materials } = useGLTF("./model.glb");
  console.log(nodes, "NODES");
  // console.log(
  //   nodes.lay_figure.skeleton.bones[7].rotation.y,
  //   "nodes_figure!!!!!!!"
  // );
  useFrame((state, delta) => {
    kp = props.getJoints();
    // console.log(kp);
    // Left arm & elbow

    nodes.lay_figure.skeleton.bones[7].rotation.y = getAngle(
      kp[11], // left should
      kp[13], // left elbow
      0,
      0,
      -1
    );
    nodes.lay_figure.skeleton.bones[9].rotation.x = getAngle(
      kp[13], //leftelbow
      kp[15], //leftwrist
      0,
      0,
      1
    );

    //Right arm & elbow
    nodes.lay_figure.skeleton.bones[15].rotation.y = getAngle(
      kp[14], //rightelbow
      kp[12], //rightshoulder
      0,
      0,
      -1
    );
    nodes.lay_figure.skeleton.bones[17].rotation.x = getAngle(
      kp[16], //rightwrist
      kp[14], //rightelbow
      0,
      0,
      -1
    );

    // // Left leg & knee
    nodes.lay_figure.skeleton.bones[23].rotation.z = getAngle(
      kp[23], //lefthip
      kp[25], //leftknee
      Math.PI / 2,
      Math.PI,
      -1
    );
    //nodes.Ch36.skeleton.bones[56].rotation.z = getAngle(kp[15], kp[13], (Math.PI/2), 0, -1)

    // // Right leg & knee
    nodes.lay_figure.skeleton.bones[28].rotation.z = getAngle(
      kp[24], //righthip
      kp[26], //rightknee
      Math.PI / 2,
      Math.PI,
      -1
    );
    // //nodes.Ch36.skeleton.bones[61].rotation.z = getAngle(kp[16], kp[14], (Math.PI/2), 0, -1)

    // Head
    nodes.lay_figure.skeleton.bones[5].rotation.y = getYRotation(
      kp[7], //left ear
      kp[8], //right eye
      kp[0]
    );
    nodes.lay_figure.skeleton.bones[5].rotation.z = getZRotation(kp[7], kp[8]);
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group
        name="Armature"
        rotation={[Math.PI / 2, 0, 0]}
        // scale={[0.01, 0.01, 0.01]}
      >
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          geometry={nodes.lay_figure.geometry}
          material={materials["Wood.001"]}
          skeleton={nodes.lay_figure.skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload("../../../model.glb");
