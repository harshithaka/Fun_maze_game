
       
let camera = undefined,
scene = undefined,
renderer = undefined,
light = undefined,
mouseX = undefined,
mouseY = undefined,
maze = undefined,
mazeMesh = undefined,
mazeDimension = 11,
coinMesh = undefined,
flagimag = undefined,
planeMesh = undefined,
ballMesh = undefined,
destroyerMesh = undefined,
collisioneffect = undefined,
coineffect = undefined,
flagimg = undefined,
coinRadius = 0.25,
ballRadius = 0.25,
keyAxis = [0, 0],
ironTexture = THREE.ImageUtils.loadTexture('/ball.png'),
planeTexture = THREE.ImageUtils.loadTexture('/concrete.png'),
brickTexture = THREE.ImageUtils.loadTexture('/brick.png'),
flagTexture = THREE.ImageUtils.loadTexture('/flag_end.png'),
destroyerTexture = THREE.ImageUtils.loadTexture('/spike.jfif'),
shieldTexture = THREE.ImageUtils.loadTexture('/shield.jfif'),
gameState = undefined,
destroyflag,
obstacleFlag = false,
destroyerPath = [],
noofDestroyer = undefined,
shieldPath = [],
noofShield = undefined,
phyPath = undefined,
obsatacle,
levelscore,
scores = 0;
let isLocked = false;
let isShield = false;
let isPowerOn = false;
let hitCount = 0;
let clock = undefined,
allUsersData =[];
let userData;
let g = undefined;
let m = undefined;
let startGameSound = "audio/startgame.wav"
let endGameSound = "audio/gameend.wav"
let levelCompleted = "audio/flag.wav"

// Box2D shortcuts
let b2World = Box2D.Dynamics.b2World,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2Body = Box2D.Dynamics.b2Body,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2Settings = Box2D.Common.b2Settings,
b2Vec2 = Box2D.Common.Math.b2Vec2,

// Box2D world variables 
wWorld = undefined,
wBall = undefined;
let cBall = undefined;
let dball = undefined;

let coins = [];
let shield =[];
let sound = document.createElement('audio');

function createPhysicsWorld() {
// Create the world object.
wWorld = new b2World(new b2Vec2(0, 0), true);

// Create the ball.
let bodyDef = new b2BodyDef();
bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.position.Set(1, 1);
wBall = wWorld.CreateBody(bodyDef);
let fixDef = new b2FixtureDef();
fixDef.density = 1.0;
fixDef.userData = "ball";
fixDef.friction = 0.0;
fixDef.restitution = 0.25;
fixDef.shape = new b2CircleShape(ballRadius);
wBall.CreateFixture(fixDef);

// Create the maze.
bodyDef.type = b2Body.b2_staticBody;
fixDef.shape = new b2PolygonShape();
fixDef.shape.SetAsBox(0.5, 0.5);
fixDef.userData = 'wall'
for (let i = 0; i < maze.dimension; i++) {
    for (let j = 0; j < maze.dimension; j++) {
        if (maze[i][j]) {
            bodyDef.position.x = i;
            bodyDef.position.y = j;
            wWorld.CreateBody(bodyDef).CreateFixture(fixDef);
        }

    }
}
// Create the Coin.
for (let i = 0; i < maze.dimension; i++) {
    for (let j = i + 1; j < maze.dimension; j++) {
        if (!maze[i][j]) {
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.x = i;
            bodyDef.position.y = j;
            bodyDef.userData = `${i}${j}`
            cBall = wWorld.CreateBody(bodyDef);
            fixDef.density = 1.0;
            fixDef.friction = 0.0;

            fixDef.userData = "coin";
            fixDef.restitution = 0.25;
            fixDef.shape = new b2CircleShape(coinRadius - 0.1);
            cBall.CreateFixture(fixDef);
        }

    }
}
}
const animAudio = (audiolink)=>{
const audio = new Audio(audiolink);
audio.play()
setTimeout(() => {
    audio.pause();
}, 10000);
};

