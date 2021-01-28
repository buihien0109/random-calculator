// Truy cập
let primary = document.getElementById('primary-number');
let secondary = document.getElementById('secondary-number');
let operatorEle = document.getElementById('operator');

let timeEle = document.querySelector('.time');
let scoreEle = document.querySelector('.score');

let guessEle = document.getElementById('guess');
let button = document.getElementById('btn');

let startGame = document.getElementById('start-game');
let game = document.getElementById('game');
let endGame = document.getElementById('end-game');

let btnStartGame = document.getElementById('btn-start-game');
let nameEle = document.getElementById('user-name');
let avatarEle = document.getElementById('user-avatar');

let btnPlayAgain = document.querySelector('.btn-play-again');
let btnExitGame = document.querySelector('.btn-exit-game');
let message = document.querySelector('.message');

// Định nghĩa biến
let firstNumber;
let secondNumber;
let total;

let score;
let time;
let interval;

let operators = ['+', '-', '*'];

let ranking = [];

let name;
let avatar;

// Xử lý khi bắt đầu game
btnStartGame.addEventListener('click', function () {
    name = nameEle.value;
    avatar = avatarEle.value;

    if (name == '' || avatar == '') {
        alert('Vui lòng nhập đủ thông tin');
        return;
    }

    startGame.style.display = 'none';
    game.style.display = 'flex';

    getFromLocalStorage();
    init();
});

// Xử lý khi chơi lại game
btnPlayAgain.addEventListener('click', function () {
    endGame.style.display = 'none';
    game.style.display = 'flex';
    init();
});

// Xử lý khi thoát game
btnExitGame.addEventListener('click', function () {
    window.location.reload();
});

// Random số và hiển thị
function randomNumber() {
    firstNumber = Math.floor(Math.random() * 10);
    secondNumber = Math.floor(Math.random() * 10);
    operator = operators[Math.floor(Math.random() * operators.length)];

    total = eval(`${firstNumber} ${operator} ${secondNumber}`);

    // if (operator == '/') {
    //     total.toFixed(2);
    // }

    primary.innerText = firstNumber;
    secondary.innerText = secondNumber;
    operatorEle.innerText = operator;
}

// Khởi tạo game
function init() {
    score = 0;
    time = 20;

    timeEle.innerText = time;
    scoreEle.innerText = score;
    guessEle.value = '';

    randomNumber();
    getFromLocalStorage();
    interval = setInterval(countDown, 1000);
}

// Cập nhật điểm người chơi
function updateScore() {
    score++;
    scoreEle.innerText = score;
}

// Đếm ngược thời gian
function countDown() {
    time--;
    if (time < 10) {
        timeEle.innerText = `0${time}`;
    } else {
        timeEle.innerText = time;
    }
    if (time == 0) {
        clearInterval(interval);
        // Thêm thông tin người chơi vào bảng xếp hạng
        addInfoPlayerToRanking();
        // Hiển thị màn end game
        displayEndGame();
    }
}

// Hiển thị end game
function displayEndGame() {
    game.style.display = 'none';
    endGame.style.display = 'flex';

    message.innerText = `Điểm của bạn là: ${score}`;
}

// Xử lý khi người chơi kiểm tra kết quá
guessEle.addEventListener('keydown', function (e) {
    let resultValue = Number(e.target.value);
    if (e.keyCode == 13) {
        if (resultValue === total) {
            updateScore();
            randomNumber();
            guessEle.value = '';
        } else {
            return;
        }
    }
});

// Render bảng xếp hạng
function renderRanking(arr) {
    // Sắp xếp mảng giảm dần
    let arrSort = arr.sort(function (a, b) {
        return b.score - a.score;
    });

    // Clear dữ liệu
    let listPlayer = document.querySelector('.list-player');
    listPlayer.innerHTML = '';

    // Render dữ liệu
    for (let i = 0; i < arrSort.length; i++) {
        const r = arrSort[i];
        listPlayer.innerHTML += `
            <div class="list-item">
                <div class="list-rank">${i + 1}</div>
                <div class="list-info">
                    <img src="${r.avatar}" alt="${r.name}">
                    <div class="info">
                        <span class="name">${r.name}</span>
                    </div>
                </div>
                <div class="list-score">
                    <span class="top-item-icon"><i class="fa fa-star" aria-hidden="true"></i></span>
                    <span class="top-item-point">${r.score}</span>
                </div>
            </div>
        `;
    }
}

// Thêm người chơi vào bảng xếp hạng
function addInfoPlayerToRanking() {
    // Tạo object chứa thông tin người chơi
    let user = {
        name: name,
        avatar: avatar,
        score: score,
    };

    // Thêm người chơi vào mảng ranking
    ranking.push(user);

    // Lưu dữ liệu xếp hạng người chơi
    addToLocalStorage(ranking);
}

// Lưu dữ liệu đến localStorage
function addToLocalStorage(ranking) {
    localStorage.setItem('ranking', JSON.stringify(ranking));
    renderRanking(ranking);
}

// Lấy thông tin từ localStorage để hiển thị bảng xếp hạng
function getFromLocalStorage() {
    const rankingLocalStorage = localStorage.getItem('ranking');
    if (rankingLocalStorage) {
        ranking = JSON.parse(rankingLocalStorage);
    } else {
        ranking = [];
    }
    renderRanking(ranking);
}
