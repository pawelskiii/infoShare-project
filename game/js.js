const sectionWidth = 350;
const $map = $('.map');
const $player = $('#player');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;
const $windowWidth = parseInt($('.window').css('width'));
const $windowHeight = parseInt($map.css('height'));
const $playerWidth = parseInt($player.css('width'));
const $playerHeight = parseInt($player.css('height'));


//***************MAP GENERATOR + PLAYER********************
(function () {
    //MAP
    const obstacleWidth = 80;
    const obstacleMinHeight = 60;
    const randomizer = 0.3;
    const obstaclePositions = [];
    let mapObjectTable;
    let currentObstacleHeight = 0;
    let currentObstaclePosition = 0;
    let time = Date.now();

    //PLAYER
    const player = document.querySelector('#player');
    const moveRight = 'ArrowRight';
    const moveLeft = 'ArrowLeft';
    const jump = 'ArrowUp';
    const fall = 'jumpReleased';
    const nitro = 'ControlLeft';
    let playerPositionX = 0;
    let monsterPositionX = parseInt($('.monster').css('left'));
    let playerPositionY = 0;
    let playerSpeedX = 0;
    let maxPlayerSpeedX = 0.4;
    let playerSpeedY = 0;
    let playerAccelerationX = 0.0005;
    let playerAccelerationY = 0.0015;
    let nitroMultiplication = 1.4;
    let nitroPressed = false;
    let keyPressed = '';
    let keyPressedJump = '';

    //SHOT
    let shotPressed = '';
    let stillFalling = false;
    let shotPositionX = 0;
    let monsterShotPositionX = 0;
    let shotSpeedX = 0.4;
    let shotAcceleration = 0.8;
    let shotArray = [];
    let monsterShotArray = [];
    let shotNumber = 0;
    let shotAmount = 30;
    let isFiring = false;

    //MAP
    mapObjectTable = Array
        .from({length: $numberOfSections}, (obstacle, index) => {
            if (index !== 0) {
                return {
                    position: index * sectionWidth + Math.floor(Math.random() * (sectionWidth - obstacleWidth)) * .8,
                    height: Math.floor((Math.random() * 2 + 1)) * obstacleMinHeight
                }
            }
        })
        .filter(obstacle => {
            return (obstacle !== undefined && Math.random() > randomizer)
        });

    mapObjectTable.forEach((obstacle, index) => {
        $map
            .append($('<div>')
                .addClass('obstacle')
                .css({
                        'left': obstacle.position,
                        'height': obstacle.height
                })
            );
        obstaclePositions[index] = [obstacle.position, obstacle.height];
    });
    
    update();
    
    //PLAYER
/*setInterval(() => {
            $('.monster').animate({
                top: "-=100px"
            }, 800);
            $('.monster').animate({
                top: "+=100px"
            }, 800);
},1600)*/

    window.addEventListener('keydown', function (event) {
        if (event.code === moveRight || event.code === moveLeft) {
            event.preventDefault();
            keyPressed = event.code;
        }
        if (event.code === jump) {
            event.preventDefault();
            keyPressedJump = event.code;
        }
        if (event.code === nitro) {
            if (!nitroPressed) {
                maxPlayerSpeedX *= nitroMultiplication;
                playerAccelerationX *= nitroMultiplication;
                nitroPressed = true;
            }
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
        if (event.code === nitro) {
            maxPlayerSpeedX /= nitroMultiplication;
            playerAccelerationX /= nitroMultiplication;
            nitroPressed = false;
        }
    });
    
    function moveFwd(dTime) {
        playerSpeedX = Math.min(Math.max(0, playerSpeedX + playerAccelerationX * dTime), maxPlayerSpeedX);
        playerPositionX += playerSpeedX * dTime;
    }

    function moveBwd(dTime) {
        playerSpeedX = Math.max(Math.min(0, playerSpeedX - playerAccelerationX * dTime), -maxPlayerSpeedX);
        playerPositionX += playerSpeedX * dTime;
    }

    function moveUp(dTime) {
        playerSpeedY = playerSpeedY + playerAccelerationY * dTime;
        playerPositionY = playerPositionY + playerSpeedY * dTime;
    }

    function fallDown(dTime) {
        playerSpeedY = playerSpeedY - playerAccelerationY * dTime;
        playerPositionY = playerPositionY + playerSpeedY * dTime;
    }

    //SHOT
    window.addEventListener('keydown', function (key) {
        if (key.code === 'Space' && shotAmount > 0) {
            shotNumber++;


            shotArray.push({
                amount: shotAmount,
                shotIndex: shotNumber,
                shotTime: Date.now(),
                shotPosition: $playerWidth + parseInt($('#player').css('left')),
                shotTopPosition: parseInt($player.css('top')) + $playerHeight/2
            });
            $('.game-information div:last').remove();
            shotAmount--;

            $('.map').append($('<div>')
                .addClass('shot')
                .attr('shotNumber', shotNumber)
                .css({
                    "left": playerPositionX + 75,
                    "top": ($windowHeight - ($playerHeight / 2 + parseInt($('#player').css('bottom'))))
                }))

        }
    });

    for (let i = 1; i <= shotAmount; i++) {
        $('.game-information').append($('<div>').addClass('bullet').attr('shotNumber', i));
    }


    //ANIMATIONS
    function update() {
        const $mapPositionX = Math.abs(parseInt($('.map').css('left')));

        const dTime = Date.now() - time;
        time = Date.now();
        let horizontalCollision = false;
        let verticalCollision = false;
        let oldPlayerPositionX = playerPositionX;


        function checkPlayerCollision() {
            obstaclePositions.forEach(obsPos => {
                if (playerPositionX + $playerWidth >= obsPos[0] && playerPositionX <= obsPos[0] + obstacleWidth) {
                    horizontalCollision = true;
                    currentObstaclePosition = obsPos[0];
                    currentObstacleHeight = obsPos[1];
                    if (playerPositionY < obsPos[1]) {
                        verticalCollision = true;
                    }
                }
            })
        }

        switch (keyPressed) {

            case moveRight:
                moveFwd(dTime);
                checkPlayerCollision();
                if (horizontalCollision && verticalCollision && !stillFalling) {
                    playerPositionX = currentObstaclePosition - $playerWidth - 1;
                }
                if (!horizontalCollision && currentObstacleHeight !== 0) {
                    currentObstacleHeight = 0;
                    keyPressedJump = fall;
                }
                break;
            case moveLeft:
                moveBwd(dTime);
                checkPlayerCollision();
                if (horizontalCollision && verticalCollision) {
                    playerPositionX = currentObstaclePosition + obstacleWidth + 1;
                }
                if (!horizontalCollision && currentObstacleHeight !== 0) {
                    currentObstacleHeight = 0;
                    keyPressedJump = fall;
                }
                break;
            default:
                playerSpeedX = 0;
                break;
        }

        switch (keyPressedJump) {
            case jump:
                if (playerSpeedY < .5 && !stillFalling) {
                    moveUp(dTime);
                } else {
                    keyPressedJump = fall;
                    stillFalling = true;
                    fallDown(dTime);
                    checkPlayerCollision();
                    if ((playerPositionY + playerSpeedY * dTime) < currentObstacleHeight) {
                        playerPositionY = currentObstacleHeight;
                        stillFalling = false;
                        keyPressedJump = '';
                    }
                }
                break;
            case fall:
                if (playerPositionY > currentObstacleHeight) {
                    fallDown(dTime);
                    stillFalling = true;
                    checkPlayerCollision();
                    if ((playerPositionY + playerSpeedY * dTime) < currentObstacleHeight) {
                        playerPositionY = currentObstacleHeight;
                        playerSpeedY = 0;
                    }

                }
                if (playerPositionY <= currentObstacleHeight) {
                    if ((!horizontalCollision && currentObstacleHeight > 0) || (keyPressed === moveRight && currentObstacleHeight > 0 && playerPositionY < currentObstacleHeight)) {
                        fallDown(dTime);
                        playerPositionX = oldPlayerPositionX;
                        stillFalling = true;
                        if (playerPositionY < 0) {
                            playerPositionY = 0;
                            stillFalling = false;
                            keyPressedJump = '';
                        }
                    } else {
                        playerPositionY = currentObstacleHeight;
                        stillFalling = false;
                        keyPressedJump = '';
                    }

                }
                break;

            default:
                playerSpeedY = 0;
                break;
        }

        switch (shotPressed) {

            case 'Space':
                shotSpeedX = 0.4;
                break;

            default:
                shotSpeedX = 0.4;

        }

        if (playerPositionX > $windowWidth / 2 + $mapPositionX) {
            $('.map').css('left', -playerPositionX + $windowWidth / 2)
        } else if (playerPositionX < 0 || playerPositionX < $mapPositionX) {
            playerPositionX = $mapPositionX
        }



        monsterShotArray.forEach((el, index) => {
            let timeOfMonsterShooting = time - el.shotTime;
            monsterShotPositionX = el.shotPosition - shotSpeedX - timeOfMonsterShooting * shotAcceleration + 'px';
            document.getElementsByClassName('monster__shot')[index].style.left = monsterShotPositionX;

            console.log('roznica absolutna', Math.abs( el.shotTopPosition -parseInt($player.css('top'))))

                if (parseInt(monsterShotPositionX) < parseInt(playerPositionX) && Math.abs( el.shotTopPosition -parseInt($player.css('top'))) < $playerHeight ) {
                    document.getElementById('player__life').value-=5;
                    monsterShotArray.splice(index, 1);
                    document.getElementsByClassName('monster__shot')[index].remove()
                }
                console.log(monsterShotPositionX)
            if (parseInt(monsterShotPositionX) < parseInt($('.monster').css('left')) - $windowWidth) {
                monsterShotArray.splice(index, 1);
                document.getElementsByClassName('monster__shot')[index].remove();
            }
        })


        shotArray.forEach((el, index) => {
            let timeOfShooting = time - el.shotTime;
            shotPositionX = el.shotPosition + shotSpeedX + timeOfShooting * shotAcceleration + 'px';
            document.getElementsByClassName('shot')[index].style.left = shotPositionX;


            if (parseInt(shotPositionX) > parseInt($('.monster').css('left')) && Math.abs(parseInt($('.monster').css('top'))- el.shotTopPosition) < $playerHeight/2)  {
                document.getElementById('monster__life').value-=5;
                shotArray.splice(index, 1);
                document.getElementsByClassName('shot')[index].remove()
            }

            if (parseInt(shotPositionX) > playerPositionX + $windowWidth) {
                shotArray.splice(index, 1);
                document.getElementsByClassName('shot')[index].remove();
            }
        });

        if ( playerPositionX > monsterPositionX - $windowWidth/2 && isFiring == false) {
                setInterval(() => {
                    monsterShotArray.push({
                        shotTime: Date.now(),
                        shotPosition: parseInt($('.monster').css('left')),
                        shotTopPosition: parseInt($('.monster').css('top')) + parseInt($('.monster').css('height'))/2
                    });
                    $('.map').append($('<div>')
                        .addClass('monster__shot')
                        .css({
                            "left": parseInt($('.monster').css('left')) - monsterShotPositionX,
                            "top": parseInt($('.monster').css('top')) + parseInt($('.monster').css('height'))/2
                        }))
                }, 1000);
                isFiring = true;
        }


        player.style.left = playerPositionX + 'px';
        player.style.bottom = playerPositionY + 'px';
        requestAnimationFrame(update);
    }
})();

//***************PLAYER ANIMATE SPRITE***************

(function () {
    let spriteSize = 105, width = spriteSize;
    let spriteAllSize = 630;
    let interval;
    let stopRunning = true;

    function animatePlayer() {
        if (stopRunning) {
            stopRunning = false;
            interval = setInterval(() => {
                document.getElementById("player").style.backgroundPosition = `-${spriteSize}px 0px`;
                spriteSize < spriteAllSize ? spriteSize = spriteSize + width : spriteSize = width;
            }, 100);
        }
    }

    function stopAnimate() {
        clearInterval(interval);
        stopRunning = true;
    }

    window.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowRight') {
            $player.removeClass('scaleXrotate');
            animatePlayer();
        }
    });

    window.addEventListener('keyup', function (event) {
        if (event.code === 'ArrowRight') {
            stopAnimate();
        }
    });

    window.addEventListener('keydown', function (event) {
        if (event.code === 'ArrowLeft') {
            $player.addClass('scaleXrotate');
            animatePlayer();
        }
    });

    window.addEventListener('keyup', function (event) {
        if (event.code === 'ArrowLeft') {
            stopAnimate();
        }
    });
})();

