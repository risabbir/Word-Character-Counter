const textBox = document.getElementById("textBox");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const fontSize = document.getElementById("fontSize");
const fontFamily = document.getElementById("fontFamily");
const clearText = document.getElementById("clearText");
const grammarCheck = document.getElementById("grammarCheck");
const toggleStatus = document.getElementById("toggleStatus");
const suggestions = document.getElementById("suggestions");

// Word and Character Counter
textBox.addEventListener("input", function() {
    let text = this.value.trim();
    charCount.textContent = text.length;
    wordCount.textContent = text.length > 0 ? text.split(/\s+/).length : 0;

    if (grammarCheck.checked) {
        checkGrammar(text);
    } else {
        suggestions.innerHTML = "";
    }
});

// Font Size and Family
fontSize.addEventListener("change", function() {
    textBox.style.fontSize = this.value;
});

fontFamily.addEventListener("change", function() {
    textBox.style.fontFamily = this.value;
});

// Clear Text
clearText.addEventListener("click", function() {
    textBox.value = "";
    charCount.textContent = 0;
    wordCount.textContent = 0;
    suggestions.innerHTML = "";
});

// Grammar Check Toggle Status
grammarCheck.addEventListener("change", function() {
    toggleStatus.textContent = this.checked ? "Enabled" : "Disabled";
    if (!this.checked) {
        suggestions.innerHTML = "";
    } else {
        checkGrammar(textBox.value.trim());
    }
});

// Grammar Check Functionality (Using LanguageTool API)
async function checkGrammar(text) {
    if (!text) {
        suggestions.innerHTML = "";
        return;
    }

    const apiUrl = "https://api.languagetool.org/v2/check";
    const language = "en-US";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `text=${encodeURIComponent(text)}&language=${language}`,
        });

        const data = await response.json();
        displaySuggestions(data.matches);
    } catch (error) {
        suggestions.innerHTML = "Error checking grammar. Please try again.";
    }
}

function displaySuggestions(matches) {
    suggestions.innerHTML = matches
        .map(
            (match) => `
            <div>
                <strong>${match.message}</strong><br>
                Suggested correction: <em>${match.replacements[0]?.value || "N/A"}</em>
            </div>
        `
        )
        .join("");
}