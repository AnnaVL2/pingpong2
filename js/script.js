const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

/* objects*/
//net
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "white"
};

const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "Orange",
    score: 0
};

// for "rectangles" the axis starts from its top left corner
const ai = {
    x: canvas.width - (paddleWidth +10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "Orange",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#00FF7F",
};
/* object declaration ends */



/* drawing functions */
function drawNet(){
    //set the color of the net
    ctx.fillStyle = net.color;

    // syntax --> fillRect(x,y,width,height)
    ctx.fillRect(net.x, net.y, net.width, net.height);
}
function drawScore(x,y,score){
    ctx.fillStyle = "#00FF7F";
    ctx.font = '30px Courier';

    // syntax --> fillText(text,x,y)
    ctx.fillText(score,x,y);
}

function drawPaddle(x,y,width,height,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}

function drawBall(x,y,radius,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    // syntax --> arc(x, y, radius, startAngle, endAngle, antiClockwise_or_not)
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

/* drawing functions ends */


/* moving paddles*/
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

// gets activated when we press we press down a key
function keyDownHandler(event){
    switch (event.keyCode){
        case 38:
            // set upArrowPressed = true
            upArrowPressed = true;
            break;
            // "down arrow" key
        case 40:
            downArrowPressed = true;
            break;
    }
}

// gets activated when we release the key
function keyUpHandler(event){
    switch (event.keyCode){
        // "up arrow" key
        case 38:
            // set upArrowPressed = false
            upArrowPressed = false;
            break;
        // "down arrow" key
        case 40:
            downArrowPressed = false;
            break;
    }
}
/* moving paddles section end */

function reset(){
    // reset ball's value to older values
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    // changes the direction of ball
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

// collision Detect function
function collisionDetect (player, ball){
    // returns true or false
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

function update(){
    // move the paddle
    if (upArrowPressed && user.y > 0) {
        user.y -=8;
    } else if (downArrowPressed && (user.y < canvas.height - user.height)){
        user.y +=8;
    }

    // check if ball hits top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0){
        // play wallHitSound

        ball.velocityY = -ball.velocityY;
    }

    // if ball hit on right wall
    if(ball.x + ball.radius >= canvas.width){
        // play scoreSound

        // then user scored 1 point
        user.score += 1;
        reset();
    }

    // if ball hit on left wall
    if (ball.x - ball.radius <= 0){
        // play scoreSound

        // then ai scored 1 point
        ai.score += 1;
        reset();
    }

    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // ai paddle movement

    // collision detection on paddles
    
    let player = (ball.x < canvas.width / 2) ? user : ai;

    if (collisionDetect(player, ball)){
        // play hitSound

        // default angle is 0deg in Radian
        let angle = 0;

        // if ball hit the top of paddle
        if (ball.y < (player.y + player.height / 2)){
            // then -1 * Math.PI / 4 = -45deg
            angle = -1 * Math.PI / 4;
        } else if (ball.y > (player.y + player.height / 2)){
            // if it hit the bottom of paddle
            // then angle will be Math.PI / 4 = 45deg
            angle = 1 * Math.PI / 4;
        }

        /* change velocity of ball according to on which paddle the ball hitted */
        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // increase ball speed
        ball.speed += 0.2;
    }
}

function render(){
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(0,0, canvas.width, canvas.height);
drawNet();
//draw user score
drawScore(canvas.width / 4, canvas.height / 6, user.score);

//draw ai score
drawScore(3*canvas.width / 4, canvas.height / 6, ai.score);

//draw user paddle
drawPaddle(user.x, user.y, user.width, user.height, user.color);

//draw ai paddle
drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);

//draw ball
drawBall(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop(){
    update();
    render();
}

// calls gameLoop() function 60 times per second
setInterval(gameLoop, 1000 / 60);
