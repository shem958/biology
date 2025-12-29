async function gradeTest() {
    let responses = {};

    // Collect all answers from q1 to q23
    for (let i = 1; i <= 23; i++) {
        const el = document.getElementById("q" + i);
        if (el) {
            responses["q" + i] = el.value;
        }
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Marking in progress... Please wait.";

    try {
        // Use relative path so it works on both localhost and deployed environments
        const res = await fetch("/mark", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ answers: responses })
        });

        if (!res.ok) throw new Error("Server error during marking");

        const data = await res.json();

        // Store results for use in other pages (like tutor.html)
        localStorage.setItem("aiResults", JSON.stringify(data));

        // Display results to user
        resultDiv.innerHTML = `
            <strong>Your total score is: ${data.totalScore} / 50 marks</strong><br>
            <p><em>Teacher's Feedback:</em> ${data.feedback}</p>
        `;

    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerText = "Error: Could not connect to the marking server.";
    }
}