const fruits = [
  { id: 1, name: 'Banana', icon: 'https://cdn-icons-png.flaticon.com/512/688/688828.png' },
  { id: 2, name: 'Apple', icon: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' },
  { id: 3, name: 'Pear', icon: 'https://img.icons8.com/fluency/96/pear.png' },
  { id: 4, name: 'Peach', icon: 'https://img.icons8.com/fluency/96/peach.png' },
  { id: 5, name: 'Orange', icon: 'https://cdn-icons-png.flaticon.com/512/1728/1728765.png' },
  { id: 6, name: 'Melon', icon: 'https://img.icons8.com/fluency/96/melon.png' },
  { id: 7, name: 'Mango', icon: 'https://img.icons8.com/fluency/96/mango.png' },
  { id: 8, name: 'Lemon', icon: 'https://cdn-icons-png.flaticon.com/512/2224/2224323.png' }
];

let selectedAudio = null;
let selectedImage = null;
let matches = 0;

function initGame() {
  const audioCol = document.getElementById('audio-col');
  const imageCol = document.getElementById('image-col');

  // Mezclar elementos para que el reto sea distinto cada vez
  const shuffledAudio = [...fruits].sort(() => Math.random() - 0.5);
  const shuffledImages = [...fruits].sort(() => Math.random() - 0.5);

  shuffledAudio.forEach(fruit => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `🔊 Play`; 
    div.onclick = () => selectItem(fruit.id, 'audio', div, fruit.name);
    audioCol.appendChild(div);
  });

  shuffledImages.forEach(fruit => {
    const div = document.createElement('div');
    div.className = 'item';
    // Busca esta línea y reemplázala:
div.innerHTML = `<img src="${fruit.icon}" style="width:60px; height:60px; object-fit:contain;">`;
    div.onclick = () => selectItem(fruit.id, 'image', div, fruit.name);
    imageCol.appendChild(div);
  });
}

function selectItem(id, type, element, name) {
  if (element.classList.contains('correct')) return;

  if (type === 'audio') {
    // Lógica de audio para ayudar a la pronunciación
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
    
    document.querySelectorAll('#audio-col .item').forEach(i => i.classList.remove('selected'));
    selectedAudio = { id, element };
  } else {
    document.querySelectorAll('#image-col .item').forEach(i => i.classList.remove('selected'));
    selectedImage = { id, element };
  }

  element.classList.add('selected');

  if (selectedAudio && selectedImage) {
    if (selectedAudio.id === selectedImage.id) {
      handleMatch(true);
    } else {
      handleMatch(false);
    }
  }
}

function handleMatch(isCorrect) {
  const fb = document.getElementById('feedback');
  
  if (isCorrect) {
    selectedAudio.element.classList.add('correct');
    selectedImage.element.classList.add('correct');
    matches++;
    document.getElementById('score').innerText = matches;
    fb.innerText = "¡Excelente!";
    fb.style.color = "#2ecc71";
    checkWin();
  } else {
    fb.innerText = "Keep trying!";
    fb.style.color = "#e74c3c";
  }

  setTimeout(() => {
    if (!isCorrect) {
      selectedAudio.element.classList.remove('selected');
      selectedImage.element.classList.remove('selected');
    }
    selectedAudio = null;
    selectedImage = null;
  }, 500);
}

function checkWin() {
  if (matches === fruits.length) {
    const finalScore = (matches / fruits.length) * 10;
    document.getElementById('feedback').innerHTML = `<h1>¡Buen trabajo!</h1>Tu nota es: ${finalScore}/10`;
    document.getElementById('reset-btn').style.display = 'inline-block';
  }
}

// Encender el motor del juego
initGame();