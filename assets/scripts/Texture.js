/**
 * Created by YuChang on 2017/5/13.
 */

/* Todo: round radian to [0, 2*pi] */
function update() {

}

var key = new Array();
for(var i = 0; i < 1024; i ++) key[i] = false;

scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
var camera = {};

function init(windowWidth, windowHeight){
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio); //
    renderer.setClearColor(new THREE.Color(255, 255, 255), 0.0);
    renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(renderer.domElement); //

    camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 1000);

    var target = new THREE.Vector3(0, 0, 0);
    var position = new THREE.Vector3(-0.7, 35.7, 28.7);

    camera.position.set(position.x, position.y, position.z); // Can't use new THREE.Vector3().
    camera.lookAt(target);
    camera.UP = new THREE.Vector3(0, 1, 0);
    camera.FRONT = new THREE.Vector3(target.x - position.x, target.y - position.y, target.z - position.z);
    camera.FRONT.normalize();

    camera.FRONT = camera.FRONT.normalize();
    camera.PITCH = Math.asin(camera.FRONT.y);
    var sinYAW = camera.FRONT.z / Math.cos(camera.PITCH);
    var cosYAW = camera.FRONT.x / Math.cos(camera.PITCH);
    if(cosYAW > 0) camera.YAW = Math.asin(sinYAW);
    else camera.YAW = Math.PI - Math.asin(sinYAW);
}
init(window.innerWidth, window.innerHeight);

/* Camera zoom */
var zoom = camera.fov;

/* For mobile touch */
var camPos = {};
function initCamPos(pos){
    camPos.pitch = camPos.yaw = 0.0;
    camPos.len = pos.length();
    pos.normalize();

    camPos.pitch = Math.asin(pos.y);
    camPos.cosyaw = pos.x / Math.cos(camPos.pitch);
    camPos.sinyaw = pos.z / Math.cos(camPos.pitch);
    if(camPos.cosyaw > 0) camPos.yaw = Math.asin(camPos.sinyaw);
    else camPos.yaw = Math.PI - Math.asin(camPos.sinyaw);
}
initCamPos(camera.position.clone());

