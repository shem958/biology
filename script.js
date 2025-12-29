const tutorPassword = "bio123"; // CHANGE THIS

// Auto-marked short-answer questions
const autoMarking = {
  q9: ["capillaries"],
  q13: ["valves"],
  q19: ["atherosclerosis", "heart attack", "stroke"],
  q21: ["blood clotting", "coagulation"]
};

function gradeTest() {
  let score = 0;
  let responses = {};

  for (let i = 1; i <= 23; i++) {
    const el = document.getElementById("q" + i);
    if (el) {
      responses["q" + i] = el.value.toLowerCase().trim();
    }
  }

  // Auto grading (simple keywords)
  for (let q in autoMarking) {
    if (autoMarking[q].some(ans => responses[q]?.includes(ans))) {
      score += 1;
    }
  }

  localStorage.setItem("studentAnswers", JSON.stringify(responses));
  localStorage.setItem("score", score);

  document.getElementById("result").innerText =
    "Your total score is: " + score + " marks";
}

function tutorLogin() {
  const pass = document.getElementById("password").value;

  if (pass === tutorPassword) {
    document.getElementById("tutorPanel").style.display = "block";

    const answers = JSON.parse(localStorage.getItem("studentAnswers")) || {};
    let output = "";

    for (let q in answers) {
      output += `<p><strong>${q.toUpperCase()}:</strong> ${answers[q]}</p>`;
    }

    document.getElementById("studentAnswers").innerHTML = output;
    document.getElementById("totalScore").innerText =
      localStorage.getItem("score") + " marks";
  } else {
    alert("Incorrect password");
  }
}
