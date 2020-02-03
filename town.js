let gl;
let entities = {};
entities.houses = [];
entities.trees = [];
entities.rocks = [];
entities.river = {};
entities.attractors = [];
let debugCircleVertices = [];
let debugCircleColorPoints = [];
let selectedAttractor = -1;
let debugMode = false;
let maxRiverWidth = 0.5;
let minRiverWidth = 0.1;
let entityCount  = 30;
const debugCircleRadius = 0.11;
const maxDebugCircle = 500;
const circleVertexCount = 50;
const threshold = 2000;
const debugCircleColor = vec3(0.0, 0.0, 0.0);
const riverColor = vec3(3.0 / 255, 194.0 / 255, 252.0 / 255);
const houseRec1Color = vec3(219.0 / 255, 142.0 / 255, 33.0 / 255);
const houseRec2Color = vec3(171.0 / 255, 120.0 / 255, 48.0 / 255);
const houseFlueColor = vec3(46.0 / 255, 45.0 / 255, 43.0 / 255);
const treeColor = vec3(40.0 / 255, 122.0 / 255, 51.0 / 255);
const fruitColor = vec3(227.0 / 255, 23.0 / 255, 23.0 / 255);
const rockColor = vec3(194.0 / 255, 191.0 / 255, 184.0 / 255);
const treeRadius = debugCircleRadius / 1.3;
const fruitRadius = treeRadius / 8;
const rockRadius = debugCircleRadius / 1.3;

