/**
 * Created by YuCrazing on 2017/5/11.
 */
/**
 * Created by YuCrazing on 2017/5/9.
 */

var key = new Array();
for(var i = 0; i < 1024; i ++) key[i] = false;

var th = THREE;
var Scene = {};
Scene.init = function (windowWidth, windowHeight){
    Scene.scene = new THREE.Scene();
    Scene.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    Scene.renderer.autoClear = false;
    Scene.renderer.setPixelRatio(window.devicePixelRatio); //
    Scene.renderer.setClearColor(new THREE.Color(255, 255, 255), 0.0);
    Scene.renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(Scene.renderer.domElement); //


    var target = new THREE.Vector3(0, 0, 0);
    var position = new THREE.Vector3(3, 2, 5);
    Scene.camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 1000);
    Scene.camera.position.set(position.x, position.y, position.z); // Can't use new THREE.Vector3().
    Scene.camera.lookAt(target);
    Scene.camera.UP = new THREE.Vector3(0, 1, 0);
    Scene.camera.FRONT = new THREE.Vector3(target.x - position.x, target.y - position.y, target.z - position.z);
    Scene.camera.FRONT.normalize();

    Scene.camera.FRONT = Scene.camera.FRONT.normalize();
    Scene.camera.PITCH = Math.asin(Scene.camera.FRONT.y);
    var sinYAW = Scene.camera.FRONT.z / Math.cos(Scene.camera.PITCH);
    var cosYAW = Scene.camera.FRONT.x / Math.cos(Scene.camera.PITCH);
    if(cosYAW > 0) Scene.camera.YAW = Math.asin(sinYAW);
    else Scene.camera.YAW = Math.PI - Math.asin(sinYAW);
};
Scene.init(window.innerWidth, window.innerHeight);

function rotateCube() {
    var geometry = new th.CubeGeometry(1, 1, 1);
    var material = new th.MeshPhongMaterial({color: "rgb(200, 100, 100)"});
    var Edge = new th.MeshBasicMaterial({color: "rgb(255, 255, 255)"});
    var cube = new th.Mesh(geometry, material);
    Scene.scene.add(cube);

    var axisScene = new th.Scene();
    axisScene.add(new th.AxisHelper(3));

    var DirLight = new THREE.DirectionalLight(0xffffff, 1);
    DirLight.position.set(10, 8, 4);

    DirLight.target = cube;
    Scene.scene.add(DirLight);
    Scene.scene.add(new THREE.DirectionalLightHelper(DirLight, 3));

    var gl = Scene.renderer.context;

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

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;


        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        Scene.renderer.render(Scene.scene, Scene.camera);

        cube.scale.x *= scale.x;
        cube.scale.y *= scale.y;
        cube.scale.z *= scale.z;

        // cube.material.color.setRGB(0.4, 0.8, 0.4); // WTF !!!

        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilFunc(gl.NOTEQUAL, 1, 0xFF);
        gl.disable(gl.DEPTH_TEST);
        Scene.renderer.render(axisScene, Scene.camera);
        cube.material = Edge;
        Scene.renderer.render(Scene.scene, Scene.camera);
        cube.material = material;
        gl.enable(gl.DEPTH_TEST);

        cube.scale.x /= scale.x;
        cube.scale.y /= scale.y;
        cube.scale.z /= scale.z;
        // cube.material.color.setRGB(0.4, 0.8, 0.4); // WTF !!!

        requestAnimationFrame(render);
    };
    render();
};
rotateCube();

function onWindowResize(){
    Scene.camera.aspect = window.innerWidth / window.innerHeight;
    Scene.camera.updateProjectionMatrix();
    Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

function cameraMove(){
    var scale = 0.05;
    if(key[KEY['W']]) {
        var FRONT = new THREE.Vector3();
        FRONT.addScaledVector(Scene.camera.FRONT, scale);

        Scene.camera.position.add(FRONT);
    }
    if(key[KEY['S']]){
        var BACK = new THREE.Vector3();
        BACK.addScaledVector(Scene.camera.FRONT, scale);
        BACK.negate();

        Scene.camera.position.add(BACK);
    }
    if(key[KEY['A']]){
        var LEFT = new THREE.Vector3();
        LEFT.crossVectors(Scene.camera.UP, Scene.camera.FRONT);
        LEFT.normalize();
        LEFT.multiplyScalar(scale);

        Scene.camera.position.add(LEFT);
    }
    if(key[KEY['D']]){
        var RIGHT = new THREE.Vector3();
        RIGHT.crossVectors(Scene.camera.UP, Scene.camera.FRONT);
        RIGHT.normalize();
        RIGHT.multiplyScalar(scale);
        RIGHT.negate();

        Scene.camera.position.add(RIGHT);
    }
    if(key[KEY['SHIFT']]){
        var DOWN = Scene.camera.UP.clone();
        DOWN.multiplyScalar(scale);
        DOWN.negate();

        Scene.camera.position.add(DOWN);
    }
    if(key[KEY['SPACE']]){
        var UP = Scene.camera.UP.clone();
        UP.multiplyScalar(scale);

        Scene.camera.position.add(UP);
    }
    // Scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
    var tar = new THREE.Vector3(
        Scene.camera.position.x + Scene.camera.FRONT.x,
        Scene.camera.position.y + Scene.camera.FRONT.y,
        Scene.camera.position.z + Scene.camera.FRONT.z
    );
    Scene.camera.lookAt(tar);
}

var first = true;
var last = {}, delta = {};
function onMouseMove(e) {
    if(first){
        first = false;
        last.x = e.clientX;
        last.y = e.clientY;
    }
    var speed = 0.001;

    delta.x = e.clientX - last.x;
    delta.y = e.clientY - last.y;

    last.x = e.clientX;
    last.y = e.clientY;

    Scene.camera.PITCH -= speed * delta.y;
    Scene.camera.YAW += speed *  delta.x;

    var MAX_ANGLE = 89.0 / 180 * Math.PI;
    if(Scene.camera.PITCH > MAX_ANGLE) Scene.camera.PITCH = MAX_ANGLE;
    if(Scene.camera.PITCH < -MAX_ANGLE) Scene.camera.PITCH = -MAX_ANGLE;

    Scene.camera.FRONT.y = Math.sin(Scene.camera.PITCH);
    Scene.camera.FRONT.x = Math.cos(Scene.camera.PITCH) * Math.cos(Scene.camera.YAW);
    Scene.camera.FRONT.z = Math.cos(Scene.camera.PITCH) * Math.sin(Scene.camera.YAW);
    Scene.camera.FRONT.normalize();
}

// function onMouseUp(){
//     drag = false;
// }
// function onMouseDown(e) {
//     drag = true;
//     last.x = e.clientX;
//     last.y = e.clientY;
// }

window.addEventListener("mousemove", onMouseMove, false);
// window.addEventListener("mouseup", onMouseUp, false);
// window.addEventListener("mousedown", onMouseDown, false);