function generate_maze_mesh(field) {
let dummy = new THREE.Geometry();
for (let i = 0; i < field.dimension; i++) {
    for (let j = 0; j < field.dimension; j++) {
        if (field[i][j]) {
            let geometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
            let mesh_ij = new THREE.Mesh(geometry);
            mesh_ij.position.x = i;
            mesh_ij.position.y = j;
            mesh_ij.position.z = 0.5;
            THREE.GeometryUtils.merge(dummy, mesh_ij);

        }
    }
}
let material = new THREE.MeshPhongMaterial({
    map: brickTexture
});
let mesh = new THREE.Mesh(dummy, material)
return mesh;
}
//Function to generate coins
function generate_coin_mesh(field) {
let dummy = new THREE.Geometry();
let material = new THREE.MeshLambertMaterial({
    color: 0xF5C000
});
for (let i = 0; i < field.dimension; i++) {
    for (let j = i + 1; j < field.dimension; j++) {
        if (!field[i][j]) {
            let rotate = 0.0;
            let increment = 100;
            const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.03, 100);

            let cube = new THREE.Mesh(geometry, material);

            cube.position.x = i;
            cube.position.y = j;
            cube.position.z = 0.5;
            cube.rotation.y = 0;
            cube.rotation.z = 0;
            setInterval(() => {
                cube.rotation.x = rotate += 0.4;
            }, increment);
            cube.userData = `${i}${j}`;
            coins.push(cube);
            scene.add(cube);
            
         

        }

    }
}
let coinmaterial = new THREE.Mesh(dummy, material)
return coinmaterial;
}
//Creating path for Destroyer onLoad
const obstacles = () => {
maze = generateSquareMaze(mazeDimension);

maze[mazeDimension - 1][mazeDimension - 2] = false;

let  level = Math.floor((mazeDimension - 1) / 2 - 4);

const arrOfX = [];

const cords = [];

maze.forEach((items,index) => {
    if (maze[index].indexOf(false) !== -1) {
        arrOfX.push(index);
    }
});

arrOfX.forEach((item) => {
    maze[item].forEach((items, indx) => {
        if (items === false) {
            cords.push({
                x: item,
                y: indx
            });
        }
    });
});
let obsPerLevel = level % 2 !== 0 ? level + 1 : level;

let middleIndex = Math.ceil(Math.ceil(cords.length / obsPerLevel) / 2);

const chunkArray = ((myArray, chunk_size) => {
    let results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }

    return results;
});

let result = chunkArray(cords, middleIndex);

result.forEach((item) => {
    destroyerPath.push({
        fPath: item[item.length - 1],

        oPath: item[item.length - 5],
    });
});
};
//Creating path for Shield onLoad
const shields = () => {
maze = generateSquareMaze(mazeDimension);

maze[mazeDimension - 1][mazeDimension - 2] = false;

let level = Math.floor((mazeDimension - 1) / 2 - 4);

const arrOfy = [];

const cords = [];

maze.forEach((items,index) => {
    if (maze[index].indexOf(false) !== -1) {
        arrOfy.push(index);
    }
});

arrOfy.forEach((item) => {
    maze[item].forEach((items, indx) => {
        if (items === false) {
            cords.push({
                x: item,
                y: indx
            });
        }
    });
});
let shiledPerLevel = level % 2 !== 0 ? level + 1 : level;

let middleIndex = Math.ceil(Math.ceil(cords.length / shiledPerLevel) / 2);

const chunkArray = ((myArray, chunk_size) => {
    let results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }

    return results;
});

let result = chunkArray(cords, middleIndex);

