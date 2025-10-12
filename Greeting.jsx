function Greeting({ name }) {
  return (
    <div className="m-4 p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-blue-700">
        Hello, {name}!
      </h2>
    </div>
  );
}

export default Greeting;