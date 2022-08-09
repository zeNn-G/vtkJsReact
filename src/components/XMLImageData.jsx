import React, { useEffect, useRef, useState } from "react";

import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../fireBase";

import "@kitware/vtk.js/Rendering/Profiles/Volume";

import "@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper";

import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";

import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";

import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkXMLImageDataWriter from "@kitware/vtk.js/IO/XML/XMLImageDataWriter";

import vtkXMLWriter from "@kitware/vtk.js/IO/XML/XMLWriter";
import vtkXMLReader from "@kitware/vtk.js/IO/XML/XMLReader";

const fileContent = `
<?xml version="1.0"?>
<VTKFile type="PolyData" version="0.1" byte_order="LittleEndian" compressor="vtkZLibDataCompressor">
  <PolyData>
    <FieldData>
      <DataArray type="Int32" Name="SetEdgeVisibility" NumberOfTuples="1" format="appended" RangeMin="131325"               RangeMax="131325"               offset="0"                   />
      <Array type="String" Name="LayerName" NumberOfTuples="1" format="appended" offset="40"                  />
      <DataArray type="UInt8" Name="ColorPallets" NumberOfComponents="4" NumberOfTuples="5" format="appended" RangeMin="290.42382822"         RangeMax="510"                  offset="116"                 />
    </FieldData>
    <Piece NumberOfPoints="97"                   NumberOfVerts="0"                    NumberOfLines="0"                    NumberOfStrips="0"                    NumberOfPolys="98"                  >
      <PointData>
      </PointData>
      <CellData Scalars="_DefaultCellThematicColorScalar">
        <DataArray type="Int32" Name="cell_texture_mapping" format="appended" RangeMin="-1"                   RangeMax="-1"                   offset="176"                 />
        <DataArray type="Int32" Name="_DefaultCellColorScalar" format="appended" RangeMin="0"                    RangeMax="0"                    offset="220"                 />
        <DataArray type="Float64" Name="_DefaultCellValueScalar" format="appended" RangeMin="0"                    RangeMax="29"                   offset="264"                 />
        <DataArray type="Float64" Name="_DefaultCellIdScalar" format="appended" RangeMin="751"                  RangeMax="780"                  offset="412"                 />
        <DataArray type="Int32" Name="_DefaultCellThematicColorScalar" format="appended" RangeMin="1"                    RangeMax="4"                    offset="572"                 />
        <DataArray type="Int32" Name="_DefaultCellThematicSlotIndex" format="appended" RangeMin="0"                    RangeMax="3"                    offset="648"                 />
        <DataArray type="Int32" Name="_InTresh_0" format="appended" RangeMin="0"                    RangeMax="0"                    offset="724"                 />
      </CellData>
      <Points>
        <DataArray type="Float64" Name="Points" NumberOfComponents="3" format="appended" RangeMin="4410666.4761"         RangeMax="4410703.4121"         offset="768"                 />
      </Points>
      <Verts>
        <DataArray type="Int32" Name="connectivity" format="appended" RangeMin=""                     RangeMax=""                     offset="1188"                />
        <DataArray type="Int32" Name="offsets" format="appended" RangeMin=""                     RangeMax=""                     offset="1204"                />
      </Verts>
      <Lines>
        <DataArray type="Int32" Name="connectivity" format="appended" RangeMin=""                     RangeMax=""                     offset="1220"                />
        <DataArray type="Int32" Name="offsets" format="appended" RangeMin=""                     RangeMax=""                     offset="1236"                />
      </Lines>
      <Strips>
        <DataArray type="Int32" Name="connectivity" format="appended" RangeMin=""                     RangeMax=""                     offset="1252"                />
        <DataArray type="Int32" Name="offsets" format="appended" RangeMin=""                     RangeMax=""                     offset="1268"                />
      </Strips>
      <Polys>
        <DataArray type="Int32" Name="connectivity" format="appended" RangeMin=""                     RangeMax=""                     offset="1284"                />
        <DataArray type="Int32" Name="offsets" format="appended" RangeMin=""                     RangeMax=""                     offset="1964"                />
      </Polys>
    </Piece>
  </PolyData>
  <AppendedData encoding="base64">
   _AQAAAACAAAAEAAAADAAAAA==eJz7y8DEAAAD/AEAAQAAAACAAAAlAAAAJgAAAA==eJzzcw0JCPL39fRz1dcHMryAlJOPv7ePYxCEYahhqMkAAMK2CX4=AQAAAACAAAAUAAAAGgAAAA==eJz7/x8EGhj+///16z8DQ/f//wuqAKyEDw8=AQAAAACAAACIAQAADgAAAA==eJz7/38UDAYAAMophog=AQAAAACAAACIAQAADgAAAA==eJxjYBgFgwEAAAGIAAE=AQAAAACAAAAQAwAAXAAAAA==eJyVxSsKgFAQBdCJRoPBYBARERHx/xfd/2pcgmXSwH33ecoR+eO93cvjPgCH5AgckxNySs7Mubkwl+AKXIMbcwvuyL0+6CN5As/ghbzqG3knH56f4Mv7D6D7KYI=AQAAAACAAAAQAwAAZgAAAA==eJxjYACCinYHBmLoBgJ0BwF6Ag56BgF6AQ56BQF6AwF6BwH6ABp9Ao2+gEbfwEE/wEG/wEF/QKN/4KAZOvDTHFBaAEpLEKAVcNAaOGgDArQFlHYgQHsQoAOIpCNw0AnE0wC2W3uaAQAAAACAAACIAQAAJwAAAA==eJxjZGBgYBxkmAmKsckxI2FK5bGpw6cfm158ZmHTx4IDAwBn1ACrAQAAAACAAACIAQAAJgAAAA==eJxjYmBgYBpkmBmKsckxImFK5bGpw6cfm158ZmHThwsAAI6MAKE=AQAAAACAAACIAQAADgAAAA==eJxjYBgFgwEAAAGIAAE=AQAAAACAAAAYCQAAKQEAAA==eJyF0z1OQlEQhuEdWLECpLChndJA+4XCaPyJmlkFNVsw9hcXwQJspHQHboHEysLEEChOQs79zutt3zyZMwww3ay//7qz+fnX7/v159X84+fi+SVeZ9Njn6zbvfj9Tdtbt/mC+YL5gvmC+QnzE+YnzC99AXsuYB/zCZ7eHYMfV/7ytu2p0/d18gFzyAu8wCf4+g6ru/b+1s0H+NKXcM8l3M18gKf5Ai/wCb7udgfrdAeBF3h6t/e/uG/fwbp5gRf4BF96B99jB3czH+ADvMALfIKnz1XvOdwDuqDX7+4f2t66+QRf+hbuuYX9zQu8wCd42rN+d7gLeu93+Nj21s0n+NJ3cIcd7Gk+wVMP2CcqP9wFvbw7evvXr556vXjqdLeTT5hz7AcW8455AAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAAAAAACAAAAAAAAAAQAAAACAAAAgBgAA6wEAAA==eJxNkAkzglEYhRESkixlL8k2yJYtS0K2JGQr6///Fc4ZTzNfM890Ou+55763jrb/T6foFu0iJMKii1k7upNZB9kwsza8EL5zPaIX7bMRvDAZz/rwImh7/SIqYmKAs/3oCLqLnijeAHl3DIlBdhlFx8UIXhzPuWEyrfcmySXEGP0hvCiZBGeSZJL4vns84FlP4MfQ9ia52x3TYgrPeoadhvCmyCWYOZMSaZERs7wnhR5Bx+lJ482Sd8+cyIoFMc+75tAxdJR3ZPHmyfsNi+zlfZa4YxhvEb/1/y2jM3S1vDG6Vvh29yq/1+hwbl3k8Kw3uHMGL4e/zNlNMuvoLfxVtL1tkRe7Yof9t9EZdJq35PGd3Rd7ZHbQWb49K4iDgHfAuxbQBfY4pHuJ/X3HkTjmniMyObw8+cNALsc7T+h0d5E3njKzPhMlPOtzzmzglcgVmTlzIcriSlyy0wV6H73LHmV8Z2/ENZlLdAGumfueW86ecL87KuKOngqZEl6Z/C2zIl1Vdr4na/0ganjWj3SU8GrkqsyceRJ18SKe2eEJfYO+oqeO90zePW+B/d3/Kt5Fg3wFr07mnTM1Mq9k3pjV8Zvc0SD7iFfFb+J9BvI/4kN8iV/xzewD3WT2SfaXWQPvi8w3M2f+AEJVR+M=AQAAAACAAACIAQAAuwAAAA==eJwNwxF0QlEAANC3c4IgCIIgCIIgCIIPH4IgCIIgCIIgCIIgCILgQxAMBoPBYBAEg8EgCIIgCAaDwSAIgiAY7N5zbiqEkDZj1px5CxYtWbZi1ZqRsXUbNm3ZtmPXnn0HDh05duLUmXMXJi5d+eiTz7746ptrN7774adbd+49ePTkl9/++OvZi1dv3v0zPISQMm3GrDnzFixasmzFqjUjY+s2bNqybceuPfsOHDpy7MSpM+cuTPwHrzAo8A==
  </AppendedData>
</VTKFile>
`;

