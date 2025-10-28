const btn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const status = document.getElementById("status");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  status.textContent = "Generating...";
  result.innerHTML = "";

  try {
    const res = await fetch(`/api/generate/${encodeURIComponent(prompt)}`);
    const data = await res.json();

    if (data.error) {
      status.textContent = "Error: " + data.error;
      return;
    }

    status.textContent = "Done!";
    const img = document.createElement("img");
    img.src = data.url;
    result.appendChild(img);

  } catch (e) {
    status.textContent = "Failed to generate.";
    console.error(e);
  }
});
