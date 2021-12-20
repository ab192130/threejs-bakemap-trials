import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';
import TWEEN from '@tweenjs/tween.js'

let scene;
let camera;
let renderer;
const floorColor = '#d69060';
const draco = new DRACOLoader();
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
draco.setDecoderPath('draco/');
loader.setDRACOLoader(draco);

// Spector
let SPECTOR = require("spectorjs");
let spector = new SPECTOR.Spector();
spector.displayUI();

init()
createFloor();
createHome();

function init() {
    // DOM
    let container = document.querySelector('.container');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1d2f);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = -10;

    // Render
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Shadows
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Orbit Control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0;
    controls.maxDistance = 50;
    //controls.enabled = false;

    // Handle resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    function animate() {
        controls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        TWEEN.update();
    }

    animate();
}

// Textures
const floorTexture = textureLoader.load('/models/floor/texture.jpg');
floorTexture.flipY = false;
floorTexture.encoding = THREE.sRGBEncoding;

const homeTexture = textureLoader.load('/models/home/texture.jpg');
homeTexture.flipY = false;
homeTexture.encoding = THREE.sRGBEncoding;

// Materials
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture});
const homeMaterial = new THREE.MeshBasicMaterial({map: homeTexture});

// Model imports
function createFloor() {
    loader.load('models/floor/floor.glb', function (gltf) {
        let mesh = gltf.scene.children.find(child => child.name === "scene_floor");
        mesh.material = floorMaterial;

        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}

function createHome() {
    loader.load('models/home/home.glb', function (gltf) {
        let mesh = gltf.scene.children.find(child => child.name === "mesh");
        mesh.material = homeMaterial;

        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}
