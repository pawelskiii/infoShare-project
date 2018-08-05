const sectionWidth = 200;
const $map = $('.map');
const $player = $('#player');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;
const $windowWidth = parseInt($('.window').css('width'));


//***************MAP GENERATOR***************

(function () {

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
        });

    mapObjectTable.forEach(obstacle => {
        $map
            .append($('<div>')
                .addClass('obstacle')
                .css('left', obstacle.position)
                .css('height', obstacle.height)
            )
    });

})();

// player.style.left = playerPositionX + 'px';

//***************PLAYER***************

(function () {

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

        if (jumpKeyPressed === 'ArrowUp' && playerSpeedY > 0.3) {
            jumpKeyPressed = 'jumpReleased'
        }

        if (jumpKeyPressed === 'jumpReleased' && playerPositionY === 0) {
            jumpKeyPressed = '';
        }

        const $mapPositionX = Math.abs(parseInt($('.map').css('left')));

        if (playerPositionX > $windowWidth/2 + $mapPositionX) {
            $('.map').css('left',  -playerPositionX + $windowWidth/2 )
        } else if (playerPositionX < 0 || playerPositionX < $mapPositionX) {
            playerPositionX = $mapPositionX
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
                console.log(interval);
                document.getElementById("player").style.backgroundPosition = `-${spriteSize}px 0px`;
                spriteSize<spriteAllSize ? spriteSize = spriteSize+width : spriteSize = width;
            }, 100);
        }
    }

    function stopAnimate() {
        clearInterval(interval);
        stopRunning = true;
        // document.getElementById("player").style.backgroundPosition = `0px 0px`;
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
        let randomNumber = Math.floor(Math.random()*classes.length);
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

    mapCloudTable.forEach((cloud,index) => {

        if (Math.random() < .5) {
            function moveRight() {
                $("[cloud-index="+index+"]").animate({left: "+=2500"}, cloud.timeShift, "linear" ,moveLeft())
            }

            function moveLeft() {
                $("[cloud-index="+index+"]").animate({left: "-=2500"}, cloud.timeShift, "linear" ,moveRight)
            }
            moveRight();
        } else {
            function moveLeft() {
                $("[cloud-index="+index+"]").animate({left: "-=2500"}, cloud.timeShift, "linear" ,moveRight())
            }

            function moveRight() {
                $("[cloud-index="+index+"]").animate({left: "+=2500"}, cloud.timeShift, "linear" ,moveLeft)
            }
            moveLeft();
        }
    });
})();
