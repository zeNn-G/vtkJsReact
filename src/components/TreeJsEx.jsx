import React, { useEffect } from "react";
import * as THREE from "three";
import { VTKLoader } from "three/examples/jsm/loaders/VTKLoader";

import SceneInit from "../utils/renderingVtkThree";

const TreeJsEx = () => {
  useEffect(() => {
    const test = new SceneInit("threeCanvas");
    test.initialize();
    test.animate();

    const loader = new VTKLoader();
    loader.load("/src/assets/vtk-vtp/SolidAscii--ok.vtk", (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      geometry.scale(0.1, 0.1, 0.1);

      const material = new THREE.MeshLambertMaterial({ color: 0xfffffff });
      const mesh = new THREE.Mesh(geometry, material);

      test.scene.add(mesh);
    });
  }, []);

  return (
    <div>
      <canvas id="threeCanvas"></canvas>
    </div>
  );
};

export default TreeJsEx;
