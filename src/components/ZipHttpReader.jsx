import React, { useRef, useState, useEffect } from "react";

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

const VolumeClip = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      const reader = vtkHttpDataSetReader.newInstance();

      const actor = vtkVolume.newInstance();
      const mapper = vtkVolumeMapper.newInstance();

      mapper.setSampleDistance(0.7);
      actor.setMapper(mapper);

      //! Color Opacity

      const ctfun = vtkColorTransferFunction.newInstance();
      ctfun.addRGBPoint(200.0, 0.4, 0.2, 0.0);
      ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0);
      const ofun = vtkPiecewiseFunction.newInstance();
      ofun.addPoint(200.0, 0.0);
      ofun.addPoint(1200.0, 0.5);
      ofun.addPoint(3000.0, 0.8);
      actor.getProperty().setRGBTransferFunction(0, ctfun);
      actor.getProperty().setScalarOpacity(0, ofun);
      actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
      actor.getProperty().setInterpolationTypeToLinear();
      actor.getProperty().setUseGradientOpacity(0, true);
      actor.getProperty().setGradientOpacityMinimumValue(0, 15);
      actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
      actor.getProperty().setGradientOpacityMaximumValue(0, 100);
      actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
      actor.getProperty().setShade(true);
      actor.getProperty().setAmbient(0.2);
      actor.getProperty().setDiffuse(0.7);
      actor.getProperty().setSpecular(0.3);
      actor.getProperty().setSpecularPower(8.0);

      mapper.setInputConnection(reader.getOutputPort());

      reader
        .setUrl(
          "https://data.kitware.com/api/v1/file/58e79a8b8d777f16d095fcd7/download",
          { fullPath: true, compression: "zip", loadData: true }
        )
        .then(() => {
          renderer.addVolume(actor);
          renderer.resetCamera();
          renderer.getActiveCamera().zoom(1.5);
          renderer.getActiveCamera().elevation(70);
          renderer.updateLightsGeometryToFollowCamera();
          renderWindow.render();
          // now that the small dataset is loaded we pull down the
          // full resolution 256x256x91 dataset
          reader
            .setUrl(
              "https://data.kitware.com/api/v1/file/58e665158d777f16d095fc2e/download",
              { fullPath: true, compression: "zip", loadData: true }
            )
            .then(() => {
              renderWindow.render();
            });
        });

      context.current = {
        renderer,
        renderWindow,
        actor,
        mapper,
        reader,
        ctfun,
        ofun,
        fullScreenRenderer,
      };
    }
  }, [vtkContainerRef]);

  return (
    <div>
      <div ref={vtkContainerRef} />
    </div>
  );
};

export default VolumeClip;
