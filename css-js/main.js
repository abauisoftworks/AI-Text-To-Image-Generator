const promptField = document.getElementById('promptField');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.getElementById('spinner');
const status = document.getElementById('status');
const preview = document.getElementById('preview');
const resultImg = document.getElementById('resultImg');

function setLoading(on){
  if(on){
    spinner.style.display = 'inline-block';
    generateBtn.disabled = true;
  } else {
    spinner.style.display = 'none';
    generateBtn.disabled = false;
  }
}

function showStatus(t){
  status.textContent = t || '';
}

function showImage(url){
  resultImg.src = url;
  preview.hidden = false;
}

async function generateImage(prompt){
  const encoded = encodeURIComponent(prompt);
  const url = `/api/generate/${encoded}`;
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 60_000);

  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(timeout);
    if(!res.ok){
      const json = await res.json().catch(()=>({error:'Unknown error'}));
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if(data.error) throw new Error(data.error);

    let imgUrl = null;
    if(typeof data.url === 'string' && data.url.length) imgUrl = data.url;
    else if(Array.isArray(data.output) && data.output.length){
      const first = data.output[0];
      if(typeof first === 'string') imgUrl = first;
      else if(first.url) imgUrl = first.url;
      else if(first.image) imgUrl = first.image;
      else if(first.base64) imgUrl = `data:image/png;base64,${first.base64}`;
    }
    if(!imgUrl) throw new Error('No image returned');

    showImage(imgUrl);
    showStatus('');
  } catch (err){
    if(err.name === 'AbortError') showStatus('Generation timed out.');
    else showStatus('Failed to generate: ' + (err.message || 'unknown'));
    preview.hidden = true;
  } finally {
    setLoading(false);
  }
}

generateBtn.addEventListener('click', () => {
  const prompt = promptField.value?.trim?.();
  if(!prompt) {
    showStatus('Type a prompt first.');
    return;
  }
  preview.hidden = true;
  showStatus('Thinking…');
  setLoading(true);
  generateImage(prompt);
});

promptField.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    generateBtn.click();
  }
});
