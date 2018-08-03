const sectionWidth = 200;
const $map = $('.map');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;
const $windowWidth = parseInt($('.window').css('width'));
const $playerWidth = parseInt($('#player').css('width'));


//***************MAP GENERATOR***************

// (function () {

const obstacleWidth = 80;
const obstacleMinHeight = 60;
const randomizer = .4;
let mapObjectTable;


mapObjectTable = Array
    .from({length: $numberOfSections}, (obstacle, index) => {
        if (index !== 0) {
            return {
                position: index * sectionWidth + Math.floor(Math.random() * (sectionWidth - obstacleWidth)),
                height: Math.floor((Math.random() * 2 + 1)) * obstacleMinHeight
            }
        }
    })
    .filter(obstacle => {
        return (obstacle !== undefined && Math.random() > randomizer)
    })

mapObjectTable.forEach(obstacle => {
    $map
        .append($('<div>')
            .addClass('obstacle')
            .css('left', obstacle.position)
            .css('height', obstacle.height)
        )
});

// })();

// player.style.left = playerPositionX + 'px';

//***************PLAYER***************

// (function () {

const player = document.querySelector('#player');
const moveRight = 'ArrowRight';
const moveLeft = 'ArrowLeft';
const jump = 'ArrowUp';
const fall = 'jumpReleased'

let playerPositionX = 0;
let playerPositionY = 0;
let playerSpeedX = 0;
let playerSpeedY = 0;
let playerAccelerationX = 0.0005;
let playerAccelerationY = 0.0015;
let keyPressed = '';
let keyPressedJump = '';
let time = Date.now();
let collisionHeight = 0;
let stillFalling = false;
let obstacleCollision = false;

update();

window.addEventListener('keydown', function (event) {
    if (event.code === moveRight || event.code === moveLeft) {
        event.preventDefault();
        keyPressed = event.code;
    }
    if (event.code === jump) {
        event.preventDefault();
        keyPressedJump = event.code;
    }

});

window.addEventListener('keyup', function (event) {
    if (event.code === moveRight || event.code === moveLeft) {
        event.preventDefault();
        keyPressed = '';
    }
    if (event.code === jump) {
        event.preventDefault();
        keyPressedJump = fall;
    }
});

function horizontalCollision(obstacle) {
    return (
        ((playerPositionX + $playerWidth) > obstacle.position)
        && (playerPositionX < obstacle.position + obstacleWidth)
    )
}

function verticalCollision(obstacle) {
    return (
        (playerPositionY < obstacle.height)
    )
}

function collision(obstacle) {
    collisionHeight = 0;
    if (
        ((playerPositionX + $playerWidth) > obstacle.position)
        && (playerPositionX < obstacle.position + obstacleWidth)
        && (playerPositionY < obstacle.height)
    ) {
        collisionHeight = obstacle.height
    }
    return (
        ((playerPositionX + $playerWidth) > obstacle.position)
        && (playerPositionX < obstacle.position + obstacleWidth)
        && (playerPositionY < obstacle.height)
    )
}



/*function moveUpDown(dTime) {



    if (playerSpeedY < .5) {
        playerSpeedY = playerSpeedY + playerAccelerationY * dTime;
    } else if (playerSpeedY >= .5) {
        playerSpeedY = playerSpeedY + playerAccelerationY * dTime;
    }



    playerPositionY = playerPositionY + playerSpeedY * dTime;
}*/

function moveFwd(dTime) {
    playerSpeedX = Math.min(Math.max(0, playerSpeedX + playerAccelerationX * dTime), 0.4);
    playerPositionX +=  playerSpeedX * dTime;
}

function moveBwd(dTime) {
    playerSpeedX = Math.max(Math.min(0, playerSpeedX - playerAccelerationX * dTime), -0.4);
    playerPositionX +=  playerSpeedX * dTime;
}

function moveUp(dTime) {
    playerSpeedY = playerSpeedY + playerAccelerationY * dTime;
}

function fallDown(dTime) {
    playerSpeedY = playerSpeedY - playerAccelerationY * dTime;
}

