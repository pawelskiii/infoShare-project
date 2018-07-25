const sectionWidth = 200;
const $map = $('.map');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;


//***************MAP GENERATOR***************

(function () {

    const obstacleWidth = 80;
    const obstacleMinHeight = 60;
    const randomizer = .4;
    let mapObjectTable;

    $('body').append($('<div>').addClass('odnosnik'));

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
        .forEach(obstacle => {
            $map
                .append($('<div>')
                    .addClass('obstacle')
                    .css('margin-left', obstacle.position)
                    .css('height', obstacle.height)
                )
        });

})();

//***************PLAYER***************

const player = document.querySelector('#player');

let playerPositionX = 0;
let playerPositionY = 0;
let playerSpeedX = 0;
let playerSpeedY = 0;
let playerAcceleration = 0.0005;
let keyPressed = '';
let jumpKeyPressed = '';
let time = Date.now();

update();

window.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        event.preventDefault();
        keyPressed = event.code;
    }
})

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        event.preventDefault();
        keyPressed = '';
    }
})

window.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowUp') {
        event.preventDefault();
        jumpKeyPressed = event.code;
    }
})

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowUp') {
        event.preventDefault();
        jumpKeyPressed = 'jumpReleased';
    }
})

function update() {

    const dTime = Date.now() - time;
    time = Date.now();

    playerPositionX += playerSpeedX * dTime;
    playerPositionY += playerSpeedY * dTime;


    switch (keyPressed) {

        case 'ArrowRight':
            playerSpeedX = Math.min(
                Math.max(
                    0,
                    playerSpeedX + playerAcceleration * dTime
                ),
                0.4
            );
            break;

        case 'ArrowLeft':
            playerSpeedX = Math.max(
                Math.min(
                    0,
                    playerSpeedX - playerAcceleration * dTime
                ),
                -0.4
            );
            break;

        default:
            playerSpeedX = 0;

    }

    switch (jumpKeyPressed) {

        case 'ArrowUp':
            playerSpeedY = (playerPositionY >= 0) ? playerSpeedY + playerAcceleration * dTime : playerPositionY = 0;
            break;

        case 'jumpReleased':
            playerSpeedY = (playerPositionY > 0) ? playerSpeedY - playerAcceleration * dTime : playerPositionY = 0;
            break;

        default:
            playerSpeedY = 0;

    }




    player.style.left = playerPositionX + 'px';
    player.style.bottom = playerPositionY + 'px';
    requestAnimationFrame(update);


}


// (function() {
/*const player = document.querySelector('#player');

let playerPosition = 0;
let time = Date.now();
let playerSpeed = 0.01;
let playerAcceleration = 0.0001;
let keyPressed = '';

update();


window.addEventListener('keydown', function (event) {
    // console.log(event.code);
    if (event.code === 'ArrowRight') {
        event.preventDefault();
        keyPressed = 'ArrowRight';
    }
});

window.addEventListener('keyup', function (event) {
    if (event.code === 'ArrowRight') {
        event.preventDefault();
        keyPressed = '';
    }
});

/!*
const movementKeyTable = ['ArrowRight', 'ArrowLeft', 'ArrowUp']

movementKeyTable.forEach((key) => {
    window.addEventListener('keydown', function (event) {
        if (event.code === key) {
            console.log('1', key)
            event.preventDefault();
            keyPressed = key;
        }
    })
    window.addEventListener('keyup', function (event) {
        if (event.code === key) {
            console.log('2', key)
            event.preventDefault();
            keyPressed = '';
            console.log('to jest keypressed', keyPressed, key)
        }
    })
})
*!/

function update() {
    const dTime = Date.now() - time;
    time = Date.now();

    playerPosition += playerSpeed * dTime;

    switch (keyPressed) {
        case 'ArrowRight':
            console.log('lolol');
            playerSpeed = Math.min(
                Math.max(
                    0,
                    playerSpeed + (keyPressed === 'ArrowRight' ? 1 : -1) * playerAcceleration * dTime),
                0.3);
            console.log('playerRightspeed', playerSpeed);
            break;
/!*

        case 'ArrowLeft':
            console.log(':(:(:(');
            playerSpeed = Math.max(
                Math.min(
                    0,
                    -(playerSpeed + playerAcceleration * dTime)),
                -0.3);
            console.log('playerLEFTspeed', playerSpeed);
            break;
*!/

    }

    player.style.marginLeft = playerPosition + 'px';
    requestAnimationFrame(update)
}*/

// })();


/*const player = document.getElementById('player')

function Y(id, countPx) {
    player.style.top = player.style.top.substr(0, player.style.top.length - 2) * 1 + countPx + 'px';

}

function X(id, countPX) {
    player.style.left = player.style.left.substr(0, player.style.left.length - 2) * 1 + countPX + 'px';
}


window.addEventListener('keydown', function (event) {

    switch (event.keyCode) {
        case 37: // Left
            event.preventDefault();
            X('player', -15);
            break;

        case 38: // Up
            event.preventDefault();
            Y('player', -15);
            break;

        case 39: // Right
            event.preventDefault();
            X('player', 15);
            break;

        case 40://Down
            event.preventDefault();
            Y('player', 15);
            break;
    }
}, false);*/

//***************CLOUDS***************

/*(function () {
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
                    .css('margin-left', cloud.position)
                    .css('margin-top', cloud.marginTop)
                    .css('width', cloud.width)
                    .css('height', cloud.width * .44)
                    .css('z-index', cloud.zIndex)
                )
        });
})()*/
