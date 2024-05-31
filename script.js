// chamando variáveis
const progressBar = document.getElementById("progressBar");
const buttonPlay = document.querySelector('#play');
const buttonPause = document.querySelector('#pause');
const tempoAtual = document.getElementById("tempoAtual");
const tempoTotal = document.getElementById("tempoTotal");
const buttonAvancar = document.getElementById('avancar');
const buttonVoltar = document.getElementById('voltar');

const musicTitle = document.querySelector('.desc-musica p');
const musicArtist = document.querySelector('.desc-musica span');
const musicImage = document.querySelector('.conteudo-musica img');
const cardPlayer = document.querySelector('.card-player');
const Buscar = document.getElementById('buscar')

// vetor com as músicas e informações
const music = new Audio();
let playlist = [];
let interval;
let currentIndex = 0;


// funções
async function buscarMusica(){
  const pesquisa = buscarInput.value;
  const url = `https://api.deezer.com/search?q=${query}`;
  try{
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();
    playlist = data.data.map(track =>({
      title: track.title,
      artist: track.artist.name,
      audio: track.preview,
      image: track.album.cover_medium,

    }));
    currentIndex = 0;
    carregarMusica(currentIndex);
  } catch (error){
    console.error('Erro ao buscar a música', error);
  }
}
function carregarMusica(currentIndex) {
  if (playlist.length === 0) return;

  const musica = playlist[currentIndex];
  musicTitle.textContent = musica.title;
  musicArtist.textContent = musica.artist;
  musicImage.src = musica.image;
  music.src = musica.audio;
  
  music.addEventListener('loadedmetadata', function() {
    tempoTotal.textContent = formatarTempo(music.duration);
  });
  
  tempoAtual.textContent = "00:00";
  progressBar.value = 0;
}


function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function updateMusicTime() {
  const progresso = (music.currentTime / music.duration) * 100;
  progressBar.value = progresso;
  tempoAtual.textContent = formatarTempo(music.currentTime);
}

function avancar() {
  currentIndex = (currentIndex + 1) % playlist.length; 
  carregarMusica(currentIndex);
  play();
}
  
function play() {
  buttonPlay.classList.add('hide');
  buttonPause.classList.remove('hide');
  music.play();
  interval = setInterval(updateMusicTime, 1000);
}

function pause() {
  buttonPlay.classList.remove('hide');
  buttonPause.classList.add('hide');
  music.pause();
  clearInterval(interval);
}

function voltar() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  carregarMusica(currentIndex);
  play();
}

function setProgress(){
  const progressBarra = progressBar.value;
  const tempo = (progressBarra/100)* music.duration;
  music.currentTime = tempo;
}

carregarMusica(currentIndex); 
buttonPlay.addEventListener('click', play);
buttonPause.addEventListener('click', pause);
buttonAvancar.addEventListener('click', avancar);
buttonVoltar.addEventListener('click', voltar);
progressBar.addEventListener('input', setProgress);