//This function rotates all houses with some random radiuses
function randomRotateHouses(){
    for (let i = 0; i < entities.houses.length; i++){
        let randomDegree = Math.random() * 360;
        for (let j = 0; j < entities.houses[i].rectangle1.length; j++){
            entities.houses[i].rectangle1[j] = rotateAroundPoint(entities.houses[i].rectangle1[j], entities.houses[i].centerPoint, randomDegree);
        }
        for (let j = 0; j < entities.houses[i].rectangle2.length; j++){
            entities.houses[i].rectangle2[j] = rotateAroundPoint(entities.houses[i].rectangle2[j], entities.houses[i].centerPoint, randomDegree);
        }
        for (let j = 0; j < entities.houses[i].flue.length; j++){
            entities.houses[i].flue[j] = rotateAroundPoint(entities.houses[i].flue[j], entities.houses[i].centerPoint, randomDegree);
        }
    }
}
//Rotate xy1 around xy2 by angle degree
function rotateAroundPoint(xy1, xy2, degree){
    let radian = degreeToRadian(degree);
    return vec2(Math.cos(radian) * (xy1[0] - xy2[0]) - Math.sin(radian) * (xy1[1] - xy2[1]) + xy2[0], 
    Math.sin(radian) * (xy1[0] - xy2[0]) + Math.cos(radian) * (xy1[1] - xy2[1]) + xy2[1]);
}
//Creates random river with respect to given max and min width values. 
function createRiver(){
    let riverWidth = Math.random() * (maxRiverWidth - minRiverWidth) + minRiverWidth;
    entities.river.width = riverWidth;
    let riverCordinates = [vec2(0 - riverWidth / 2, 1), vec2(0 + riverWidth / 2, 1), vec2(0 + riverWidth / 2, -1), vec2(0 - riverWidth / 2, -1)];
    entities.river.cordinates = riverCordinates; 
}
//Creates house entity with the given center cordinates
function createHouse(x, y){
    let newHouse = {};
    newHouse.centerPoint = vec2(x, y);
    newHouse.rectangle1 = [];
    newHouse.rectangle2 = [];
    newHouse.flue = [];
    let tempCor;
    //setup 2 rectangles
    //First vertices
    tempCor = vec2(x - debugCircleRadius / 1.3, y);
    newHouse.rectangle1.push(tempCor);
    newHouse.rectangle2.push(tempCor);
    //Second Vertices
    tempCor = vec2(x - debugCircleRadius / 1.3, y + debugCircleRadius / 2.0);
    newHouse.rectangle1.push(tempCor);

    tempCor = vec2(x - debugCircleRadius / 1.3, y - debugCircleRadius / 2.0);
    newHouse.rectangle2.push(tempCor);
    //Third vertices
    tempCor = vec2(x + debugCircleRadius / 1.3, y + debugCircleRadius / 2.0);
    newHouse.rectangle1.push(tempCor);

    tempCor = vec2(x + debugCircleRadius / 1.3, y - debugCircleRadius / 2.0);
    newHouse.rectangle2.push(tempCor);
    //Fourth vertices
    tempCor = vec2(x + debugCircleRadius / 1.3, y);
    newHouse.rectangle1.push(tempCor);
    newHouse.rectangle2.push(tempCor);
    // setup flue
    tempCor = vec2(x - debugCircleRadius / 2, y + debugCircleRadius / 6);
    newHouse.flue.push(tempCor);

    tempCor = vec2(x - debugCircleRadius / 2, y + debugCircleRadius / 3);
    newHouse.flue.push(tempCor);
    
    tempCor = vec2(x - debugCircleRadius / 5, y + debugCircleRadius / 3);
    newHouse.flue.push(tempCor);
    
    tempCor = vec2(x - debugCircleRadius / 5, y + debugCircleRadius / 6);
    newHouse.flue.push(tempCor);

    entities.houses.push(newHouse);
}
//Creates tree entity with the given center cordinates
function createTree(x, y){
    let newTree = {};
    newTree.centerPoint = vec2(x, y);
    newTree.fruits = [];
    let fruitCount = Math.round(Math.random() * 6 + 4);
    for (let i  = 0; i < fruitCount; i++)
    {
        let randomDirection = Math.random() * 360;
        let randomLength = Math.random() * (treeRadius - fruitRadius);
        let newFruit = {};
        newFruit.centerPoint =  vec2(x + randomLength * Math.cos(degreeToRadian(randomDirection)),
        (y + randomLength * Math.sin(degreeToRadian(randomDirection))));
        newTree.fruits.push(newFruit);
    }
    entities.trees.push(newTree);
}
//Creates rock entity with the given center cordinates
function createRock(x, y){
    let newRock = {};
    newRock.centerPoint = vec2(x, y);
    newRock.vertices = [];
    let randomLength = Math.random() * (rockRadius / 1.5) + rockRadius / 1.6;
    let randomVertexCount = Math.round(Math.random() * 4 + 5);
    let randomDegrees = [];
    for (let i = 0; i < randomVertexCount; i++){
        randomDegrees.push(Math.random() * 360);
    }
    randomDegrees.sort((a, b) => a - b);

    for (let i = 0; i < randomVertexCount; i++){
        newRock.vertices.push(vec2(x + randomLength * Math.cos(degreeToRadian(randomDegrees[i])),
        (y + randomLength * Math.sin(degreeToRadian(randomDegrees[i])))));
    }
    entities.rocks.push(newRock);
}
//Calculates distance between two points
function calculateDistanceBetweenTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
// Calculates if the given cordinate collision with any exist entity
function calculateCollisionBetweenEntities(x, y){
    for (let i = 0; i < entities.houses.length; i++){
        if (calculateDistanceBetweenTwoPoints(x, y, entities.houses[i].centerPoint[0], entities.houses[i].centerPoint[1]) < debugCircleRadius * 2){
            return false;
        }
    }
    for (let i = 0; i < entities.trees.length; i++){
        if (calculateDistanceBetweenTwoPoints(x, y, entities.trees[i].centerPoint[0], entities.trees[i].centerPoint[1]) < debugCircleRadius * 2){
            return false;
        }
    }
    for (let i = 0; i < entities.rocks.length; i++){
        if (calculateDistanceBetweenTwoPoints(x, y, entities.rocks[i].centerPoint[0], entities.rocks[i].centerPoint[1]) < debugCircleRadius * 2){
            return false;
        }
    }
    return true;
}
// Generates random cordinate on terrain
function generateRandomCordinateOnTerrain(){
    let randomTemp = Math.random();
    let riverWidthDividedHalf = entities.river.width / 2;
    //Left side is chosen
    if (randomTemp < 0.5){
        return vec2((Math.random() * (1 - debugCircleRadius * 2 - riverWidthDividedHalf)) - 1 + debugCircleRadius, (Math.random() * (2 - debugCircleRadius * 2)) - 1 + debugCircleRadius);
    }
    return vec2((Math.random() * (1 - debugCircleRadius * 2- riverWidthDividedHalf)) + riverWidthDividedHalf + debugCircleRadius, (Math.random() * (2 - debugCircleRadius * 2)) - 1 + debugCircleRadius);
}
// Creates random entity according to attractors
function createRandomEntity(x, y){
    if (entities.attractors.length == 0){
        return;
    }
    let houseProb = 0;
    let treeProb = 0;
    let rockProb = 0;
    for (let i = 0; i < entities.attractors.length; i++)
    {
        let tempDistance = calculateDistanceBetweenTwoPoints(x, y, entities.attractors[i].cordinates[0], entities.attractors[i].cordinates[1]);
        if (entities.attractors[i].type == "house"){
            houseProb += tempDistance / Math.pow(tempDistance, 2);
        }
        else if (entities.attractors[i].type == "tree"){
            treeProb += tempDistance / Math.pow(tempDistance, 2);
        }
        else if (entities.attractors[i].type == "rock"){
            rockProb += tempDistance / Math.pow(tempDistance, 2);
        }
    }
    let randomResult = Math.random() * (houseProb + treeProb + rockProb);
    if (randomResult < houseProb){
        createHouse(x, y);
    }
    else if (randomResult > houseProb + treeProb){
        createRock(x, y);
    }
    else{
        createTree(x, y);
    }
}
//Generates village with the current attributes 
function generateVillage(){
    if (entities.attractors.length == 0){
        entities.river = {};
        createRiver();
        return;
    }
    entities.trees = [];
    entities.houses = [];
    entities.rocks = [];
    entities.river = {};
    createRiver();
    for (let i = 0; i < threshold; i++){
        let tempPoint = generateRandomCordinateOnTerrain();
        if (calculateCollisionBetweenEntities(tempPoint[0], tempPoint[1]))
        {
            createRandomEntity(tempPoint[0], tempPoint[1]);
        }
        if (entities.houses.length + entities.rocks.length + entities.trees.length >= entityCount){
            break;
        }
    }
    randomRotateHouses();
}
//Draws all debug circles for debug mode
function drawDebugCircles(gl, program){
    let vertices = [];
    let colors = [];
    
    for(let i = 0; i < entities.houses.length; i++){
        for (let j = 0; j < circleVertexCount; j++){
            let tempCor = vec2(entities.houses[i].centerPoint[0] + debugCircleRadius * Math.cos(degreeToRadian(360 / circleVertexCount * j)),
            (entities.houses[i].centerPoint[1] + debugCircleRadius * Math.sin(degreeToRadian(360 / circleVertexCount * j))));
            vertices.push(tempCor);
            colors.push(debugCircleColor);
        }
    }
    for(let i = 0; i < entities.trees.length; i++){
        for (let j = 0; j < circleVertexCount; j++){
            let tempCor = vec2(entities.trees[i].centerPoint[0] + debugCircleRadius * Math.cos(degreeToRadian(360 / circleVertexCount * j)),
            (entities.trees[i].centerPoint[1] + debugCircleRadius * Math.sin(degreeToRadian(360 / circleVertexCount * j))));
            vertices.push(tempCor);
            colors.push(debugCircleColor);
        }
    }
    for(let i = 0; i < entities.rocks.length; i++){
        for (let j = 0; j < circleVertexCount; j++){
            let tempCor = vec2(entities.rocks[i].centerPoint[0] + debugCircleRadius * Math.cos(degreeToRadian(360 / circleVertexCount * j)),
            (entities.rocks[i].centerPoint[1] + debugCircleRadius * Math.sin(degreeToRadian(360 / circleVertexCount * j))));
            vertices.push(tempCor);
            colors.push(debugCircleColor);
        }
    }
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   
    gl.enableVertexAttribArray( vPosition );
    for(let i = 0; i < (vertices.length / circleVertexCount); i++){
        gl.drawArrays( gl.LINE_LOOP, i * circleVertexCount, circleVertexCount);
    }  
}
//draws all tree entities
function drawTrees(gl, program){
    let vertices = [];
    let colors = [];
    
    for(let i = 0; i < entities.trees.length; i++){
        for (let j = 0; j < circleVertexCount; j++){
            let tempCor = vec2(entities.trees[i].centerPoint[0] + treeRadius * Math.cos(degreeToRadian(360 / circleVertexCount * j)),
            (entities.trees[i].centerPoint[1] + treeRadius * Math.sin(degreeToRadian(360 / circleVertexCount * j))));
            vertices.push(tempCor);
            colors.push(treeColor);
        }
        // Put fruits
        for(let j = 0; j < entities.trees[i].fruits.length; j++){
            for (let k = 0; k < circleVertexCount; k++){
                let tempCor = vec2(entities.trees[i].fruits[j].centerPoint[0] + fruitRadius * Math.cos(degreeToRadian(360 / circleVertexCount * k)),
                (entities.trees[i].fruits[j].centerPoint[1] + fruitRadius * Math.sin(degreeToRadian(360 / circleVertexCount * k))));
                vertices.push(tempCor);
                colors.push(fruitColor);
            }
        }
    }
    
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   
    gl.enableVertexAttribArray( vPosition );
    for(let i = 0; i < (vertices.length / circleVertexCount); i++){
        gl.drawArrays( gl.TRIANGLE_FAN, i * circleVertexCount, circleVertexCount);
    }  
}
//Draws all house entities.
function drawHouses(gl, program){
    let vertices = [];
    let colors = [];
    for (let i = 0; i < entities.houses.length; i++){
        for (let j = 0; j < entities.houses[i].rectangle1.length; j++){
            vertices.push(entities.houses[i].rectangle1[j]);
            colors.push(houseRec1Color);
        }
        for (let j = 0; j < entities.houses[i].rectangle2.length; j++){
            vertices.push(entities.houses[i].rectangle2[j]);
            colors.push(houseRec2Color);
        }
        for (let j = 0; j < entities.houses[i].flue.length; j++){
            vertices.push(entities.houses[i].flue[j]);
            colors.push(houseFlueColor);
        }
    }
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   
    gl.enableVertexAttribArray( vPosition );
    

    for (let i = 0; i < entities.houses.length; i++){
        for (let j = 0; j < 3; j++){
            gl.drawArrays( gl.TRIANGLE_FAN, (i * 12) + 4 * j, 4);
        }
    }
}
//Draws all rock entities
function drawRocks(gl, program){
    let vertices = [];
    let colors = [];
    for (let i = 0; i < entities.rocks.length; i++){
        for (let j = 0; j < entities.rocks[i].vertices.length; j++){
            vertices.push(entities.rocks[i].vertices[j]);
            colors.push(rockColor);
        }
    }
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   
    gl.enableVertexAttribArray( vPosition );
    

    let tracer = 0;
    for (let i = 0; i < entities.rocks.length; i++){
        gl.drawArrays( gl.TRIANGLE_FAN, tracer, entities.rocks[i].vertices.length);
        tracer += entities.rocks[i].vertices.length;
    }
}
//Draw current river
function drawRiver(gl, program){
    let vertices = [];
    let colors = [];
    for (let i = 0; i < entities.river.cordinates.length; i++){
        vertices.push(entities.river.cordinates[i]);
        colors.push(riverColor);
    }
    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );   
    gl.enableVertexAttribArray( vPosition );
    

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
}
//Function to transform degree to radian
function degreeToRadian(degree)
{
    return degree * Math.PI / 180;
}

