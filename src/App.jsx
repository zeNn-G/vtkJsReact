import React from "react";

import Start from "./components/Start";
import Poly from "./components/Poly";
import ZipHttpReader from "./components/ZipHttpReader";
import XMLPolyDataWriter from "./components/XMLPolyDataWriterComp";
import ItkWasmReader from "./components/ItkWasmReader";
import XMLImageData from "./components/XMLImageData";

function App() {
  return (
    <div>
      {/* <Start /> */}
      {/* <Poly /> */}
      {/* <ZipHttpReader /> */}
      {/* <XMLPolyDataWriter /> */}
      {/* <ItkWasmReader /> */}
      <XMLImageData />
    </div>
  );
}

export default App;