result.forEach((item) => {
    shieldPath.push({
        fPath: item[item.length - 1],

        oPath: item[item.length - 5],
    });
});
};
//Adding Destroyer
const addDestroyer = (path) => {
if (isLocked == false) {
     g = new THREE.SphereGeometry(0.3, 0.3, 0.1, 120);

     m = new THREE.MeshPhongMaterial({
        map: destroyerTexture
    });

    destroyerMesh = new THREE.Mesh(g, m);

    destroyerMesh.position.set(path.x + 0.5, path.y + 0.5, 0.3);

    scene.add(destroyerMesh);

    let bodyDef = new b2BodyDef();

    bodyDef.type = b2Body.b2_staticBody;

    bodyDef.userData = `${path.x}${path.y}`;

    bodyDef.position.Set(path.x + 0.5, path.y + 0.5, 0.3);
    dBall = wWorld.CreateBody(bodyDef);
    let fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.userData = "obstacles";
    fixDef.friction = 0.0;
    fixDef.restitution = 0.25;
    fixDef.shape = new b2CircleShape(ballRadius);
    dBall.CreateFixture(fixDef);
}

};
//Adding shield
const addShield = (path) => {
if (isShield) {
    const g = new THREE.SphereGeometry(0.3, 0.3, 0.1, 120);

   let m = new THREE.MeshPhongMaterial({
        map: shieldTexture
    });

   let shiledMesh = new THREE.Mesh(g, m);

   shiledMesh.position.set(path.x , path.y , 0.3);
   shiledMesh.userData = `${path.x}${path.y}`;
   shield.push(shiledMesh);
    scene.add(shiledMesh);

    let bodyDef = new b2BodyDef();

    bodyDef.type = b2Body.b2_staticBody;

    bodyDef.userData = `${path.x}${path.y}`;

    bodyDef.position.Set(path.x, path.y, 0.3);
    dBall = wWorld.CreateBody(bodyDef);
    let fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.userData = "Shield";
    fixDef.friction = 0.0;
    fixDef.restitution = 0.25;
    fixDef.shape = new b2CircleShape(ballRadius);
    dBall.CreateFixture(fixDef);
}

};
function createRenderWorld() {

// Create the scene object.
scene = new THREE.Scene();

// Add the light.
light = new THREE.PointLight(0xffffff, 1);
light.position.set(1, 1, 1.3);
scene.add(light);

// Add the ball.
g = new THREE.SphereGeometry(ballRadius, 32, 16);
m = new THREE.MeshPhongMaterial({
    map: ironTexture
});
ballMesh = new THREE.Mesh(g, m);
ballMesh.position.set(1, 1, ballRadius);
scene.add(ballMesh);

g = new THREE.SphereGeometry(0.3, 32, 16);
m = new THREE.MeshPhongMaterial({
    color: 0xff0000
});
collisioneffect = new THREE.Mesh(g, m);

g = new THREE.SphereGeometry(0.5, 35, 17);
m = new THREE.MeshPhongMaterial({
    color: 0xff2cf3
});
coineffect = new THREE.Mesh(g, m);

// Add the camera.
let aspect = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
camera.position.set(1, 1, 5);
scene.add(camera);

// Add the maze.
mazeMesh = generate_maze_mesh(maze);
scene.add(mazeMesh);

//Add coin maze
coinMesh = generate_coin_mesh(maze);
scene.add(coinMesh);

//Adding flag at end of game
g = new THREE.CubeGeometry(1,0.8,0.1,1,1,1);
m = new THREE.MeshPhongMaterial({
    map: flagTexture
});
 flagimag = new THREE.Mesh(g, m);
flagimag.position.set(mazeDimension - 1 , mazeDimension - 2 , 1);
// Add the ground.
g = new THREE.PlaneGeometry(mazeDimension * 10, mazeDimension * 10, mazeDimension, mazeDimension);
planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping;
planeTexture.repeat.set(mazeDimension * 5, mazeDimension * 5);
m = new THREE.MeshPhongMaterial({
    map: planeTexture
});
planeMesh = new THREE.Mesh(g, m);
planeMesh.position.set((mazeDimension - 1) / 2, (mazeDimension - 1) / 2, 0);
planeMesh.rotation.set(Math.PI / 2, 0, 0);
scene.add(planeMesh);

}

