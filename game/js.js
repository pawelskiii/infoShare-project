function gameStart(randomizer, maxPlayerSpeedX, nitroMultiplication, shotAmount, difficulty, monsterShootingInterval, playerName) {
    const sectionWidth = 350;
    const $map = $('.map');
    const $player = $('#player');
    const $numberOfSections = parseInt($map.css('width')) / sectionWidth;
    const $windowWidth = parseInt($('.window').css('width'));
    const $windowHeight = parseInt($map.css('height'));
    const $playerWidth = parseInt($player.css('width'));
    const $playerHeight = parseInt($player.css('height'));

    document.getElementById('player-text').innerHTML = playerName;

//***************MAP GENERATOR + PLAYER********************
    (function () {
        //MAP
        const obstacleWidth = 80;
        const obstacleMinHeight = 60;
        const obstaclePositions = [];
        let mapObjectTable;
        let currentObstacleHeight = 0;
        let currentObstaclePosition = 0;
        let time = Date.now();
        let bulletTime = Date.now();
        let isRunning = true;

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
        let playerSpeedY = 0;
        let playerAccelerationX = 0.0005;
        let playerAccelerationY = 0.0015;
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
        let shottoCarrottoArray = [];
        let isFiring = false;

        //PAUSE+TIMER
        let timePause = 0;
        let runningTime = true;

        //MAP

        setInterval(() => {
            $('.monster').animate({
                top: "-=120px"
            }, 800);
            $('.monster').animate({
                top: "+=120px"
            }, 800);
        },1600)

        mapObjectTable = Array
            .from({length: $numberOfSections}, (obstacle, index) => {
                if (index !== 0) {
                    return {
                        position: index * sectionWidth + Math.floor(Math.random() * (sectionWidth - obstacleWidth)) * .8,
                        height: Math.floor((Math.random() * 2 + 1)) * obstacleMinHeight,
                        hasMiniMonster: Math.floor(Math.random() * 2)
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
            if (obstacle.hasMiniMonster) {
                $map
                    .append($('<div>')
                        .addClass('minimonster')
                        .css({
                            'left': obstacle.position,
                            'bottom': obstacle.height + 20 + Math.floor(Math.random() * 100)
                        })
                    )
            }
            obstaclePositions[index] = [obstacle.position, obstacle.height];
        });

        update();

        //TIMER(PAUSE)
        document.getElementById('startPause').onclick = function startPause() {
            if (runningTime) {
                runningTime = false;
                incrementTime();
                togglePause();
                miniMonstersAnimation();
            }
            else {
                runningTime = true;
                incrementTime();
                togglePause();
                miniMonstersAnimation();
            }
        };

        function incrementTime() {
            if (runningTime === true) {
                setTimeout(function () {
                    timePause++;
                    let minutes = Math.floor(timePause / 10 / 60);
                    let seconds = Math.floor(timePause / 10 % 60);
                    let tenths = timePause % 10;

                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    document.getElementById("timer-text").innerHTML = minutes + ":" + seconds + ":0" + tenths;
                    incrementTime();
                }, 100);
            }
        }

        // PAUSE
        function togglePause() {
            isRunning = !isRunning;
            if (isRunning) {
                document.querySelector('.pause-button').style.background = 'url("img/btn/play.png") center center / contain no-repeat';
            } else {
                document.querySelector('.pause-button').style.background = 'url("img/btn/play-checked.png") center center / contain no-repeat';
            }

            if (isRunning) {
                update();
            }
        }

        let myAudio = document.querySelector("audio");
        let audioPlay = true;
        myAudio.play();

        function toggleMusic() {
            if (audioPlay) {
                myAudio.pause();
                audioPlay = !audioPlay;
                document.querySelector('.music-button').style.background = 'url("img/btn/music-checked.png") center center / contain no-repeat';
            } else {
                myAudio.play();
                audioPlay = !audioPlay;
                document.querySelector('.music-button').style.background = 'url("img/btn/music.png") center center / contain no-repeat';
            }
        }

        document.querySelector('.music-button').addEventListener('click', toggleMusic);
        // myAudio.pause();

        incrementTime();

        //PLAYER
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
            if (event.code === 'KeyP') {
                togglePause();
                miniMonstersAnimation();
                runningTime = !runningTime;
                incrementTime();
            }
            if (event.code === 'KeyM') {
                toggleMusic();
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
        if (key.code === 'Space' && shotAmount > 0 && isRunning && playerSpeedX >= 0) {
            shotNumber++;
            shotArray.push({
                amount: shotAmount,
                shotIndex: shotNumber,
                shotTime: Date.now(),
                shotPosition: $playerWidth + parseInt($('#player').css('left')),
                shotBottomPosition: parseInt($player.css('bottom')) + $playerHeight/2
            });
            $('.game-information div:last').remove();
            shotAmount--;

            $('.map').append($('<div>')
                .addClass('shot')
                .attr('shotNumber', shotNumber)
                .css({
                    "left": playerPositionX + 75,
                    "bottom": ($playerHeight / 2 + parseInt($('#player').css('bottom')))
                }))
        }

        let monsterLifePoints =  document.getElementById('monster__life').value
        console.log(monsterLifePoints)
        if (monsterLifePoints <=100 && monsterLifePoints > 80){
            document.getElementById('monster__life').style.background= "green";
            console.log('cos1')
        } else if (monsterLifePoints <80 && monsterLifePoints > 60){
            document.getElementById('monster__life').style.background= "greenyellow";
            console.log('cos2')
        }else if (monsterLifePoints <60 && monsterLifePoints > 40){
            document.getElementById('monster__life').style.backgroundColor= "yellow";
            console.log('cos3')
        }else if (monsterLifePoints <40 && monsterLifePoints > 30){
            document.getElementById('monster__life').style.backgroundColor= "red";
            console.log('cos4')
        }else if (monsterLifePoints <20 && monsterLifePoints > 10){
            document.getElementById('monster__life').style.backgroundColor= "black";
            console.log('cos5')
        }else if (monsterLifePoints===0) {
           /* $('.monster').fadeOut(3000);*/

            function explode() {
                let spriteSize = 125, width = spriteSize;
                let spriteAllSize = 750;
                let intervalExplode;
                document.getElementById("monster").style.width = "125px";
                document.getElementById("monster").style.backgroundImage = "url('img/explode.png')";
                intervalExplode = setInterval(() => {
                    document.getElementById("monster").style.backgroundPosition = `-${spriteSize}px 0px`;
                    spriteSize < spriteAllSize ? spriteSize = spriteSize + width : spriteSize = width;
                }, 50);
                clearInterval(intervalExplode);
            }

            explode();
        }

    });

        for (let i = 1; i <= shotAmount; i++) {
            $('.game-information').append($('<div>').addClass('bullet').attr('shotNumber', i));
        }

        //***************MINI MONSTER***************

        function miniMonstersAnimation() {
            let frames = [
                'frame-1.png',
                'frame-2.png',
                'frame-3.png',
                'frame-4.png'
            ];
            let miniMonsterIndex = 0;
            let wingsSpriteDirection = -1;
            let monsterDirection = true;
            let $miniMonsters = $('.minimonster');

            let miniMonsterArray = document.getElementsByClassName('minimonster');
            let miniMonsterArrayLength = miniMonsterArray.length;

            if (isRunning) {
                wingsAnimation = setInterval(() => {
                    for (i = 0; i <= miniMonsterArrayLength - 1; i++) {
                        miniMonsterArray[i].style.background = 'url("img/dragon/' + frames[miniMonsterIndex] + '") center center / contain no-repeat';
                        if (miniMonsterIndex === 0 || miniMonsterIndex === 3) {
                            wingsSpriteDirection *= -1;
                        }
                        miniMonsterIndex += wingsSpriteDirection;
                    }
                }, 75);
                flyAnimation = setInterval(() => {
                    if (monsterDirection) {
                        $miniMonsters.animate({left: "-=300"}, 2000, "swing").addClass('scaleXrotate');
                        monsterDirection = false;
                    } else {
                        $miniMonsters.animate({left: "+=300"}, 2000, "swing").removeClass('scaleXrotate');
                        monsterDirection = true;
                    }
                }, 2200)
            } else {
                clearInterval(wingsAnimation);
                clearInterval(flyAnimation);
            }
        }
        miniMonstersAnimation();


        //ANIMATIONS
        function update() {
            const $mapPositionX = Math.abs(parseInt($('.map').css('left')));

            const dTime = Date.now() - time;
            time = Date.now();
            let horizontalCollision = false;
            let verticalCollision = false;
            let oldPlayerPositionX = playerPositionX;

            let miniMonsterArray = Array.from(document.getElementsByClassName('minimonster'));


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

            if (playerPositionX > $windowWidth / 2 + $mapPositionX && Math.abs(parseInt($map.css('left'))) < (parseInt($map.css('width')) - parseInt($windowWidth))) {
                $('.map').css('left', -playerPositionX + $windowWidth / 2)
            } else if (playerPositionX < 0 || playerPositionX < $mapPositionX) {
                playerPositionX = $mapPositionX
            } else if (playerPositionX > Math.abs(parseInt($map.css('width'))) - $playerWidth  && playerSpeedX > 0) {
                playerPositionX = Math.abs(parseInt($map.css('width'))) - $playerWidth
            }

    monsterShotArray.forEach((el, index) => {
        let timeOfMonsterShooting = time - el.shotTime;
        let positionBottomMegaShotMonster = parseInt(document.getElementsByClassName('monster__shot')[index].style.bottom);
        monsterShotPositionX = el.shotPosition - shotSpeedX - timeOfMonsterShooting * shotAcceleration + 'px';
        document.getElementsByClassName('monster__shot')[index].style.left = monsterShotPositionX;


        if ((parseInt(monsterShotPositionX) < parseInt(playerPositionX) + $playerWidth)
            && (parseInt(monsterShotPositionX) - 18 > parseInt(playerPositionX))
            && (positionBottomMegaShotMonster < playerPositionY + $playerHeight)
            && (positionBottomMegaShotMonster + 18 > playerPositionY)) {
            document.getElementById('player__life').value -= 5;
            monsterShotArray.splice(index, 1);
            document.getElementsByClassName('monster__shot')[index].remove()
        }
        if (parseInt(monsterShotPositionX) < parseInt($('.monster').css('left')) - $windowWidth) {
            monsterShotArray.splice(index, 1);
            document.getElementsByClassName('monster__shot')[index].remove();
        }
    })

    let positionBottomMegaMonster = document.getElementsByClassName('monster')[0].getBoundingClientRect().top;


        shotArray.forEach((el, index) => {
            let timeOfShooting = time - el.shotTime;
            let positionBottomMegaShotPlayer = parseInt(document.getElementsByClassName('shot')[index].getBoundingClientRect().top);
            shotPositionX = el.shotPosition + shotSpeedX + timeOfShooting * shotAcceleration + 'px';
            let shotRemovalX = parseInt(shotPositionX);
            let shotRemovalY = parseInt(document.getElementsByClassName('shot')[index].style.bottom);
            document.getElementsByClassName('shot')[index].style.left = shotPositionX;
            miniMonsterArray.forEach((miniMonster, miniMonsterIndex) => {

                let miniMonsterRemovalX = parseInt(miniMonster.style.left);
                let miniMonsterRemovalY = parseInt(miniMonster.style.bottom);

                if ((shotRemovalX + 30 >= miniMonsterRemovalX)
                    && (shotRemovalX <= miniMonsterRemovalX + 50)
                    && (shotRemovalY + 20 >= miniMonsterRemovalY)
                    && (shotRemovalY <= miniMonsterRemovalY + 50)) {
                    shotArray.splice(index, 1);
                    document.getElementsByClassName('shot')[index].remove();
                    document.getElementsByClassName('minimonster')[miniMonsterIndex].remove();
                    $('.map').append($('<div>')
                        .addClass('shottoCarrotto rotating')
                        .attr('shotto-Carrotto-Secret-Position', miniMonsterRemovalX)
                        .css({
                            "left": miniMonsterRemovalX,
                            "bottom": miniMonsterRemovalY
                        }));
                    shottoCarrottoArray.push({
                        positionX: miniMonsterRemovalX,
                        positionY: miniMonsterRemovalY
                    });
                    clearInterval(wingsAnimation);
                    clearInterval(flyAnimation);
                    miniMonstersAnimation();

                }
            });

            if ((parseInt(shotPositionX) + 50 > parseInt($('.monster').css('left')))
                && (parseInt(shotPositionX) < monsterPositionX + 116)
                && (positionBottomMegaShotPlayer < positionBottomMegaMonster + 105)
                && (positionBottomMegaShotPlayer + 16 > positionBottomMegaMonster))  {

                document.getElementById('monster__life').value-=50;
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
                        shotBottomPosition: parseInt($('.monster').css('bottom')) + parseInt($('.monster').css('height'))/2
                    });
                    $('.map').append($('<div>')
                        .addClass('monster__shot')
                        .css({
                            "left": parseInt($('.monster').css('left')) - monsterShotPositionX,
                            "bottom": parseInt($('.monster').css('bottom')) + parseInt($('.monster').css('height'))/2
                        }))
                }, monsterShootingInterval);
                isFiring = true;
            }
            player.style.left = playerPositionX + 'px';
            player.style.bottom = playerPositionY + 'px';

            miniMonsterArray.forEach((miniMonster) => {
                let miniMonsterRemovalX = parseInt(miniMonster.style.left);
                let miniMonsterRemovalY = parseInt(miniMonster.style.bottom);
                if ((playerPositionX + $playerWidth >= miniMonsterRemovalX)
                    && (playerPositionX <= miniMonsterRemovalX + 70)
                    && (playerPositionY + $playerHeight - 30 >= miniMonsterRemovalY)
                    && (playerPositionY <= miniMonsterRemovalY + 70)) {

                    if (time - bulletTime >= 500 && document.getElementsByClassName('bullet').length !== 0) {
                        if (difficulty === 'hard' && document.getElementsByClassName('bullet').length !== 1) {
                            document.getElementsByClassName('bullet')[0].remove();
                            shotAmount--;
                        }
                        document.getElementsByClassName('bullet')[0].remove();
                        shotAmount--;
                        bulletTime = Date.now();
                    }


                }
            });

            shottoCarrottoArray.forEach((shottoCarrotto, shottoCarrottoIndex) => {
                if ((playerPositionX + $playerWidth >= shottoCarrotto.positionX)
                    && (playerPositionX <= shottoCarrotto.positionX + 30)
                    && (playerPositionY + $playerHeight - 30 >= shottoCarrotto.positionY)
                    && (playerPositionY <= shottoCarrotto.positionY + 30)) {
                    shottoCarrottoArray.splice(shottoCarrottoIndex, 1);
                    $('.game-information').append($('<div>').addClass('bullet'));
                    $('[shotto-carrotto-secret-position=' + shottoCarrotto.positionX + ']').remove();
                    shotAmount++;
                }
            });


            if (isRunning) {
                requestAnimationFrame(update);
            }
        }
    })();

