const html = document.querySelector("html");

const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const botoes = document.querySelectorAll(".app__card-button");

// Musica
const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio("./sons/luna-rise-part-one.mp3");
const musicaDePausa = new Audio('./sons/pause.mp3')
const musicaPlay = new Audio('./sons/play.wav')
const musicaDeFinalizacao = new Audio('./sons/beep.mp3')
const startPauseBt = document.querySelector('#start-pause')
const iniciarOupausarBt = document.querySelector("#start-pause span")
const imagemDecomecoEPause = document.querySelector('.app__card-primary-butto-icon')
let tempoDecorridoEmsegundos = 10;
let intervaloId = null;



const tempoNaTela = document.querySelector("#timer");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");



musica.loop = true;
musicaFocoInput.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

function alterarContexto(contexto) {
  botoes.forEach(function (contexto) {
    contexto.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `./imagens/${contexto}.png`);
  mostraTempo()
  switch (contexto) {
    case "foco":
      titulo.innerHTML = `
        Otimize sua produtividade,<br>
        <strong class="app__title-strong">mergulhe no que importa.</strong>
        `;
      break;

    case "descanso-curto":
      titulo.innerHTML = `
        Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
        `;
      break;

    case "descanso-longo":
      titulo.innerHTML = `
        Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
        `;
    default:
      break;
  }
}

focoBt.addEventListener("click", () => {
  alterarContexto("foco");
  focoBt.classList.add("active");
  tempoDecorridoEmsegundos = 1500
});

curtoBt.addEventListener("click", () => {
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
  tempoDecorridoEmsegundos = 300
});

longoBt.addEventListener("click", () => {
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
  tempoDecorridoEmsegundos = 900
});

const contageRegressima = () => {
  if (tempoDecorridoEmsegundos <= 0) {
    musicaDeFinalizacao.play()
    alert('Tempo Finaliado')
    const focoAtivo = html.getAttribute("data-contexto") == 'foco'
    if (focoAtivo) {
      const evento = new CustomEvent('FocoFinalizado')
      document.dispatchEvent(evento)
    }
    zerar()
    return
  }
  tempoDecorridoEmsegundos -= 1
  console.log('Temporizador: ' + tempoDecorridoEmsegundos);
  mostraTempo()
}

startPauseBt.addEventListener('click',  iniciarOuPAusar)

function iniciarOuPAusar() {
  if (intervaloId) {
    zerar()
    musicaDePausa.play()
    return
  }
  musicaPlay.play() 
  intervaloId = setInterval(contageRegressima, 1000)
  iniciarOupausarBt.textContent = 'Pausar'
  imagemDecomecoEPause.setAttribute('src', './imagens/pause.png')
}

function zerar() {
  clearInterval(intervaloId)
  iniciarOupausarBt.textContent = 'Começar'
  intervaloId = null
  imagemDecomecoEPause.setAttribute('src', './imagens/play_arrow.png')
}

function mostraTempo() {
  const tempo = new Date(tempoDecorridoEmsegundos * 1000)
  const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
  tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostraTempo()