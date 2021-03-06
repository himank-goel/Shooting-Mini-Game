const startButton = document.querySelector('.start');
const levels = document.querySelectorAll('[data-value]');
var canvasWidth = 600;
var canvasHeight = 400;
var imgPlayer;
var imgBullet;
var imgEnemy;
var pew;
var gameOver;
var hit;
var score = 0;
var bulletTime = true;
var reloadPage = false;
var startGame = false;
let levelValue = 0.05

function getValue() {
	levelValue = parseFloat(this.dataset.value);
}

var player = {
	x : 280,
	width : 30,
	y : 370,
	height: 30,
	draw : function(){
		image(imgPlayer, this.x, this.y, this.width, this.height);
	}
}

var bullets = [];
function Bullet(I){
	I.active = true;
	I.x = player.x + player.width/2;
	I.y = player.y +  player.height/2;
	I.width = 3;
	I.height = 6;
	I.yVelocity = 5;
	I.inBounds = function(){
		return I.x >= 0 && I.y >= 0 && I.x < canvasWidth - I.width && I.y < canvasHeight - I.height;
	}
	I.update = function(){
		I.active  = I.active && I.inBounds();
		I.y -= I.yVelocity;
	}
	I.draw = function(){
		image(imgBullet, I.x, I.y, I.width, I.height);
	}
	return I;
}

var enemies  = [];
function Enemy(I){
	I.active = true;
	I.x = Math.random() * canvasWidth;
	I.y = 0;
	I.width = 30;
	I.height = 30;
	I.yVelocity = 2;
	I.inBounds = function(){
		return I.x >= 0 && I.y >= 0 && I.x < canvasWidth - I.width && I.y < canvasHeight - I.height;
	}
	I.draw = function(){
		image(imgEnemy, I.x, I.y, I.width, I.height);
	}
	I.update= function(){
		I.active = I.active && I.inBounds();
		I.y += I.yVelocity;
	}
	return I;
}

function collision(enemy, bullet){
	return bullet.x + bullet.width >= enemy.x && bullet.x < enemy.x + enemy.width &&
			bullet.y + bullet.height >= enemy.y && bullet.y < enemy.y + enemy.height;
}

function preload(){
	pew = loadSound('pew.wav');
	gameOver = loadSound('gameover.wav');
	hit = loadSound('hit.wav');
	imgPlayer = loadImage("player.png");
	imgBullet = loadImage("bullet.png");
	imgEnemy = loadImage("enemy.png");
}

function setup(){
	createCanvas(canvasWidth, canvasHeight);
	noCursor();
}
function draw(){
	fill(255);
	clear();
	background("#000");
	text("score : " + score, 10, 10);
	if(startGame){
		if(keyIsDown(LEFT_ARROW)){
			if(player.x-5 >= 0)
				player.x -= 5;
			else
				player.x = 0;
		}
		if(keyIsDown(RIGHT_ARROW)){
			if(player.x + 5 <= canvasWidth-player.width)
				player.x += 5;
			else
				player.x = canvasWidth - player.width;
		}
		if(bulletTime){
			if(keyIsDown(32)){
				pew.play();
				bullets.push(Bullet({}));
			}
			bulletTime = false;
			setTimeout(() => bulletTime = true,100);
		}
		player.draw();


		bullets = bullets.filter(function(bullet){ 
			return bullet.active;
		});
		bullets.forEach(function(bullet){
			bullet.update();
			bullet.draw();
		});

		if(Math.random()<`${levelValue}`){
			enemies.push(Enemy({}));
		}
		enemies = enemies.filter(function(enemy){
			return enemy.active;
		});
		enemies.forEach(function(enemy){
			enemy.update();
			enemy.draw();
		});

		bullets.forEach(function(bullet){
			enemies.forEach(function(enemy){
				if(collision(enemy, bullet)){
					hit.play();
					enemy.active = false;
					bullet.active = false;
					score++;
				}
			});
		});

		enemies.forEach(function(enemy){
			if(collision(enemy, player)){
				enemy.active = false;
				noLoop();
				gameOver.play();
				textSize(40);
				text("GAME OVER", 180, 200);
				startGame = false;
				reloadPage = true;
			}
		});
	}
}

levels.forEach(level => level.addEventListener('click', getValue));

startButton.addEventListener('click', () => {
	startGame = true;
	startButton.textContent = "Retry !!";
	if(reloadPage){
		location.reload(true);
	}
})