//***************PLAYER ANIMATE SPRITE***************

    (function () {
        let spriteSize = 125, width = spriteSize;
        let spriteAllSize = 750;
        let intervalStanding;
        let stopStanding = true;

        function animateStandingPlayer() {
            document.getElementById("player").style.width = "125px";
            document.getElementById("player").style.backgroundImage = "url('img/bunny_stand.png')";
            if (stopStanding) {
                stopStanding = false;
                intervalStanding = setInterval(() => {
                    document.getElementById("player").style.backgroundPosition = `-${spriteSize}px 0px`;
                    spriteSize < spriteAllSize ? spriteSize = spriteSize + width : spriteSize = width;
                }, 250);
            }
        }

        animateStandingPlayer();

        (function () {
            let spriteAllSize = 500;
            let interval;
            let nitroInterval;
            let stopRunning = true;
            let stopNitro = true;
            let normalMove = false;

            function animatePlayer() {
                document.getElementById("player").style.width = "125px";
                document.getElementById("player").style.backgroundImage = "url('img/bunny_run.png')";
                if (stopRunning) {
                    stopRunning = false;
                    interval = setInterval(() => {
                        document.getElementById("player").style.backgroundPosition = `-${spriteSize}px 0px`;
                        spriteSize < spriteAllSize ? spriteSize = spriteSize + width : spriteSize = width;
                    }, 100);
                }
            }

            function animateNitroPlayer() {
                let spriteSize = 250, width = spriteSize;
                let spriteAllSize = 1000;
                document.getElementById("player").style.width = "250px";
                document.getElementById("player").style.backgroundImage = "url('img/bunny_nitro.png')";
                if (stopNitro) {
                    stopNitro = false;
                    nitroInterval = setInterval(() => {
                        document.getElementById("player").style.backgroundPosition = `-${spriteSize}px 0px`;
                        spriteSize < spriteAllSize ? spriteSize = spriteSize + width : spriteSize = width;
                    }, 10);
                }
            }

            function stopAnimateStanding() {
                clearInterval(intervalStanding);
                stopStanding = true;
            }

            function stopAnimate() {
                clearInterval(interval);
                stopRunning = true;
            }

            function stopNitroAnimate() {
                clearInterval(nitroInterval);
                stopNitro = true;
            }

            window.addEventListener('keydown', function (event) {
                if (event.code === 'ArrowLeft') {
                    $player.addClass('scaleXrotate');
                    stopAnimateStanding();
                    animatePlayer();
                    normalMove = true;
                }
                else if (event.code === 'ArrowRight') {
                    $player.removeClass('scaleXrotate');
                    stopAnimateStanding();
                    animatePlayer();
                    normalMove = true;
                }
                else if (event.code === 'ControlLeft') {
                    stopAnimateStanding();
                    stopAnimate();
                    animateNitroPlayer();
                }
            });

            window.addEventListener('keyup', function (event) {
                if (event.code === 'ControlLeft') {
                    stopNitroAnimate();
                    normalMove ? animatePlayer() : animateStandingPlayer();
                }
                else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                    stopAnimate();
                    animateStandingPlayer();
                }
            });
        })();
    })();


