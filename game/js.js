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



// })();


//***************CLOUDS***************

(function () {
const cloudMinWidth = 20;
const cloudRandomizer = .3;
let mapCloudTable;
const $sky = $('.sky');
// $sky.prepend($('<div>').addClass('cloud-extra-small'));
// $sky.prepend($('<div>').addClass('cloud-small'));
// $sky.prepend($('<div>').addClass('cloud-medium'));
// $sky.prepend($('<div>').addClass('cloud-large'));
// $sky.prepend($('<div>').addClass('cloud-extra-large'));

mapCloudTable = Array
    .from({length: $numberOfSections}, (cloud, index) => {
            return {
                position: index * sectionWidth + Math.floor(Math.random() * sectionWidth),
                width: Math.ceil(Math.random()*10)*cloudMinWidth,
            }
    })
    .filter(cloud => Math.random() > cloudRandomizer)
    .forEach(cloud => {
        $sky
            .append($('<div>')
                .addClass('cloud')
                .css('margin-left', cloud.position)
                .css('margin-top', Math.ceil(Math.random()*10)*cloudMinWidth)
                .css('width', cloud.width)
                .css('height', cloud.width*.4)
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
