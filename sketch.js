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
let enemySpawnMarkerX;
let enemySpawnMarkerY;
let enemySpawnMarkerStartTime;
let enemySpawnMarkerHits;

let bulletImage;
let bulletX;
let bulletY;
let bulletHit;

function preload() {
    playerImage = loadImage("gazou/IMG_1116.JPG");
    enemyImage = loadImage("gazou/IMG_1115.JPG");
    bulletImage = loadImage("gazou/ball02_white.png");
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
    enemySpawnMarkerX = null;
    enemySpawnMarkerY = 0;
    enemySpawnMarkerStartTime = 0;
    enemySpawnMarkerHits = 0;
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
         text("黄色いマーカーから敵がでてくる",width / 2, height / 2 +20)
        text("黄色いマーカーに二発あてると２点、敵にあてると１点", width / 2, height / 2 + 40);
       
    }
    if (mode == 1) {
        //自機を動かす
        if (keyIsDown(LEFT_ARROW)) {
            playerX -= 15;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            playerX += 15;
        }
        //次の敵の出現場所を表示して、1秒後に敵を出現させる
        if (enemySpawnMarkerX === null && millis() - enemyTime > 500) {
            enemySpawnMarkerX = random(0, width);
            enemySpawnMarkerY = 0;
            enemySpawnMarkerStartTime = millis();
            enemySpawnMarkerHits = 0;
        }
        
        //敵出現マーカーを玉で壊す（2発必要）
        if (enemySpawnMarkerX !== null) {
            for (let j = 0; j < bulletX.length; j++) {
                if (!bulletHit[j]) {
                    let dx = enemySpawnMarkerX - bulletX[j];
                    let dy = enemySpawnMarkerY - bulletY[j];
                    if (sqrt(dx * dx + dy * dy) < 30) {
                        bulletHit[j] = true;
                        enemySpawnMarkerHits++;
                        if (enemySpawnMarkerHits >= 2) {
                            enemySpawnMarkerX = null;
                            enemyTime = millis();
                            score += 2;
                        }
                        break;
                    }
                }
            }
        }

        if (enemySpawnMarkerX !== null && millis() - enemySpawnMarkerStartTime > 1200) {
            enemyX.push(enemySpawnMarkerX);
            enemyY.push(0);
            enemyHit.push(false);
            enemySpawnMarkerX = null;
            enemyTime = millis();
        }

        //敵を動かす
        for (let i = 0; i < enemyY.length; i++) {
            enemyY[i] += 70;
        }

        //球を動かす
        for (let i = 0; i < bulletY.length; i++) {
            bulletY[i] -= 20;
        }

    
        //敵と玉
        for (let i = 0; i < enemyX.length; i++) {
            for (let j = 0; j < bulletX.length; j++) {
                if(!enemyHit[i] &&
                   !bulletHit[j] &&
                   enemyX[i] - 45 < bulletX[j] &&
                   bulletX[j] < enemyX[i] + 45 &&
                   enemyY[i] - 35 < bulletY[j] &&
                   bulletY[j] < enemyY[i] + 35) {
                enemyHit[i] = true;
                bulletHit[j] = true;
                score++;
                }
            }
        }

        //出現予定地点を表示
        if (enemySpawnMarkerX !== null) {
            fill(255, 255, 0);
            noStroke();
            circle(enemySpawnMarkerX, enemySpawnMarkerY, 60);
        }

        //自機を表示
        imageMode(CENTER);
        image(playerImage, playerX, playerY, 80, 70);

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
        let timeLimit = 30 - floor((millis() - gameTime) / 1000);
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