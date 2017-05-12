/**
 * Created by YuCrazing on 2017/5/9.
 */
var key = new Array();
for(var i = 0; i < 1024; i ++) key[i] = false;

var th = THREE;
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

var camera = {};
function init(windowWidth, windowHeight){

    /* Texture */
    // var img =

    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio); //
    renderer.setClearColor(new THREE.Color(255, 255, 255), 0.0);
    renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(renderer.domElement); //

    camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 1000);

    var target = new THREE.Vector3(0, 0, 0);
    var position = new THREE.Vector3(1, 1, 5);

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

/* For mobile touch */
var pitch = 0.0, yaw = 0.0, len = 0.0;
var pos = camera.position.clone();
len = pos.length();
pos.normalize();
pitch = Math.asin(pos.y);
var cosyaw = pos.x / Math.cos(pitch);
var sinyaw = pos.z / Math.cos(pitch);
if(cosyaw > 0) yaw = Math.asin(sinyaw);
else yaw = Math.PI - Math.asin(sinyaw);

function StencilTesting() {
    var cube = new Array();
    var geometry = new th.CubeGeometry(1, 1, 1);
    var material = new th.MeshStandardMaterial({color: "rgb(200, 100, 100)"});
    var Edge = new th.MeshBasicMaterial({color: "rgb(255, 255, 255)"});
    cube[0] = new th.Mesh(geometry, material);
    cube[1] = new th.Mesh(geometry, material);

    cube[1].position.set(-2, 0, 0);

    var geo = new th.SphereGeometry(1, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    var mat = new th.MeshPhongMaterial({color: "rgb(200, 100, 100)"});
    var sphere = new th.Mesh(geo, mat);
    sphere.position.set(0, 0, -6);

    scene.add(cube[0]);
    scene.add(cube[1]);
    scene.add(sphere);

    var axisScene = new th.Scene();
    axisScene.add(new th.AxisHelper(3));

    var DirLight = new THREE.DirectionalLight(0xffffff, 1);
    DirLight.position.set(10, 8, 4);

    scene.add(DirLight);
    scene.add(new THREE.DirectionalLightHelper(DirLight, 3));

    var gl = renderer.context;

    var scale = {
        x: 1.05,
        y: 1.05,
        z: 1.05
    };

    gl.enable(gl.STENCIL_TEST);
    gl.enable(gl.DEPTH_TEST);
    function render() {
        cameraMove();
        cameraRotate();
        cameraZoom();

        cube[0].rotation.x += 0.01;
        cube[0].rotation.y += 0.01;

        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        renderer.render(scene, camera);

        for(var i = 0; i < 2; i++){
            cube[i].scale.x *= scale.x;
            cube[i].scale.y *= scale.y;
            cube[i].scale.z *= scale.z;
        }

        sphere.scale.x *= scale.x;
        sphere.scale.y *= scale.y;
        sphere.scale.z *= scale.z;

        // cube.material.color.setRGB(0.4, 0.8, 0.4); // WTF !!!

        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
        gl.disable(gl.DEPTH_TEST);
        renderer.render(axisScene, camera);
        cube[0].material = Edge;
        cube[1].material = Edge;
        sphere.material = Edge;
        renderer.render(scene, camera);
        cube[0].material = material;
        cube[1].material = material;
        sphere.material = material;
        gl.enable(gl.DEPTH_TEST);

        for(var i = 0; i < 2; i++){
            cube[i].scale.x /= scale.x;
            cube[i].scale.y /= scale.y;
            cube[i].scale.z /= scale.z;
        }

        sphere.scale.x /= scale.x;
        sphere.scale.y /= scale.y;
        sphere.scale.z /= scale.z;

        requestAnimationFrame(render);
    }
    render();
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

function cameraMove(){
    var scale = 0.05;
    if(key[KEY['W']]) {
        var FRONT = new THREE.Vector3();
        FRONT.addScaledVector(camera.FRONT, scale);

        camera.position.add(FRONT);
    }
    if(key[KEY['S']]){
        var BACK = new THREE.Vector3();
        BACK.addScaledVector(camera.FRONT, scale);
        BACK.negate();

        camera.position.add(BACK);
    }
    if(key[KEY['A']]){
        var LEFT = new THREE.Vector3();
        LEFT.crossVectors(camera.UP, camera.FRONT);
        LEFT.normalize();
        LEFT.multiplyScalar(scale);

        camera.position.add(LEFT);
    }
    if(key[KEY['D']]){
        var RIGHT = new THREE.Vector3();
        RIGHT.crossVectors(camera.UP, camera.FRONT);
        RIGHT.normalize();
        RIGHT.multiplyScalar(scale);
        RIGHT.negate();

        camera.position.add(RIGHT);
    }
    if(key[KEY['SHIFT']]){
        var DOWN = camera.UP.clone();
        DOWN.multiplyScalar(scale);
        DOWN.negate();

        camera.position.add(DOWN);
    }
    if(key[KEY['SPACE']]){
        var UP = camera.UP.clone();
        UP.multiplyScalar(scale);

        camera.position.add(UP);
    }
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onKeyDown(e) {
    key[e.keyCode] = true;
}

function  onKeyUp(e) {
    key[e.keyCode] = false;
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);


function cameraRotate() {
    if(isMobile === false){
        var tar = new THREE.Vector3(
            camera.position.x + camera.FRONT.x,
            camera.position.y + camera.FRONT.y,
            camera.position.z + camera.FRONT.z
        );
        camera.lookAt(tar);
    }else{
        camera.position.set(len * Math.cos(pitch) * Math.cos(yaw), len * Math.sin(pitch), len * Math.cos(pitch) * Math.sin(yaw));
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

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

var zoom = camera.fov;
function cameraZoom(){
    camera.fov = zoom;

    camera.updateProjectionMatrix();
}
function onWheel(e) {
    var speed = 0.01;
    zoom += e.deltaY * speed;
    if(zoom > 170.0){
        zoom = 170.0;
    }else if(zoom < 1.0){
        zoom = 1.0;
    }
}

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
            len = pos.length();
            pos.normalize();
            pitch = Math.asin(pos.y);
            cosyaw = pos.x / Math.cos(pitch);
            sinyaw = pos.z / Math.cos(pitch);
            if(cosyaw > 0) yaw = Math.asin(sinyaw);
            else yaw = Math.PI - Math.asin(sinyaw);
            pitch += speed * del.y;
            yaw += speed * del.x;
            if(pitch > MAX_ANGLE) pitch = MAX_ANGLE;
            else if(pitch < -MAX_ANGLE) pitch = -MAX_ANGLE;
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

window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("wheel", onWheel, false);

window.addEventListener("touchmove", onTouchMove, passiveSupported
    ? { passive: true } : false);
window.addEventListener("touchstart", onTouchStart, passiveSupported
    ? { passive: true } : false);
window.addEventListener("touchend", onTouchEnd, passiveSupported
    ? { passive: true } : false);

StencilTesting();