//***************CLOUDS***************

(function () {
    const cloudMinWidth = 50;
    const cloudAmountRandomizer = .2;
    let mapCloudTable;
    const $sky = $('.sky');

    mapCloudTable = Array
        .from({length: $numberOfSections}, (cloud, index) => {
            return {
                position: index * sectionWidth + Math.floor(Math.random() * sectionWidth),
                width: Math.ceil(Math.random() * 5) * cloudMinWidth,
                marginTop: Math.ceil(Math.random() * 3) * cloudMinWidth,
            };
        })
        .filter(() => Math.random() > cloudAmountRandomizer);

    mapCloudTable.forEach((cloud, index) => {
        cloud.timeShift = Math.ceil(1 / cloud.width * Math.pow(10, 7));
        let classes = ['cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5'];
        let randomNumber = Math.floor(Math.random() * classes.length);
        $sky
            .append($('<div>')
                .addClass(classes[randomNumber])
                .attr('cloud-index', index)
                .css({
                    'left': cloud.position,
                    'top': cloud.marginTop,
                    'width': cloud.width,
                    'height': cloud.width * .44,
                    'z-index': cloud.width / 10,
                })
            )
    });

    mapCloudTable.forEach((cloud, index) => {

        if (Math.random() < .5) {
            function moveRight() {
                $("[cloud-index=" + index + "]").animate({left: "+=2500"}, cloud.timeShift, "linear", moveLeft())
            }

            function moveLeft() {
                $("[cloud-index=" + index + "]").animate({left: "-=2500"}, cloud.timeShift, "linear", moveRight)
            }

            moveRight();
        } else {
            function moveLeft() {
                $("[cloud-index=" + index + "]").animate({left: "-=2500"}, cloud.timeShift, "linear", moveRight())
            }

            function moveRight() {
                $("[cloud-index=" + index + "]").animate({left: "+=2500"}, cloud.timeShift, "linear", moveLeft)
            }

            moveLeft();
        }
    });
})();
