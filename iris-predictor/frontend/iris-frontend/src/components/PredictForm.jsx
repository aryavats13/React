import React from "react";

function PredictForm() {
  const [Slength, setSlength] = React.useState(0);
  const [Swidth, setSwidth] = React.useState(0);
  const [Plength, setPlength] = React.useState(0);
  const [Pwidth, setPwidth] = React.useState(0);
  const [prediction, setPrediction] = React.useState("");

  const handlePredict = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sepal_length: Slength,
        sepal_width: Swidth,
        petal_length: Plength,
        petal_width: Pwidth,
      }),
    });

    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <form onSubmit={handlePredict}>
      <input
        type="number"
        value={Slength}
        onChange={(e) => setSlength(e.target.value)}
        placeholder="Sepal Length (cm)"
      />
      <input
        type="number"
        value={Swidth}
        onChange={(e) => setSwidth(e.target.value)}
        placeholder="Sepal Width (cm)"
      />
      <input
        type="number"
        value={Plength}
        onChange={(e) => setPlength(e.target.value)}
        placeholder="Petal Length (cm)"
      />
      <input
        type="number"
        value={Pwidth}
        onChange={(e) => setPwidth(e.target.value)}
        placeholder="Petal Width (cm)"
      />
      <button type="submit">Predict</button>

      {prediction && <p>Predicted flower: {prediction}</p>}
    </form>
  );
}

export default PredictForm;
