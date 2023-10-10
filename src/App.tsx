import { useState } from "react";
import "./App.css";
import "./style/slider.css";
import { Slider } from "./custom-hook/Slider";
import { Slider as Slider2 } from "./xstate/Slider";

function App() {
  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState(false);

  return (
    <div className="App">
      <Slider value={value} onValueChange={(v) => setValue(v)} />
      <Slider2 value={value} onChange={(v) => setValue(v)} />
    </div>
  );
}

export default App;