function updatePhysicsWorld() {

// Apply "friction". 
let lv = wBall.GetLinearVelocity();
lv.Multiply(0.96);
wBall.SetLinearVelocity(lv);

// Apply user-directed force.
let f = new b2Vec2(keyAxis[0] * wBall.GetMass() * 0.25, keyAxis[1] * wBall.GetMass() * 0.25);
wBall.ApplyImpulse(f, wBall.GetPosition());
keyAxis = [0, 0];

// Take a time step.
wWorld.Step(1 / 60, 8, 3);

//Adding Flag based on the condition
if(Math.floor(wBall.GetPosition().x) > mazeDimension - 5 && Math.floor(wBall.GetPosition().y) > mazeDimension - 5){
    scene.add(flagimag);
    flagimag.userData = 'flag';
}       
else{
    scene.remove(flagimag);
}
}
const coinArray = [];
const shieldArray = [];
//Collision Function
const onContact = ((contact) => {

let fixA = contact.GetFixtureA();
let fixB = contact.GetFixtureB();

if (fixA.GetUserData() === "ball" && fixB.GetUserData() === "coin") {
    let audio = new Audio('audio/coin_collection.wav');
    audio.play()
    scores = scores + 1;
    document.getElementById('score').innerHTML = "Score:" + scores;
    coinArray.push(fixB);
    ballMesh.material.map = THREE.ImageUtils.loadTexture("blue.jfif");

    ballMesh.material.needsUpdate = true;
    setTimeout(() => {

        ballMesh.material.map = THREE.ImageUtils.loadTexture('ball.png');

        ballMesh.material.needsUpdate = true;

    }, 200)
} else if (fixA.GetUserData() === "wall" && fixB.GetUserData() === "ball") {
    let hitSound = new Audio('audio/hitsound.wav');
     hitSound.play()
     if(isPowerOn == false){
     hitCount ++;
    ballMesh.material.map = THREE.ImageUtils.loadTexture("crash.png");

    ballMesh.material.needsUpdate = true;
    setTimeout(() => {
        hitCount = 0;
      
    }, 30000);
    if(hitCount > 3){
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
        mazeDimension = 11;
      
          
    }
    
    setTimeout(() => {

        ballMesh.material.map = THREE.ImageUtils.loadTexture('ball.png');

        ballMesh.material.needsUpdate = true;

    }, 200)

}
}
else if (fixA.GetUserData() === "ball" && fixB.GetUserData() === "obstacles") {
  animAudio(endGameSound);
  if(isPowerOn == false){
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    mazeDimension = 11;

       }
  
    
}
else if (fixA.GetUserData() === "ball" && fixB.GetUserData() === "Shield") {
    animAudio(endGameSound);
    shieldArray.push(fixB);
    isPowerOn = true;
    setTimeout(() => {
        isPowerOn = false;
    }, 30000);
       }
       else if (fixA.GetUserData() === "Shield" && fixB.GetUserData() === "coin") {
        gameState = 'play';
           }

});

function updateRenderWorld() {

// Update ball position.
let stepX = wBall.GetPosition().x - ballMesh.position.x;
let stepY = wBall.GetPosition().y - ballMesh.position.y;
ballMesh.position.x += stepX;
ballMesh.position.y += stepY;

// Update ball rotation.
let tempMat = new THREE.Matrix4();
tempMat.makeRotationAxis(new THREE.Vector3(0, 1, 0), stepX / ballRadius);
tempMat.multiplySelf(ballMesh.matrix);
ballMesh.matrix = tempMat;
tempMat = new THREE.Matrix4();
tempMat.makeRotationAxis(new THREE.Vector3(1, 0, 0), -stepY / ballRadius);
tempMat.multiplySelf(ballMesh.matrix);
ballMesh.matrix = tempMat;
ballMesh.rotation.getRotationFromMatrix(ballMesh.matrix);

// Update camera and light positions.
camera.position.x += (ballMesh.position.x - camera.position.x) * 0.1;
camera.position.y += (ballMesh.position.y - camera.position.y) * 0.1;
camera.position.z += (5 - camera.position.z) * 0.1;
light.position.x = camera.position.x;
light.position.y = camera.position.y;
light.position.z = camera.position.z - 3.7;
}
//TO Remove coins when ball Collides
const removeCoins = (assests) => {
if (!wWorld.IsLocked()) {
    if (assests.length > 0) {
        assests.forEach((assest) => {
            wWorld.DestroyBody(assest.m_body);
            coins.forEach((coin) => {
                if (coin.userData == assest.m_body.m_userData) {
                    scene.remove(coin);
                }
            })
        });
    }
}
}
//TO Remove shield when ball Collides
const removeShield = (assests) => {
if (!wWorld.IsLocked()) {
    if (assests.length > 0) {
        assests.forEach((assest) => {
            wWorld.DestroyBody(assest.m_body);
            shield.forEach((shield) => {
                if (shield.userData == assest.m_body.m_userData) {
                    scene.remove(shield);
                }
            })
        });
    }
}
}

