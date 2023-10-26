/* --------------- Spin Wheel  --------------------- */
const spinWheel = document.getElementById("spinWheel");

/* --------------- Size Of Each Piece  --------------------- */
const size = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
/* --------------- Background Colors  --------------------- */

var spinColors = [
    "#D35400",
    "#7D3C98",
    "#2E86C1",
    "#138D75",
    "#F1C40F",
    "#D35400",
    "#7D3C98",
    "#2E86C1",
    "#138D75",
    "#F1C40F"
];
/* --------------- Chart --------------------- */
let spinChart = new Chart(spinWheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [
            {
                backgroundColor: spinColors,
                data: size,
            },
        ],
    },
    options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            tooltip: false,
            legend: {
                display: false,
            },
            datalabels: {
                rotation: 90,
                color: "#ffffff",
                formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                font: { size: 26, family: 'Poppins-SemiBold' },
            },
        },
    },
});

/* --------------- Spinning Code --------------------- */
let count = 0;
let resultValue = 101;
let randomDegree = 0;
let rotationInterval;
const wheelMusic = new Audio('../assets/Audio/wheel_music.wav');
function spin() {
    if (randomDegree > 0) {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
        count = 0;
        resultValue = 101;
    }
    rotationInterval = window.setInterval(() => {
        spinChart.options.rotation = spinChart.options.rotation + resultValue;
        spinChart.update();
        if (spinChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            spinChart.options.rotation = 0;
        } else if (count > 15 && spinChart.options.rotation == randomDegree) {
            clearInterval(rotationInterval);
            wheelMusic.pause();
            startTimer();
            count = 0;
            resultValue = 101;
        }
    }, 10);
}

/* --------------- Return the degree according to win number on which wheel is supposed to stop  --------------------- */
function getWinnerDegree() {
    // 0 = 70, 1 = 35, 9 = 105, 8 = 145, 7 = 180, 6 = 215, 5 = 250, 4 = 285, 3 = 325, 2 = 359;
    let winner = 0;
    let degree = 0;
    switch (winner) {
        case 0:
            degree = 70;
            break;
        case 1:
            degree = 35;
            break;
        case 2:
            degree = 359;
            break;
        case 3:
            degree = 325;
            break;
        case 4:
            degree = 285;
            break;
        case 5:
            degree = 250;
            break;
        case 6:
            degree = 215;
            break;
        case 7:
            degree = 180;
            break;
        case 8:
            degree = 145;
            break;
        case 9:
            degree = 105;
            break;
    }

    randomDegree = degree;
    spin();
}

/* --------------- On load function  --------------------- */
window.onload = () => {
    spinChart.update();
    startTimer();
    getLastWinners();
}

/* ---------------- last winners ----------------------- */
function getLastWinners() {
    const lastWinners = [1, 1, 2, 4, 6, 7, 9];
    let htmlContent = '';
    lastWinners.forEach(winner => {
        htmlContent += `<div class='last-win'>${winner}</div>`;
    });
    document.getElementById('last-winners').innerHTML = htmlContent;
    styleLastWin(lastWinners);
}

function styleLastWin(lastWinners) {
    const winElements = document.getElementsByClassName('last-win');
    for (let index = 0; index < winElements.length; index++) {
        const element = winElements[index];
        element.style.backgroundColor = spinColors[lastWinners[index]];
    }
}

/* ---------------- Timers ----------------------- */
function startTimer() {
    var count = 10, timer = setInterval(function () {
        document.getElementById('timer').innerText = count--;
        if (count < 0) {
            wheelMusic.currentTime = 0;
            wheelMusic.play();
            clearInterval(timer);
            spin();
            getWinnerDegree();
        }
    }, 1000);
}