const ClipPlane = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const vtkListRef = ref(storage, "vtkFiles/");
  const [vtkUrl, setVtkUrl] = useState([]);

  // useEffect(() => {
  //   listAll(vtkListRef).then((files) => {
  //     files.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setVtkUrl((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });

      const writer = vtkXMLImageDataWriter.newInstance();
      writer.setFormat(vtkXMLWriter.FormatTypes.BINARY);
      writer.setInputConnection(reader.getOutputPort());

      const writerReader = vtkXMLImageDataReader.newInstance();
      reader
        .setUrl(`https://kitware.github.io/vtk-js/data/volume/headsq.vti`, {
          loadData: true,
        })
        .then(() => {
          const fileContents = writer.write(reader.getOutputData());

          // Try to read it back.
          const textEncoder = new TextEncoder();
          writerReader.parseAsArrayBuffer(textEncoder.encode(fileContents));
          renderer.resetCamera();
          renderWindow.render();
        });

      const actor = vtkVolume.newInstance();
      const mapper = vtkVolumeMapper.newInstance();
      mapper.setSampleDistance(1.1);
      actor.setMapper(mapper);

      mapper.setInputConnection(reader.getOutputPort());

      const ctfun = vtkColorTransferFunction.newInstance();
      ctfun.addRGBPoint(200.0, 1.0, 1.0, 1.0);
      ctfun.addRGBPoint(2000.0, 0.0, 0.0, 0.0);
      const ofun = vtkPiecewiseFunction.newInstance();
      ofun.addPoint(200.0, 0.0);
      ofun.addPoint(1200.0, 0.2);
      ofun.addPoint(4000.0, 0.4);
      actor.getProperty().setRGBTransferFunction(0, ctfun);
      actor.getProperty().setScalarOpacity(0, ofun);
      actor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
      // actor.getProperty().setInterpolationTypeToNearest();
      // actor.getProperty().setInterpolationTypeToFastLinear();
      actor.getProperty().setInterpolationTypeToLinear();

      renderer.addActor(actor);

      // const reader = vtkXMLPolyDataReader.newInstance();
      // console.log(reader);
      // const actor = vtkVolume.newInstance();
      // const mapper = vtkVolumeMapper.newInstance();
      // mapper.setSampleDistance(1.1);
      // actor.setMapper(mapper);

      // const ctfun = vtkColorTransferFunction.newInstance();
      // ctfun.addRGBPoint(0, 85 / 255.0, 0, 0);
      // ctfun.addRGBPoint(95, 1.0, 1.0, 1.0);
      // ctfun.addRGBPoint(225, 0.66, 0.66, 0.5);
      // ctfun.addRGBPoint(255, 0.3, 1.0, 0.5);

      // const ofun = vtkPiecewiseFunction.newInstance();
      // ofun.addPoint(0.0, 0.0);
      // ofun.addPoint(255.0, 1.0);

      // actor.getProperty().setRGBTransferFunction(0, ctfun);
      // actor.getProperty().setScalarOpacity(0, ofun);
      // actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
      // actor.getProperty().setInterpolationTypeToLinear();
      // actor.getProperty().setUseGradientOpacity(0, true);
      // actor.getProperty().setGradientOpacityMinimumValue(0, 2);
      // actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
      // actor.getProperty().setGradientOpacityMaximumValue(0, 20);
      // actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
      // actor.getProperty().setShade(true);
      // actor.getProperty().setAmbient(0.2);
      // actor.getProperty().setDiffuse(0.7);
      // actor.getProperty().setSpecular(0.3);
      // actor.getProperty().setSpecularPower(8.0);

      // mapper.setInputConnection(reader.getOutputPort());

      // reader
      //   .setUrl(
      //     "https://mega.nz/file/RnZH2IDb#SWXc8oPZOz0bgZnH6nmIX8dgrhxVBLqj6NOowGioik8"
      //   )
      //   .then(() => {
      //     const enc = new TextEncoder();
      //     const arrayBuffer = enc.encode(fileContent);

      //     reader.parseAsArrayBuffer(arrayBuffer);
      //     const imageData = reader.getOutputData();

      //     mapper.setInputData(imageData);
      //     renderer.resetCamera();
      //     renderWindow.render();
      //   });

      context.current = {
        renderer,
        renderWindow,
        actor,
        mapper,
        ctfun,
        ofun,
      };
    }
  }, [vtkContainerRef]);
  return <div ref={vtkContainerRef} />;
};

export default ClipPlane;
