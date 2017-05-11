/**
 * Created by YuCrazing on 2017/5/9.
 */

var passiveSupported = false;

try {
    var options = Object.defineProperty({}, "passive", {
        get: function() {
            passiveSupported = true;
        }
    });

    window.addEventListener("test", null, options);
} catch(err) {}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

var isMobile = window.mobilecheck();
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
    var position = new THREE.Vector3(1, 1, 5);
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

/* For mobile touch */
var pitch = 0.0, yaw = 0.0, len = 0.0;
var pos = Scene.camera.position.clone();
len = pos.length();
pos.normalize();
pitch = Math.asin(pos.y), yaw = 0.0;
var cosyaw = pos.x / Math.cos(pitch);
var sinyaw = pos.z / Math.cos(pitch);
if(cosyaw > 0) yaw = Math.asin(sinyaw);
else yaw = Math.PI - Math.asin(sinyaw);

function StencilTesting() {
    var cube = new Array();
    var geometry = new th.CubeGeometry(1, 1, 1);
    var material = new th.MeshPhongMaterial({color: "rgb(200, 100, 100)"});
    var Edge = new th.MeshBasicMaterial({color: "rgb(255, 255, 255)"});
    cube[0] = new th.Mesh(geometry, material);
    cube[1] = new th.Mesh(geometry, material);

    cube[1].position.set(-2, 0, 0);

    var geo = new th.SphereGeometry(1, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    var mat = new th.MeshPhongMaterial({color: "rgb(200, 100, 100)"});
    var sphere = new th.Mesh(geo, mat);
    sphere.position.set(0, 0, -6);

    Scene.scene.add(cube[0]);
    Scene.scene.add(cube[1]);
    Scene.scene.add(sphere);

    var axisScene = new th.Scene();
    axisScene.add(new th.AxisHelper(3));

    var DirLight = new THREE.DirectionalLight(0xffffff, 1);
    DirLight.position.set(10, 8, 4);

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
        cameraZoom();

        cube[0].rotation.x += 0.01;
        cube[0].rotation.y += 0.01;

        gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        Scene.renderer.render(Scene.scene, Scene.camera);

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
        Scene.renderer.render(axisScene, Scene.camera);
        cube[0].material = Edge;
        cube[1].material = Edge;
        sphere.material = Edge;
        Scene.renderer.render(Scene.scene, Scene.camera);
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
    };
    render();
};

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
    if(isMobile == false){
        var tar = new THREE.Vector3(
            Scene.camera.position.x + Scene.camera.FRONT.x,
            Scene.camera.position.y + Scene.camera.FRONT.y,
            Scene.camera.position.z + Scene.camera.FRONT.z
        );
        Scene.camera.lookAt(tar);
    }else{
        Scene.camera.position.set(len * Math.cos(pitch) * Math.cos(yaw), len * Math.sin(pitch), len * Math.cos(pitch) * Math.sin(yaw));
        Scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
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

        Scene.camera.PITCH -= speed * delta.y;
        Scene.camera.YAW += speed *  delta.x;

        if(Scene.camera.PITCH > MAX_ANGLE) Scene.camera.PITCH = MAX_ANGLE;
        else if(Scene.camera.PITCH < -MAX_ANGLE) Scene.camera.PITCH = -MAX_ANGLE;

        Scene.camera.FRONT.y = Math.sin(Scene.camera.PITCH);
        Scene.camera.FRONT.x = Math.cos(Scene.camera.PITCH) * Math.cos(Scene.camera.YAW);
        Scene.camera.FRONT.z = Math.cos(Scene.camera.PITCH) * Math.sin(Scene.camera.YAW);
        Scene.camera.FRONT.normalize();
    }
}

function onMouseDown(e) {
    drag = true;
    last.x = e.clientX;
    last.y = e.clientY;
}

function onMouseUp(e){
    drag = false;
}

var zoom = Scene.camera.fov;
function cameraZoom(){
    Scene.camera.fov = zoom;

    Scene.camera.updateProjectionMatrix();
}
function onWheel(e) {
    var speed = 0.01;
    zoom += e.deltaY * speed;
    if(zoom > 89.0){
        zoom = 89.0;
    }else if(zoom < 1.0){
        zoom = 1.0;
    }
}

var touch = false, dis = 0.0;
var la = {}, del = {};
function onTouchMove(e) {
    if(touch){
        if(e.touches.length == 1){
            del.x = e.touches[0].clientX - la.x;
            del.y = e.touches[0].clientY - la.y;

            la.x = e.touches[0].clientX;
            la.y = e.touches[0].clientY;

            var speed = 0.01;
            var MAX_ANGLE = 89.0 / 180 * Math.PI;

            pos = Scene.camera.position.clone();
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
            if(zoom > 89.0){
                zoom = 89.0;
            }else if(zoom < 1.0){
                zoom = 1.0;
            }
            dis = disNow;
        }
    }
}

function onTouchStart(e){
    touch = true;
    if(e.touches.length == 1){
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

function onTouchEnd(e) {
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
// window.addEventListener("touchmove", onTouchMove, false);
// window.addEventListener("touchstart", onTouchStart, false);
// window.addEventListener("touchend", onTouchEnd, false);

StencilTesting();