/**
 * Created by YuCrazing on 2017/5/9.
 */

var th = THREE;
var Scene = {};
Scene.init = function (windowWidth, windowHeight){
    Scene.scene = new THREE.Scene();
    Scene.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    Scene.renderer.setClearColor(new THREE.Color(255, 255, 255), 0.0);
    Scene.renderer.setSize(windowWidth, windowHeight);
    document.body.appendChild(Scene.renderer.domElement); //
    Scene.camera = new THREE.PerspectiveCamera(50, windowWidth / windowHeight, 0.1, 1000);

    Scene.scene.add(new THREE.AxisHelper(3));
};
Scene.init(window.innerWidth, window.innerHeight);

function rotateCube() {
    var geometry = new th.CubeGeometry(1, 1, 1);
    var material = new th.MeshBasicMaterial({color: "rgb(200, 100, 100)"});
    var cube = new th.Mesh(geometry, material);
    Scene.scene.add(cube);

    Scene.camera.position.set(3, 2, 5); // Can't use new THREE.Vector3().
    Scene.camera.lookAt(new THREE.Vector3(0, 0, 0));

    function render() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        Scene.renderer.render(Scene.scene, Scene.camera);
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