function StencilTesting() {
    var stuff = [];
    var geometry = [
        new THREE.PlaneGeometry(500, 500),
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.SphereGeometry(5, 50, 50)
    ];

    var texture = [
        new THREE.TextureLoader().load("/assets/imgs/horse.jpg"),
        new THREE.TextureLoader().load("/assets/imgs/awesomeface.png"),
        new THREE.TextureLoader().load("/assets/imgs/face.gif"),
        new THREE.TextureLoader().load("/assets/imgs/couple.jpg"),
        new THREE.TextureLoader().load("/assets/imgs/earth_big.jpg"),
        new THREE.TextureLoader().load("/assets/imgs/alpha.png"),
        new THREE.TextureLoader().load("/assets/imgs/normal.jpg")
    ];

    texture[0].wrapS = texture[0].wrapT = THREE.RepeatWrapping;
    texture[0].repeat.set(10, 10);

    // texture[5].needsUpdate = true; // ???
    texture[5].magFilter = THREE.NearestFilter; // Sharp edge.
    texture[5].wrapT = THREE.RepeatWrapping;
    texture[5].repeat.y = 1;
    var material = [
        new THREE.MeshPhongMaterial({map: texture[0], side: THREE.DoubleSide, wireframe: false}),
        new THREE.MeshPhongMaterial({map: texture[1], transparent: true, alphaTest: 0.5, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({color: "rgb(200, 100, 100)", side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({map: texture[2], side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({map: texture[3], side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({map: texture[4], side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({map: texture[4], alphaMap: texture[5], alphaTest: 0.5, side: THREE.DoubleSide}),
        new THREE.MeshPhongMaterial({map: texture[3], bumpMap: texture[6], side: THREE.DoubleSide})
    ];
    // material[3].map.needsUpdate = true; ???
    // material[6].needsUpdate = true;

    /* Add plane */
    var plane = new THREE.Mesh(geometry[0], material[0]);
    plane.position.y -= 0.5 + 0.0001;
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    /* Add Boxes */
    stuff[0] = new THREE.Mesh(geometry[1], material[1]);
    stuff[1] = new THREE.Mesh(geometry[1], material[4]);
    stuff[0].position.set(0, 3, 0);
    stuff[1].position.set(-8, 2.5, 0);

    /* Add spheres */
    stuff[2] = new THREE.Mesh(geometry[2], material[5]);
    stuff[2].position.set(0, 5, -10);
    stuff[3] = new THREE.Mesh(geometry[2], material[6]);
    stuff[3].position.set(-12, 5, -10);
    stuff[4] = new THREE.Mesh(geometry[2], material[5]);
    stuff[4].scale.set(100, 100, 100);
    for(var i in stuff) scene.add(stuff[i]);

    /* Add Light */
    scene.add(new THREE.AmbientLight(0x303030));
    var DirLight = new THREE.DirectionalLight(0xffffff, 1);
    DirLight.position.set(10, 8, 4);
    scene.add(DirLight);

    /* Shadow */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; //
    DirLight.castShadow = true;

    DirLight.shadow.mapSize.width = 2048; // shadow quality
    DirLight.shadow.mapSize.height = 2048;
    DirLight.shadow.camera.near = 0.1;
    DirLight.shadow.camera.far = 50;

    // bottom < top && left < right
    var side = 20;
    DirLight.shadow.camera.bottom = -side;
    DirLight.shadow.camera.top = side;
    DirLight.shadow.camera.left = -side;
    DirLight.shadow.camera.right = side;

    // DirLight.shadow.camera.updateProjectionMatrix();

    /* Add Helpers */
    // scene.add(new THREE.AxisHelper(30));
    // scene.add(new THREE.DirectionalLightHelper(DirLight, 3));
    // scene.add(new THREE.CameraHelper(DirLight.shadow.camera));

    for(var i in stuff) {
        stuff[i].castShadow = true;
        stuff[i].receiveShadow = true;
    }
    plane.receiveShadow = true;

    var gl = renderer.context;

    function render() {
        cameraMove();
        cameraRotate();
        cameraZoom();

        texture[5].offset.y += 0.01;
        // console.log(texture[5].offset.y);

        stuff[0].rotation.x += 0.01;
        stuff[0].rotation.y += 0.01;
        if(stuff[0].x > Math.PI * 2) stuff[0].x -= Math.PI * 2;
        if(stuff[0].y > Math.PI * 2) stuff[0].y -= Math.PI * 2;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    render();
}

/* Camera controls */
function cameraMove(){
    var scale = 0.2;
    if(key[KEY['W']]) {
        camera.position.addScaledVector(camera.FRONT, scale);
    }
    if(key[KEY['S']]){
        var BACK = camera.FRONT.clone();
        BACK.negate();
        camera.position.addScaledVector(BACK, scale);
    }
    if(key[KEY['A']]){
        var LEFT = new THREE.Vector3();
        LEFT.crossVectors(camera.UP, camera.FRONT);
        LEFT.normalize();
        camera.position.addScaledVector(LEFT, scale);
    }
    if(key[KEY['D']]){
        var RIGHT = new THREE.Vector3();
        RIGHT.crossVectors(camera.UP, camera.FRONT);
        RIGHT.normalize();
        RIGHT.negate();

        camera.position.addScaledVector(RIGHT, scale);
    }
    if(key[KEY['SHIFT']]){
        var DOWN = camera.UP.clone();
        DOWN.negate();
        camera.position.addScaledVector(DOWN, scale);
    }
    if(key[KEY['SPACE']]){
        var UP = camera.UP.clone();
        camera.position.addScaledVector(UP, scale);
    }
    // if(
    //     key[KEY['W']]
    //     || key[KEY['S']]
    //     || key[KEY['A']]
    //     || key[KEY['D']]
    //     || key[KEY['SHIFT']]
    //     || key[KEY['SPACE']]
    // ) {
    //     console.log("(" + camera.position.x + ", " + camera.position.y + ", " + camera.position.z + ")");
    // }
}

function cameraRotate() {
    if(isMobile === false){
        var tar = new THREE.Vector3();
        tar.addVectors(camera.position , camera.FRONT);
        camera.lookAt(tar);
    }else{
        camera.position.set(camPos.len * Math.cos(camPos.pitch) * Math.cos(camPos.yaw), camPos.len * Math.sin(camPos.pitch), camPos.len * Math.cos(camPos.pitch) * Math.sin(camPos.yaw));
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

function cameraZoom(){
    camera.fov = zoom;
    camera.updateProjectionMatrix(); // necessarily
}

/* Keyboard event */
function onKeyDown(e) {
    key[e.keyCode] = true;
}

function  onKeyUp(e) {
    key[e.keyCode] = false;
}

/* Mouse drag event */
var drag = false;
var last = {}, delta = {};

function onMouseMove(e) {
    if(drag){
        delta.x = e.clientX - last.x;
        delta.y = e.clientY - last.y;

        last.x = e.clientX;
        last.y = e.clientY;

        var speed = 0.001;
        var MAX_ANGLE = 89.0 / 180 * Math.PI;

        camera.PITCH -= speed * delta.y;
        camera.YAW += speed *  delta.x;

        if(camera.PITCH > MAX_ANGLE) camera.PITCH = MAX_ANGLE;
        else if(camera.PITCH < -MAX_ANGLE) camera.PITCH = -MAX_ANGLE;

        camera.FRONT.y = Math.sin(camera.PITCH);
        camera.FRONT.x = Math.cos(camera.PITCH) * Math.cos(camera.YAW);
        camera.FRONT.z = Math.cos(camera.PITCH) * Math.sin(camera.YAW);
        camera.FRONT.normalize();
    }
}

function onMouseDown(e) {
    drag = true;
    last.x = e.clientX;
    last.y = e.clientY;
}

function onMouseUp(){
    drag = false;
}

/* Mobile touch event */
var touch = false, dis = 0.0;
var la = {}, del = {};

function onTouchMove(e) {
    if(touch){
        if(e.touches.length === 1){
            del.x = e.touches[0].clientX - la.x;
            del.y = e.touches[0].clientY - la.y;

            la.x = e.touches[0].clientX;
            la.y = e.touches[0].clientY;

            var speed = 0.01;
            var MAX_ANGLE = 89.0 / 180 * Math.PI;

            pos = camera.position.clone();
            camPos.len = pos.length();
            pos.normalize();
            camPos.pitch = Math.asin(pos.y);
            camPos.cosyaw = pos.x / Math.cos(camPos.pitch);
            camPos.sinyaw = pos.z / Math.cos(camPos.pitch);
            if(camPos.cosyaw > 0) camPos.yaw = Math.asin(camPos.sinyaw);
            else camPos.yaw = Math.PI - Math.asin(camPos.sinyaw);
            camPos.pitch += speed * del.y;
            camPos.yaw += speed * del.x;
            if(camPos.pitch > MAX_ANGLE) camPos.pitch = MAX_ANGLE;
            else if(camPos.pitch < -MAX_ANGLE) camPos.pitch = -MAX_ANGLE;
        }
        else if(e.touches.length > 1){
            var x0 = e.touches[0].clientX;
            var y0 = e.touches[0].clientY;
            var x1 = e.touches[1].clientX;
            var y1 = e.touches[1].clientY;

            var speed = 0.1;

            var disNow = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
            zoom +=  (dis - disNow) * speed;
            if(zoom > 170.0){
                zoom = 170.0;
            }else if(zoom < 1.0){
                zoom = 1.0;
            }
            dis = disNow;
        }
    }
}

function onTouchStart(e){
    touch = true;
    if(e.touches.length === 1){
        la.x = e.touches[0].clientX;
        la.y = e.touches[0].clientY;
    }
    else if(e.touches.length > 1){
        var x0 = e.touches[0].clientX;
        var y0 = e.touches[0].clientY;
        var x1 = e.touches[1].clientX;
        var y1 = e.touches[1].clientY;

        dis = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    }
}

function onTouchEnd() {
    touch = false;
}

/* Mouse wheel event */
function onWheel(e) {
    var speed = 0.01;
    zoom += e.deltaY * speed;
    if(zoom > 170.0){
        zoom = 170.0;
    }else if(zoom < 1.0){
        zoom = 1.0;
    }
}

/* Window resize event */
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);

window.addEventListener("touchmove", onTouchMove, passiveSupported
    ? { passive: true } : false);
window.addEventListener("touchstart", onTouchStart, passiveSupported
    ? { passive: true } : false);
window.addEventListener("touchend", onTouchEnd, passiveSupported
    ? { passive: true } : false);

window.addEventListener("wheel", onWheel, false);

window.addEventListener("resize", onWindowResize, false);

StencilTesting();