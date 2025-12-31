import Components from "./Components";
import SnowCanvas from "./Components/SnowCanvas";

function App() {
  return (
    <div className="App" style={{ fontFamily: "F1,sans-serif" }}>
       <SnowCanvas />
      <Components />
      <pre className="text-center fs-3 fw-bolder">▓FORMULA 1 RACE RESULTS▓</pre>
    </div>
  );
}

export default App;
