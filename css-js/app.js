const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");
const status = document.getElementById("status");

generateBtn.addEventListener("click", async () => {
  const prompt = encodeURIComponent(promptInput.value.trim());
  if (!prompt) return;
  resultDiv.innerHTML = "";
  status.textContent = "AI Thinking...";
  try {
    const res = await fetch(`/api/generate/${prompt}`);
    const data = await res.json();
    status.textContent = "";
    if (data.output) {
      const img = document.createElement("img");
      img.src = data.output;
      resultDiv.appendChild(img);
    } else {
      status.textContent = "The AI Couldn't Generate an Image.";
    }
  } catch {
    status.textContent = "Error Code: 670";
  }
});
