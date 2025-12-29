async function gradeTest() {
  let responses = {};

  for (let i = 1; i <= 23; i++) {
    const el = document.getElementById("q" + i);
    if (el) responses["q" + i] = el.value;
  }

  document.getElementById("result").innerText = "Marking in progress...";

  const res = await fetch("http://localhost:3000/mark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: responses })
  });

  const data = await res.json();

  localStorage.setItem("aiResults", JSON.stringify(data));

  document.getElementById("result").innerText =
    "Your total score is: " + data.totalScore + " marks";
}
