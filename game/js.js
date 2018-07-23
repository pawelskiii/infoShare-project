const sectionWidth = 200;
const $map = $('.map');
const $numberOfObstacle = parseInt($map.css('width')) / 200; // do usunięcia i zamiany na number of sections ??
const $numberOfSections = parseInt($map.css('width')) / sectionWidth;

// (function () {

const obstacleWidth = 80;
const obstacleMinHeight = 60;
const randomizer = .4;
let mapObjectTable;

$('body').append($('<div>').addClass('odnosnik'));

mapObjectTable = Array
    .from({length: $numberOfObstacle}, (obstacle, index) => {
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


const player = document.getElementById('player')

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
}, false);
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
                    .css('margin-left', cloud.position)
                    .css('margin-top', cloud.marginTop)
                    .css('width', cloud.width)
                    .css('height', cloud.width * .44)
                    .css('z-index', cloud.zIndex)
                )
        });
    console.log(mapCloudTable);

})();


/*
(function () {

    const obstacleWidth = 80;
    const obstacleMinHeight = 60;
    const mapWidth = 7000;
    const mapHeight = 350;
    const numberOfObstacle = mapWidth / 100;
    const sectionWidth = 200;

    $('#map').css({
        width: mapWidth,
        height: mapHeight
    });

    $('body').append($('<div>').addClass('odnosnik'));

    const mapObjectTable = [];
    for (let i = 0; i < numberOfObstacle; i++) {

        mapObjectTable.push({
            position: Math.floor(Math.random() * obstacleWidth),
            height: Math.floor((Math.random() * 2 + 1)) * obstacleMinHeight
        });

        $('#map').append($('<div>')
            .addClass('obstacle')
            .css('margin-left', i * sectionWidth + mapObjectTable[i].position)
            .css('height', mapObjectTable[i].height));

        $('.odnosnik').append($('<div>').addClass('linia'))

    }

})();
*/