function gameLoop() {

switch (gameState) {

    case 'initialize':
        animAudio(startGameSound);
        obstacles();
        shields();
        IsLocked = true;
        maze = generateSquareMaze(mazeDimension);
        maze[mazeDimension - 1][mazeDimension - 2] = false;
        createPhysicsWorld();
        createRenderWorld();
        camera.position.set(1, 1, 5);
        light.position.set(1, 1, 1.3);
        light.intensity = 0;
        let level = Math.floor((mazeDimension - 1) / 2 - 4);
        $('#level').html('Level ' + level);
        // if(level == 2){
        //     alert("hi");
        //     window.location = "home.html"
        // }
        gameState = 'fade in';
        break;

    case 'fade in':
        light.intensity += 0.1 * (1.0 - light.intensity);
        renderer.render(scene, camera);
        if (Math.abs(light.intensity - 1.0) < 0.05) {
            light.intensity = 1.0;
            gameState = 'play'
            clock = new THREE.Clock;
            clock.start();
        }
       
        break;

    case 'play':
         // Check for victory.
         let mazeX = Math.floor(ballMesh.position.x + 0.5);
         let mazeY = Math.floor(ballMesh.position.y + 0.5);
         IsLocked = false;
         isShield  = false;
         destroyerPath.forEach((item,index)=>{
            if(item.fPath.x <= mazeX && item.fPath.y <= mazeY){
                IsLocked = false;
                addDestroyer(item.oPath);
               
            }
            else if(mazeX > item.fPath.x && mazeY == item.fPath.y){
                IsLocked = true;
            }
           });
           shieldPath.forEach((item,index)=>{
            if(item.fPath.x == mazeX && item.fPath.y == mazeY){
                isShield = false;
               // addShield(item.oPath);
               
            }
            else if(mazeX > item.fPath.x && mazeY == item.fPath.y){
                isShield = true;
            }
           });

        updatePhysicsWorld();
        updateRenderWorld();
        renderer.render(scene, camera);
        let listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function (contact) {
            onContact(contact);
        }
        wWorld.SetContactListener(listener);
        removeCoins(coinArray);
        removeShield(shieldArray);
       
        if (mazeX == mazeDimension && mazeY == mazeDimension - 2) {
            mazeDimension += 2;
            animAudio(levelCompleted);
            gameState = 'fade out';
        }


        break;

    case 'fade out':
        updatePhysicsWorld();
        updateRenderWorld();
        light.intensity += 0.1 * (0.0 - light.intensity);
        renderer.render(scene, camera);
        if (Math.abs(light.intensity - 0.0) < 0.1) {
            light.intensity = 0.0;
            renderer.render(scene, camera);
            coinMesh = generate_coin_mesh(maze);
            scene.add(coinMesh);
            gameState = 'initialize';
            clock.stop();
            console.log("EndTime:",clock.getElapsedTime());
        }
        break;

}

requestAnimationFrame(gameLoop);

}

function onResize() {
renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
}

function onMoveKey(axis) {
keyAxis = axis.slice(0);
}


jQuery.fn.centerv = function () {
wh = window.innerHeight;
h = this.outerHeight();
this.css("position", "absolute");
this.css("top", Math.max(0, (wh - h) / 2) + "px");
return this;
}


