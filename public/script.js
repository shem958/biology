async function gradeTest() {
    let responses = {};
    for (let i = 1; i <= 23; i++) {
        const el = document.getElementById("q" + i);
        if (el) responses["q" + i] = el.value;
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<p style='color: blue;'>Grading in progress... Please wait.</p>";

    try {
        const res = await fetch("/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: responses })
        });

        const data = await res.json();
        
        // Save to local storage for the tutor page if needed
        localStorage.setItem("aiResults", JSON.stringify(data));

        // WhatsApp Setup
        const tutorNumber = "254716619442";
        const message = `Hi, I have completed my Heart Biology Test. I scored ${data.totalScore}/50. A full report has been sent to your email!`;
        const waLink = `https://wa.me/${tutorNumber}?text=${encodeURIComponent(message)}`;

        resultDiv.innerHTML = `
            <div style="padding: 20px; border: 2px solid green; border-radius: 10px; text-align: center;">
                <h2 style="margin: 0;">Submission Successful!</h2>
                <h1 style="color: #2c3e50;">Score: ${data.totalScore} / 50</h1>
                <p><em>"${data.feedback}"</em></p>
                <hr>
                <p>The full breakdown has been automatically emailed to the tutor.</p>
                <a href="${waLink}" target="_blank" 
                   style="display: inline-block; background-color: #25D366; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
                   Click to Notify Tutor on WhatsApp
                </a>
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = "<p style='color: red;'>Connection Error. Please try again.</p>";
    }
}