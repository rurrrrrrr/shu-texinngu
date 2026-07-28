//変数の定義
let mode = 0;
let gameTime;
let score;

let playerImage;
let playerX;
let playerY;

let enemyImage;
let enemyX;
let enemyY;
let enemyHit;
let enemyTime;

let bulletImage;
let bulletX;
let bulletY;
let bulletHit;

function preload() {
    playerImage = loadImage("gazou/player.png");
    enemyImage = loadImage("gazou/enemy.png");
    bulletImage = loadImage("gazou/bullet.png");
}

function setup() {
    createCanvas(500, 500);

    score = 0;
    playerX = width / 2;
    playerY = height - 50;
    enemyX = [];
    enemyY = [];
    enemyHit = [];
    enemyTime = 0;
    bulletX = [];
    bulletY = [];
    bulletHit = [];

}

function draw() {
    background(0);

    if (mode == 0) {
        //スタート
        fill("#FFFFFF");
        textAlign(CENTER);
        text("クリックしてスタート", width / 2,height / 2);
    }
    if (mode == 1) {
        //自機を動かす
        if (keyIsDown(LEFT_ARROW)) {
            playerX -= 5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            playerX += 5;
        }
        //敵を増やす
        if (millis() - enemyTime > 1000) {
            enemyTime = millis();
            enemyX.push(random(0, width));
            enemyY.push(0);
            enemyHit.push(false);
        }
        //敵を動かす
        for (let i = 0; i < enemyY.length; i++) {
            enemyY[i] += 5;
        }
        //球を動かす
        for (let i = 0; i < bulletY.length; i++) {
            bulletY[i] -= 10;
        }
        //敵と玉
        for (let i = 0; i < enemyX.length; i++) {
            for (let j = 0; j < bulletX.length; j++) {
                if(!enemyHit[i] &&
                   !bulletHit[j] &&
                   enemyX[i] - 30 < bulletX[j] &&
                   bulletX[j] < enemyX[i] + 30 &&
                   enemyY[i] - 20 < bulletY[j] &&
                   bulletY[j] < enemyY[i] + 20) {
                enemyHit[i] = true;
                bulletHit[j] = true;
                score++;
                }
            }
        }

        //自機を表示
        imageMode(CENTER);
        image(playerImage, playerX, playerY, 50, 50);
        //敵を表示
        for (let i = 0; i < enemyX.length; i++) {
            if (enemyHit[i] == false) {
                image(enemyImage, enemyX[i], enemyY[i], 50, 50);
            }
        }
        //球を表示
        for (let i = 0; i < bulletX.length; i++) {
            if (bulletHit[i] == false) {
                image(bulletImage, bulletX[i], bulletY[i], 20, 20);
            }
        }
        //スコア
        fill("#FFFFFF");
        textAlign(LEFT);
        text("SCORE: " + score,10,20);

        //時間
        let timeLimit = 10 - floor((millis() - gameTime) / 1000);
        textAlign(RIGHT);
        text("TIME: " + timeLimit, width - 10,20);
        if(timeLimit <= 0) {
            mode = 2;
        }
    }
    if (mode == 2) {
        textAlign(CENTER);
        textSize(18);
        text("SCORE: " + score, width / 2, height / 2 - 50);
        textSize(12);
        text("クリックしてスタート画面に戻る", width / 2, height /2);
    }
}

function keyPressed() {
    //球を打つ
    if (key == " " ) {
        bulletX.push(playerX);
        bulletY.push(height - 70);
        bulletHit.push(false);
    }
}
function mousePressed() {
    if (mode == 0) {
        setup();
        gameTime = millis();

        mode = 1;
    }
    if (mode == 2) {
        mode = 0;
    }
}