//***************CLOUDS***************

    (function () {
        const cloudMinWidth = 50;
        const cloudAmountRandomizer = .1;
        let mapCloudTable;
        const $sky = $('.sky');

        mapCloudTable = Array
            .from({length: $numberOfSections * 2}, (cloud, index) => {
                return {
                    position: index * sectionWidth / 2 + Math.floor(Math.random() * sectionWidth / 2),
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
                        'height': cloud.width * .445,
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
}


//***************GAME INSTRUCTIONS***************

(function () {
    $('.instruction-button').click(function () {
        $(this).addClass('clicked');
    });

    $('.close').click(function (e) {
        $('.clicked').removeClass('clicked');
        e.stopPropagation();
    });
})();

//***************GAME START***************

(function () {
    $('.start-button').click(function () {
        let isChecked = $('[value="hard"]').is(':checked');
        let randomizer = .3;
        let maxPlayerSpeedX = .4;
        let nitroMultiplication = 1.4;
        let shotAmount = 30;
        let difficulty = 'easy';
        let monsterShootingInterval = 1000;
        let playerName = $('input[type="text"]')[0].value;
        if (isChecked) {
            randomizer = .45;
            maxPlayerSpeedX = .6;
            nitroMultiplication = 1.7;
            shotAmount = 20;
            difficulty = 'hard';
            monsterShootingInterval = 400;
        }
        $(this).addClass('start-clicked');
        $('.starting-box').addClass('game-start');
        gameStart(randomizer, maxPlayerSpeedX, nitroMultiplication, shotAmount, difficulty, monsterShootingInterval, playerName);
    });
})();
//***************RANKING********************

(function showBestScore() {

    $("#ranking-container").hide();
    let nickName = document.getElementById("nick-name").value;
    let yourTime = document.getElementById('timer').innerHTML;

    $("#startPause").click (function () {
        let nickName = document.getElementById("nick-name").value;
        let yourTime = document.getElementById('timer').innerHTML;
        let timeList = localStorage.getItem('time', yourTime);

        if(localStorage.getItem('Nick') === null || timeList > yourTime) {
            let nickNamesList = localStorage.setItem('Nick',nickName);
            let timeList = localStorage.setItem('time', yourTime);
            $("#ranking-container").show();
            let newLine = document.createElement("H1");
            newLine.innerHTML = ('Pobiłeś rekord! Gratulacje!');
            $('#ranking-container').append(newLine);
        }

        let timeListCurrent = localStorage.getItem('time', yourTime);
        let nickNamesList = localStorage.getItem('Nick',nickName);
        $("#ranking-container").show();
        let newLine = document.createElement("H1");
        newLine.innerHTML = ('Najlepszy czas:');
        let newLine2 = document.createElement("p");
        newLine2.innerHTML = (nickNamesList + " " + timeListCurrent);
        $('#ranking-container').append(newLine);
        $('#ranking-container').append(newLine2);
    });
})();



