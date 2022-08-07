import React, { useState, useRef, useEffect } from "react";

import "@kitware/vtk.js/Rendering/Profiles/Volume";

import "@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper";

import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkPlane from "@kitware/vtk.js/Common/DataModel/Plane";
import vtkMatrixBuilder from "@kitware/vtk.js/Common/Core/MatrixBuilder";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";

const Poly = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      const resetCamera = renderer.resetCamera;
      const render = renderWindow.render;

      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

      const actor = vtkVolume.newInstance();
      const mapper = vtkVolumeMapper.newInstance();
      mapper.setSampleDistance(1.1);
      actor.setMapper(mapper);

      const clipPlane1 = vtkPlane.newInstance();
      const clipPlane2 = vtkPlane.newInstance();
      let clipPlane1Position = 0;
      let clipPlane2Position = 0;
      let clipPlane1RotationAngle = 0;
      let clipPlane2RotationAngle = 0;
      const clipPlane1Normal = [-1, 1, 0];
      const clipPlane2Normal = [0, 0, 1];
      const rotationNormal = [0, 1, 0];

      reader
        .setUrl(`https://kitware.github.io/vtk-js/data/volume/headsq.vti`)
        .then(() => {
          const data = reader.getOutputData();
          const extent = data.getExtent();
          const spacing = data.getSpacing();
          const sizeX = extent[1] * spacing[0];
          const sizeY = extent[3] * spacing[1];

          renderer.resetCamera();
          renderWindow.render();
        });

      context.current = {
        actor,
        mapper,
        clipPlane1,
        clipPlane2,
        clipPlane1Position,
        clipPlane2Position,
        clipPlane1RotationAngle,
        clipPlane2RotationAngle,
        rotationNormal,
        resetCamera,
        render,
      };
    }
  }, [vtkContainerRef]);

  return (
    <div>
      <div ref={vtkContainerRef} />
    </div>
  );
};

export default Poly;