jQuery.fn.centerh = function () {
ww = window.innerWidth;
w = this.outerWidth();
this.css("position", "absolute");
this.css("left", Math.max(0, (ww - w) / 2) + "px");
return this;
}


jQuery.fn.center = function () {
this.centerv();
this.centerh();
return this;
}


$(document).ready(function () {

// Prepare the instructions.
$('#instructions').center();
$('#instructions').hide();
KeyboardJS.bind.key('i', function () {
        $('#instructions').show()
    },
    function () {
        $('#instructions').hide()
    });

// Create the renderer.
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Bind keyboard and resize events.
KeyboardJS.bind.axis('left', 'right', 'down', 'up', onMoveKey);
KeyboardJS.bind.axis('h', 'l', 'j', 'k', onMoveKey);
$(window).resize(onResize);


// Set the initial game state.
gameState = 'initialize';

// Start the game loop.
requestAnimationFrame(gameLoop);

})
let popupid = document.getElementById('popup');

function show(){
document.getElementById('popup').style.display ='flex';
}
function hide() {
document.getElementById('popup').style.display ='none';
}
function goToHome(){
window.location="home.html"
}
document.getElementById('tooltiptext').style.display = "flex";
let profileInfo =[];
(function(){

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     user.providerData.forEach((profile) => {
        // console.log("  Provider-specific UID: " + profile.uid);
        // console.log("  Name: " + profile.displayName);
        // console.log("  Email: " + profile.email);
        // console.log("  Photo URL: " + profile.photoURL);
        document.getElementById("account").innerHTML =  profile.displayName[0];
        profileInfo = profile;
        let tooltip = document.querySelector('#account');
        
        event.stopPropagation();
        document.getElementById('tooltiptext').style.display = "flex";
            tooltip.addEventListener('click', function() {;
                if(event.target.id === "account"){
                    document.getElementById('tooltiptext').style.display = "flex";
                }
                let tooltiptext = document.querySelector('.tooltiptext')
                document.getElementById('tooltiptext').style.display = "flex";
            if (tooltiptext.classList.contains('active')) {
                tooltiptext.classList.remove('active');
                tooltiptext.innerHTML = " ";
            } else {
                tooltiptext.classList.add('active');
                let button = document.createElement('div');
                button.className = "button";
                button.innerHTML =  profile.displayName[0];
                tooltiptext.appendChild(button)
                let name = document.createElement('div');
                name.className ="name";
                name.innerHTML = profile.displayName
                tooltiptext.appendChild(name);
                let div = document.createElement('div');
                div.className ="email";
                div.innerHTML = profile.email
                tooltiptext.appendChild(div);
              
                let signdiv = document.createElement('div');
                signdiv.className ="sign-out";
                signdiv.innerHTML = "Sign Out"
                tooltiptext.appendChild(signdiv)
                document.querySelector('.sign-out').addEventListener('click', logout)
               // signdiv.addEventListener("click", logout());
            }
            
            });
      
      });
    } else {
      window.location = "login.html"
    }
  }); 

})()

function hideDiv(event) {
let target = event.target || event.srcElement;
// filter event handling when the event bubbles
if (event.currentTarget == target.parentElement) {
    document.getElementById('tooltiptext').style.display = "none";
    if (document.getElementById('tooltiptext').classList.contains('active')) {
        document.getElementById('tooltiptext').classList.remove('active');
        document.getElementById('tooltiptext').innerHTML = " ";
    } 
}
else{
    document.getElementById('tooltiptext').style.display = "flex";
}

}
function logout(){
window.location="login.html"
}
function GotoPage(){
// let x = document.getElementById("myAudio")
// x.play(); 
setTimeout(() => {
window.location="index.html";
}, 700);
}
function viewscore(){
document.getElementById('scorepopup').style.display ='flex';
}
function closePopup(){
document.getElementById('scorepopup').style.display ='none';
document.querySelector('#table tbody').innerHTML =""
}
