// Seleção dos elementos
const musicControl = document.getElementById('musicControl'),
bgMusic = document.getElementById('bgMusic'),
clickSound = document.getElementById('clickSound'),
startBtn = document.getElementById('startBtn'),
seasonControl = document.getElementById('seasonControl'),
body = document.body

//Configuração das estações
const seasons = [
    {name: 'summer', icon: 'fa-sun', bgClass: 'summer-bg'},
    {name: 'spring', icon: 'fa-seedling', bgClass: 'spring-bg'},
    {name: 'fall', icon: 'fa-leaf', bgClass: 'fall-bg'},
    {name: 'winter', icon: 'fa-snowflake', bgClass: 'winter-bg'},
]

//armazena a estação atual, começa no verão/summer
let currentSeasonIndex = 0 

//Configuração para o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    bgMusic.volume = 0.3

    bgMusic.play()

    applySeason(currentSeasonIndex)
})

// Função para aplicar as trocas visuais das estações
function applySeason(index) {
     body.className = ''

     body.classList.add(seasons[index].bgClass)

     seasonControl.innerHTML = `<i class="fas ${seasons[index].icon}"></i>`
}

//Evento para controle de música - ligar/desligar
musicControl.addEventListener('click', () => {
    if(bgMusic.paused) {
        bgMusic.play()
        musicControl.innerHTML = '<i class="fas fa-music"></i>'
    } else {
        bgMusic.pause()
        musicControl.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }
})


//Inicia o quiz
startBtn.addEventListener('click', (e) => {
    e.preventDefault()
    playClickSound()

    localStorage.setItem('season', seasons[currentSeasonIndex].name)
    localStorage.setItem('musicTime', bgMusic.currentTime);
    localStorage.setItem('musicStatus', bgMusic.paused ? 'off' : 'on');

    setTimeout(() => {
        window.location.href = 'src/quiz/index.html'
    },1000)
})


// Controle das estações 
seasonControl.addEventListener('click', () => {
    //garante q volte pra 0 depois da ultima estação
    currentSeasonIndex = (currentSeasonIndex + 1) % seasons.length
    applySeason(currentSeasonIndex)
    playClickSound()
})

//Função para tocar o som de clique do mouse 
function playClickSound() {
    clickSound.currentTime = 0 // reinicia o som
    clickSound.play()
}


