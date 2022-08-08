import React, { useRef, useState, useEffect } from "react";

import { getDownloadURL, ref, list, listAll } from "firebase/storage";
import { storage } from "../fireBase";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";

import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkXMLPolyDataWriter from "@kitware/vtk.js/IO/XML/XMLPolyDataWriter";
import vtkXMLWriter from "@kitware/vtk.js/IO/XML/XMLWriter";

import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";

const XMLPolyDataWriter = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const vtkListRef = ref(storage, "vtkFiles/");
  const [vtkUrl, setVtkUrl] = useState([]);

  useEffect(() => {
    listAll(vtkListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setVtkUrl((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
      });
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

      const writer = vtkXMLPolyDataWriter.newInstance();
      writer.setFormat(vtkXMLWriter.FormatTypes.BINARY);
      writer.setInputConnection(reader.getOutputPort());

      const writerReader = vtkXMLPolyDataReader.newInstance();

      reader
        .setUrl(`https://kitware.github.io/vtk-js/data/cow.vtp`, {
          loadData: true,
        })
        .then(() => {
          const fileContents = writer.write(reader.getOutputData());

          const textEncoder = new TextEncoder();
          writerReader.parseAsArrayBuffer(textEncoder.encode(fileContents));
          renderer.resetCamera();
          renderWindow.render();
        });

      const actor = vtkActor.newInstance();
      const mapper = vtkMapper.newInstance();
      actor.setMapper(mapper);

      mapper.setInputConnection(writerReader.getOutputPort());

      renderer.addActor(actor);

      context.current = {
        renderer,
        renderWindow,
        reader,
        writer,
        writerReader,
        actor,
        mapper,
      };
    }
  }, [vtkContainerRef]);

  return (
    <div>
      <div ref={vtkContainerRef} />
    </div>
  );
};

export default XMLPolyDataWriter;
