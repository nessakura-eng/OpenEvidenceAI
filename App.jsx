import Greeting from "./Greeting";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Props Demo</h1>
      <Greeting name="FGCU" />
      <Greeting name="Computer Science and Software Engineering Club" />
    </div>
  );
}

export default App;