function update() {
    const dTime = Date.now() - time;
    time = Date.now();
    oldPlayerPositionX = playerPositionX;
    oldPlayerPositionY = playerPositionY;
    obstacleCollision = false;

    obstacleCollision = mapObjectTable.some(collision);

    switch (keyPressed) {

        case moveRight:
            if (!obstacleCollision) {
                moveFwd(dTime);
            }
            if (playerPositionY > collisionHeight && keyPressedJump !== jump) {
                stillFalling = true;
                keyPressedJump = fall;
            }
            break;

        case moveLeft:
            if (!obstacleCollision) {
                moveBwd(dTime);
            }
            if (playerPositionY > collisionHeight && keyPressedJump !== jump) {
                stillFalling = true;
                keyPressedJump = fall;
            }

            break;

        default:
            playerSpeedX = 0;
            break;
    }

    switch (keyPressedJump) {

        case jump:
            (playerSpeedY < .5 && !stillFalling) ? moveUp(dTime) : (keyPressedJump = fall, stillFalling = true, fallDown(dTime));
                // : (stillFalling = false, playerPositionY = collisionHeight, keyPressedJump = '');
            break;

        case fall:
            (stillFalling === true && playerPositionY > collisionHeight)
                ? fallDown(dTime)
                : (keyPressedJump = '', stillFalling = false, playerPositionY = collisionHeight, playerSpeedY = 0);
            break;

        default:
            playerSpeedY = 0;
            break;

    }

    playerPositionY = playerPositionY + playerSpeedY * dTime;


    console.log('speed x', playerSpeedX, 'speed y', playerSpeedY, 'jumpKey', keyPressedJump, 'collisionHeight', collisionHeight, 'collision', obstacleCollision);

    player.style.left = playerPositionX + 'px';
    player.style.bottom = playerPositionY + 'px';
    requestAnimationFrame(update);

}
/*

function update() {
    const dTime = Date.now() - time;
    time = Date.now();
    oldPlayerPositionX = playerPositionX;
    oldPlayerPositionY = playerPositionY;

    switch (keyPressed) {

        case moveRight:
            if (!mapObjectTable.some(horizontalCollision)) {
                moveFwd(dTime);
            } else {
                playerPositionX = oldPlayerPositionX;
            }
            console.log(playerPositionX);
            break;

        case moveLeft:
            console.log('zxcz');
            if (!mapObjectTable.some(horizontalCollision)) {
                moveBwd(dTime);
            } else {
                playerPositionX = oldPlayerPositionX;
            }
            break;

        default:
            playerSpeedX = 0;
            break;
    }

    /!*switch (keyPressedJump) {

        case jump:
            moveUpDown(dTime);
            break;

        case fall:
            moveUpDown(dTime);
            break;

        default:
            playerSpeedY = 0;
            break;

    }*!/

    player.style.left = playerPositionX + 'px';
    player.style.bottom = playerPositionY + 'px';
    requestAnimationFrame(update);

}
*/
















