/**
 * =============================================
 *              ELEMENTOS DO HTML
 * =============================================
 */
const perguntaElemento = document.querySelector(".pergunta");
const respostasElemento = document.querySelector(".respostas");
const progressoElemento = document.querySelector(".progresso");
const textoFinal = document.querySelector(".fim span");
const conteudo = document.querySelector(".conteudo");
const conteudoFinal = document.querySelector(".fim");
const somMoeda = document.getElementById('som-moeda');
const somAcerto = document.getElementById('som-acerto');
const somErro = document.getElementById('som-erro');
const botaoSom = document.getElementById('botao-som');
const musicaFundo = document.getElementById('musica-fundo');

/**
 * =============================================
 *          VARIÁVEIS DE CONTROLE DO JOGO
 * =============================================
 */
let indiceAtual = 0;     // Índice da pergunta atual
let acertos = 0;         // Contador de respostas corretas
let ouro = 0;            // Quantidade de ouro acumulado
let somLigado = true;    // Estado do áudio

// Mapeamento de temas (inglês -> português)
const temas = {
    'summer': 'verao',
    'spring': 'primavera',
    'fall': 'outono',
    'winter': 'inverno'
};

/**
 * =============================================
 *         INICIALIZAÇÃO DO QUIZ
 * =============================================
 */
document.addEventListener('DOMContentLoaded', function() {

    const quizContainer = document.querySelector('.questionario');
    quizContainer.classList.add('fade-in'); 
    
    // Carrega o estado do tema e música salvos no localStorage
    const temaSalvo = localStorage.getItem('season') || 'fall';
    const musicaStatus = localStorage.getItem('musicStatus') || 'on'; // 'on' ou 'off'
    const musicaTempo = localStorage.getItem('musicTime') || 0; // Tempo salvo

    // Aplica o tema
    document.body.classList.add(temas[temaSalvo]);

    // Aplica o estado da música
    musicaFundo.currentTime = musicaTempo; // Define o tempo da música
    if (musicaStatus === 'on') {
        musicaFundo.play(); // Reproduz a música se estava ligada
    } else {
        musicaFundo.pause(); // Pausa a música se estava desligada
    }

    // Inicializa o restante do quiz
    carregarPergunta();
});

function configurarAudio() {
    // Tenta iniciar a música automaticamente (pode não funcionar em alguns navegadores)
    musicaFundo.volume = 0.3;

    // Configura o botão de som
    botaoSom.addEventListener('click', function() {
        somLigado = !somLigado;
        
        if (somLigado) {
            musicaFundo.play();
            botaoSom.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            musicaFundo.pause();
            botaoSom.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}

/**
 * =============================================
 *         FUNÇÃO PRINCIPAL - CARREGAR PERGUNTA
 * =============================================
 */
function carregarPergunta() {
    progressoElemento.innerHTML = `${indiceAtual + 1}/${perguntas.length}`;
    const perguntaAtual = perguntas[indiceAtual];
    perguntaElemento.innerHTML = perguntaAtual.pergunta;
    respostasElemento.innerHTML = "";

    perguntaAtual.respostas.forEach(resposta => {
        const botao = document.createElement("button");
        botao.classList.add("botao-resposta");
        botao.innerText = resposta.opcao;
        botao.onclick = () => processarResposta(resposta, botao);
        respostasElemento.appendChild(botao);
    });
}

/**
 * =============================================
 *           FUNÇÃO PARA PROCESSAR RESPOSTA
 * =============================================
 */
function processarResposta(resposta, botao) {
    // Desabilita todos os botões durante o feedback
    document.querySelectorAll('.botao-resposta').forEach(btn => {
        btn.style.pointerEvents = 'none';
    });

    if (resposta.correta) {
        acertos++;
        botao.classList.add('resposta-certa');
        somAcerto.currentTime = 0;
        somAcerto.play();
        ouro += 10;
        atualizarOuro();
    } else {
        botao.classList.add('resposta-errada');
        somErro.currentTime = 0;
        somErro.play();
    }

    setTimeout(() => {
        indiceAtual++;
        indiceAtual < perguntas.length ? carregarPergunta() : finalizarJogo();
    }, 1000);
}

/**
 * =============================================
 *         FUNÇÃO PARA ATUALIZAR CONTADOR DE OURO
 * =============================================
 */
function atualizarOuro() {
    const ouroElemento = document.querySelector('.ouro-contador');
    const iconeOuro = document.querySelector('.ouro-icone');
    
    ouroElemento.textContent = ouro;
    iconeOuro.classList.add('ganho-ouro');
    somMoeda.currentTime = 0;
    somMoeda.play();
    
    setTimeout(() => iconeOuro.classList.remove('ganho-ouro'), 700);
}

/**
 * =============================================
 *             FUNÇÃO FINALIZAR JOGO
 * =============================================
 */
function finalizarJogo() {
    const frases = [
        { min: 0, max: 3, frase: "Você pode fazer melhor! Continue praticando!" },
        { min: 4, max: 7, frase: "Bom trabalho! Você está no caminho certo!" },
        { min: 8, max: 10, frase: "Incrível! Você é um verdadeiro expert!" }
    ];
    
    const frase = frases.find(f => acertos >= f.min && acertos <= f.max)?.frase || "Quiz concluído!";
    
    document.getElementById('frase-resultado').textContent = frase;
    document.getElementById('acertos-total').textContent = acertos;
    document.getElementById('total-perguntas').textContent = perguntas.length;
    document.getElementById('ouro-total').textContent = ouro;
    
    conteudo.style.display = 'none';
    conteudoFinal.style.display = 'flex';
    
    document.querySelector('.botao-reiniciar').onclick = reiniciarQuiz;
    document.querySelector('.botao-inicio').onclick = () => window.location.href = './index.html';
}

/**
 * =============================================
 *             FUNÇÃO REINICIAR QUIZ
 * =============================================
 */
function reiniciarQuiz() {
    indiceAtual = 0;
    acertos = 0;
    ouro = 0;
    document.querySelector('.ouro-contador').textContent = '0';
    conteudoFinal.style.display = 'none';
    conteudo.style.display = 'block';
    carregarPergunta();
}
