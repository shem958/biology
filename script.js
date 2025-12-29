const tutorPassword = "bio123"; // CHANGE THIS

const markingScheme = {
  q6: ["valves"],
  q7: ["atherosclerosis", "stroke", "heart attack"],
  q10: ["blood clotting", "coagulation"],
  q15: ["capillaries"],
  q18: ["right atrium"]
};

function gradeTest() {
  let score = 0;
  let responses = {};

  for (let i = 1; i <= 18; i++) {
    let id = "q" + i;
    let el = document.getElementById(id);
    if (el) responses[id] = el.value.toLowerCase();
  }

  // Auto-mark short answers
  for (let q in markingScheme) {
    if (markingScheme[q].some(ans => responses[q]?.includes(ans))) {
      score += 1;
    }
  }

  localStorage.setItem("studentAnswers", JSON.stringify(responses));
  localStorage.setItem("score", score);

  document.getElementById("result").innerText =
    "Your total score is: " + score + " marks";
}

function tutorLogin() {
  if (document.getElementById("password").value === tutorPassword) {
    document.getElementById("tutorPanel").style.display = "block";

    let answers = JSON.parse(localStorage.getItem("studentAnswers"));
    let display = "";
    for (let q in answers) {
      display += `<p><strong>${q}:</strong> ${answers[q]}</p>`;
    }

    document.getElementById("studentAnswers").innerHTML = display;
    document.getElementById("totalScore").innerText =
      localStorage.getItem("score");
  } else {
    alert("Incorrect password");
  }
}