/*
update();

function checkCollisionHorizontal(obstacle, index) {
    /!*
        collisionHeight = 0;
        if (
            ((playerPositionX + $playerWidth) > obstacle.position)
            && (playerPositionX < (obstacle.position + obstacleWidth))
        ) {
            collisionHeight = mapObjectTable[index].height;
        }*!/


    if (keyPressed === 'ArrowRight') {
        if (
            ((playerPositionX + $playerWidth) > obstacle.position)
            && (playerPositionX < (obstacle.position + obstacleWidth))
            && (playerPositionY < obstacle.height)
        ) {
            collisionHeight = mapObjectTable[index].height
        }
        return (
            ((playerPositionX + $playerWidth) > obstacle.position)
            && (playerPositionX < (obstacle.position + obstacleWidth))
            && (playerPositionY < obstacle.height)
        );
    }
    if (keyPressed === 'ArrowLeft') {
        if (
            (playerPositionX < (obstacle.position + obstacleWidth))
            && (playerPositionX > obstacle.position)
            && (playerPositionY < obstacle.height)
        ) {
            collisionHeight = mapObjectTable[index].height
        }
        return (
            (playerPositionX < (obstacle.position + obstacleWidth))
            && (playerPositionX > obstacle.position)
            && (playerPositionY < obstacle.height)
        );
    }
    collisionHeight = 0;
}

function fallDown(dTime) {
    if (playerPositionY > collisionHeight) {
        playerSpeedY = playerSpeedY - playerAccelerationY * dTime;
        playerPositionY = playerPositionY + playerSpeedY * dTime;
    }
}


window.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        event.preventDefault();
        keyPressed = event.code;
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        event.preventDefault();
        keyPressed = '';
    }
});

window.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowUp' && jumpKeyPressed !== 'jumpReleased') {
        event.preventDefault();
        jumpKeyPressed = event.code;
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowUp') {
        event.preventDefault();
        jumpKeyPressed = 'jumpReleased';
    }
});

function update() {

    const dTime = Date.now() - time;
    time = Date.now();
    oldPlayerPositionX = playerPositionX;
    oldPlayerPositionY = playerPositionY;

    // playerPositionY += playerSpeedY * dTime;

    mapObjectTable.some(checkCollisionHorizontal) ? playerPositionX = oldPlayerPositionX : playerPositionX += playerSpeedX * dTime;


    switch (keyPressed) {

        case 'ArrowRight':
            playerSpeedX = Math.min(
                Math.max(
                    0,
                    playerSpeedX + playerAccelerationX * dTime
                ),
                0.4
            );
            if (playerPositionY > collisionHeight) {
                jumpKeyPressed = 'jumpReleased';
            }


            break;

        case 'ArrowLeft':
            playerSpeedX = Math.max(
                Math.min(
                    0,
                    playerSpeedX - playerAccelerationX * dTime
                ),
                -0.4
            );


            break;

        default:
            playerSpeedX = 0;

    }


    switch (jumpKeyPressed) {

        case 'ArrowUp':

            if (playerPositionY >= collisionHeight && playerSpeedY <= .65) {
                playerSpeedY = playerSpeedY + playerAccelerationY * dTime;
                playerPositionY = playerPositionY + playerSpeedY * dTime;
            } else {
                jumpKeyPressed = 'jumpReleased';
                playerSpeedY = 0;
            }
            // playerSpeedY = (playerPositionY >= collisionHeight) ? playerSpeedY + playerAccelerationY * dTime : playerPositionY = collisionHeight;
            break;

        case 'jumpReleased':


            if (playerPositionY > collisionHeight) {
                playerSpeedY = playerSpeedY - playerAccelerationY * dTime;
                playerPositionY = playerPositionY + playerSpeedY * dTime;
            }
            if (playerPositionY <= collisionHeight) {
                playerPositionY = collisionHeight;
                jumpKeyPressed = '';
            }



            // playerSpeedY = (playerPositionY > collisionHeight) ? playerSpeedY - playerAccelerationY * dTime : playerPositionY = collisionHeight;
            break;

        default:
            playerSpeedY = 0;


    }



    /!*if (jumpKeyPressed === 'ArrowUp' && playerSpeedY > .5) {
        jumpKeyPressed = 'jumpReleased'
    }

    if (jumpKeyPressed === 'jumpReleased' && playerPositionY === 0) {
        jumpKeyPressed = '';
    }*!/

    const $mapPositionX = Math.abs(parseInt($('.map').css('left')));

    if (playerPositionX > $windowWidth / 2 + $mapPositionX) {
        $('.map').css('left', -playerPositionX + $windowWidth / 2)
    } else if (playerPositionX < 0 || playerPositionX < $mapPositionX) {
        playerPositionX = $mapPositionX
    }

    player.style.left = playerPositionX + 'px';
    player.style.bottom = playerPositionY + 'px';
    requestAnimationFrame(update);

}*/

// })();


//***************CLOUDS***************

(function () {
    const cloudMinWidth = 20;
    const cloudRandomizer = .2;
    let mapCloudTable;
    const $sky = $('.sky');

    mapCloudTable = Array
        .from({length: $numberOfSections}, (cloud, index) => {
            return {
                position: index * sectionWidth + Math.floor(Math.random() * sectionWidth),
                width: Math.ceil(Math.random() * 10) * cloudMinWidth,
                marginTop: Math.ceil(Math.random() * 10) * cloudMinWidth,
                zIndex: Math.ceil(Math.random() * 10),
            }
        })
        .filter(cloud => Math.random() > cloudRandomizer)
        .forEach(cloud => {
            $sky
                .append($('<div>')
                    .addClass('cloud')
                    .css({
                        'margin-left': cloud.position,
                        'margin-top': cloud.marginTop,
                        'width': cloud.width,
                        'height': cloud.width * .44,
                        'z-index': cloud.zIndex
                    })
                )
        });
})();
