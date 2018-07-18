
const obstacleWidth = 80;
const obstacleMinHeight = 60;
const mapWidth = 7000;
const mapHeight = 350;
const numberOfObstacle = mapWidth/100

$('#map').css({width: mapWidth,
               height: mapHeight})

const mapObjectTable = []
for (var i = 0; i < numberOfObstacle; i++) {

    mapObjectTable.push({
        position: Math.floor(Math.random()*obstacleWidth),
        height: Math.floor((Math.random()*2+1))*obstacleMinHeight
    })
}

for (i = 0; i <numberOfObstacle; i++) {

    $('#map').append($('<div>')
        .addClass('obstacle')
        .css('margin-left', i*200+mapObjectTable[i].position)
        .css('height', mapObjectTable[i].height))
}

/*####################PONIŻEJ LINIE POMOCNICZE ######################*/

$('body').append($('<div>').addClass('odnosnik'))

for (i = 0; i <numberOfObstacle; i++) {

    $('.odnosnik').append($('<div>').addClass('linia'))
}