//citation: https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
//Download function for save file download
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//Calls all draw functions to draw everything.
function render(gl, program){
    gl.clear( gl.COLOR_BUFFER_BIT );
    drawHouses(gl, program);
    drawTrees(gl, program);
    drawRiver(gl, program);
    drawRocks(gl, program);
    if (debugMode){
        drawDebugCircles(gl, program);
    }
}

window.onload = function init()
{
    let canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" );
    }

    //Attractor selector citation: code example cad2
    let menu = document.getElementById("mymenu");
    menu.addEventListener("click", function() {
        selectedAttractor = menu.selectedIndex;
        });
    
    canvas.addEventListener("mousedown", function(event){
        if (selectedAttractor != -1)
        {
            let newAttractor = {};
            if (selectedAttractor == 0)
            {
                newAttractor.type = "house";
            }
            else if (selectedAttractor == 1)
            {
                newAttractor.type = "tree";
            }
            else if (selectedAttractor == 2)
            {
                newAttractor.type = "rock";
            }
            newAttractor.cordinates = vec2(2*event.clientX/canvas.width-1, 
                (2*(canvas.height-event.clientY)/canvas.height)-1);
            entities.attractors.push(newAttractor);
            generateVillage();
            render(gl, program);
        }  
    } );
    //Checkbox for debug mode
    let checkbox = document.getElementById("checkbox");
    checkbox.addEventListener( 'change', function() {
    if(this.checked) {
        debugMode = true;
        render(gl, program);
    } else {
        debugMode = false;
        render(gl, program);
    }
    });
    // Save button
    let button1 = document.getElementById("Button1")
    button1.addEventListener("click", function(){
        let saveText = JSON.stringify(entities);
        download(saveText, 'town.txt', 'text/plain');
    });
    // Load button
    let button2 = document.getElementById("Button2")
    button2.addEventListener("change", function(){
        let fr = new FileReader();
        fr.onload = function(){
            entities = JSON.parse(this.result);
            render(gl, program);
        }
        fr.readAsText(this.files[0]);
    });
    // Entity number 
    let entityInput = document.getElementById("entitynumber");
    entityInput.addEventListener( 'change', function() {
        entityCount = entityInput.value;
        generateVillage();
        render(gl, program);
    });
    // Minimum river width
    let minRiverInput = document.getElementById("minriver");
    minRiverInput.addEventListener( 'change', function() {
        minRiverWidth = minRiverInput.value / 10.0;
        generateVillage();
        render(gl, program);
    });
    // Maximum river width
    let maxriverInput = document.getElementById("maxriver");
    maxriverInput.addEventListener( 'change', function() {
        maxRiverWidth = maxriverInput.value / 10.0;
        generateVillage();
        render(gl, program);
    });
    

    


    gl.viewport( 0, 0, canvas.width, canvas.height );
    //terrain color
    gl.clearColor(88 / 255, 168 / 255, 50 / 255, 1.0 );


    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    createRiver();
    render(gl, program);
};