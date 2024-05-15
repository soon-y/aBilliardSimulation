import Application from "./Application";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.application = new Application();
    this.size = this.application.sizes;
    this.scene = this.application.scene;
    this.canvas = this.application.canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      0.1,
      5000
    );
    this.instance.position.set(-10, 10, 10);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = 0.1;
    this.controls.maxAzimuthAngle = 0;
    this.controls.minAzimuthAngle = -Math.PI / 2;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;
    this.controls.enablePan = false;
  }

  resize() {
    this.instance.aspect = this.size.width / this.size.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
