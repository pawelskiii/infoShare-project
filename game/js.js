const sectionWidth = 200;
const $map = $('.map');
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;
const $windowWidth = parseInt($('.window').css('width'));
const $windowHeight = parseInt($('.map').css('height'));

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
        })
        .forEach(obstacle => {
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

    $(window).keydown(function(key) {
        if (key.which === 32) {
            console.log('wcinieto spacje')
            console.log(Date.now())
           /* $('.game-information').append($('<div>').addClass('bullet'));*/
            $('.map').append($('<div>').addClass('shot').css({
                                                              "left":  playerPositionX+75,
                                                              "top": ($windowHeight - (parseInt($('#player').css('height'))/2 + parseInt($('#player').css('bottom'))))
            }))
            $('.shot').css('left', function (position) {

            });

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
