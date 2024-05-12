import * as THREE from "three";
import Application from "../Application";
import Environment from "./Environment";
import Debug from "../Utils/Debug";
import { param } from "../param";
import Table from "./Table";
import lightBulb from "./lightBulb";
import Ball from "./Ball";
import Room from "./Room";
import Cue from "./Cue";
import Audio from "../Utils/Audio";

const radius = param.unit / 8;
let centerDist = new THREE.Vector3(0, 0, 0);
let ballSpeed = [];
let needListener = true;
let camera;
let ball;

const params = {
  speedVolume: 5,
};

export default class World {
  constructor() {
    this.application = new Application();
    this.time = this.application.time;
    this.scene = this.application.scene;
    this.resources = this.application.resources;
    this.planeNormal = new THREE.Vector3(0, 1, 0);
    this.tableBedWidth = param.tableWidth - param.ballRadius * 2;
    this.tableBedLength = param.tableLength - param.ballRadius * 2;
    camera = this.application.camera.instance;

    // Wait for resources
    this.resources.on("ready", () => {
      this.debug = new Debug();
      this.debugFolder = this.debug.gui.addFolder("Ball");
      this.debugFolder.close();
      //Debug
      this.debugFolder
        .add(params, "speedVolume")
        .name("Speed volume")
        .min(1)
        .max(10)
        .step(1);

      // Setup
      this.environment = new Environment(this.debug);
      this.room = new Room();
      this.cue = new Cue();
      this.table = new Table();
      this.lightBulb = new lightBulb(this.environment.light);
      ball = new Ball().instance;

      ball.position.y = param.ballRadius + 0.05;
      this.scene.add(ball);
      this.placeBalls();
      this.setSpeed();

      this.ready = true;

      setInterval(() => {
        /**
         * speed of each ball drops by 20% every second due to friction
         */
        for (let i = 0; i < ball.children.length; i++) {
          ballSpeed[i].x -= ballSpeed[i].x * 0.2;
          ballSpeed[i].z -= ballSpeed[i].z * 0.2;
        }
      }, 1000);

      document.getElementById("resetSpeed").onclick = function () {
        /**
         * reset speed array when reset button clicked.
         */
        ballSpeed = [];
        for (let i = 0; i < ball.children.length; i++) {
          let speed = new THREE.Vector3(
            params.speedVolume * (Math.random() * 2 - 1),
            0,
            params.speedVolume * (Math.random() * 2 - 1)
          );
          ballSpeed.push(speed);
        }

        if (needListener) {
          this.audio = new Audio(ball);
        }
      };
    });
  }

  placeBalls() {
    /**
     * place balls initially at the ramdom positions without overlapping
     */
    for (let i = 0; i < ball.children.length; i++) {
      let x =
        Math.floor(this.tableBedWidth * Math.random()) - this.tableBedWidth / 2;
      let z =
        Math.floor(this.tableBedLength * Math.random()) -
        this.tableBedLength / 2;

      if (i > 0) {
        while (this.samePosition(x, z)) {
          x =
            Math.floor(this.tableBedWidth * Math.random()) -
            this.tableBedWidth / 2;
          z =
            Math.floor(this.tableBedLength * Math.random()) -
            this.tableBedLength / 2;
        }
      }
      ball.children[i].position.x = x;
      ball.children[i].position.z = z;
      ball.children[i].matrixAutoUpdate = false;
    }
  }

  setSpeed() {
    // random velocity vector
    for (let i = 0; i < ball.children.length; i++) {
      let speed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        0,
        (Math.random() - 0.5) * 0.1
      );
      ballSpeed.push(speed);
    }
  }

  samePosition(x, z) {
    /**
     * copmare position x, z to other balls' positions to avoid overlapping
     */
    for (let i = 0; i < ball.children.length; i++) {
      if (
        x + radius > ball.children[i].position.x - radius &&
        x - radius < ball.children[i].position.x + radius &&
        z + radius > ball.children[i].position.z - radius &&
        z - radius < ball.children[i].position.z + radius
      ) {
        return true;
      }
    }
    return false;
  }

  colliding(b1, b2) {
    /**
     * check if two balls collide
     */
    let xd = b1.position.x - b2.position.x;
    let zd = b1.position.z - b2.position.z;
    let distSqr = Math.sqrt(xd * xd + zd * zd);
    centerDist.x = xd;
    centerDist.z = zd;

    if (distSqr <= param.ballRadius * 2 + 0.1) {
      return true;
    }
    return false;
  }

  update() {
    if (this.lightBulb) {
      this.lightBulb.update();
      this.lightBulb.lightMat.opacity = this.environment.light.intensity / 10;
    }

    if (this.ready) {
      // update position of rolling balls
      for (let i = 0; i < ball.children.length; i++) {
        ball.children[i].position.add(
          ballSpeed[i].clone().multiplyScalar(this.time.delta)
        );
        const om = ballSpeed[i].length() / param.ballRadius;
        const axis = this.planeNormal.clone().cross(ballSpeed[i]).normalize();
        const dR = new THREE.Matrix4().makeRotationAxis(
          axis,
          om * this.time.delta
        );
        ball.children[i].matrix.premultiply(dR);
        ball.children[i].matrix.setPosition(ball.children[i].position);
      }

      // rebounded off cushions
      for (let i = 0; i < ball.children.length; i++) {
        if (ball.children[i].position.x > this.tableBedWidth / 2) {
          ballSpeed[i].x = -Math.abs(ballSpeed[i].x);
          ballSpeed[i].z = ballSpeed[i].z;
        }
        if (ball.children[i].position.z > this.tableBedLength / 2) {
          ballSpeed[i].z = -Math.abs(ballSpeed[i].z);
          ballSpeed[i].x = ballSpeed[i].x;
        }
        if (ball.children[i].position.x < -this.tableBedWidth / 2) {
          ballSpeed[i].x = Math.abs(ballSpeed[i].x);
          ballSpeed[i].z = ballSpeed[i].z;
        }
        if (ball.children[i].position.z < -this.tableBedLength / 2) {
          ballSpeed[i].z = Math.abs(ballSpeed[i].z);
          ballSpeed[i].x = ballSpeed[i].x;
        }
      }

      // collision
      for (let i = 0; i < ball.children.length - 1; i++) {
        for (let j = i + 1; j < ball.children.length; j++) {
          if (this.colliding(ball.children[i], ball.children[j])) {
            let speedDiff = ballSpeed[i].clone().sub(ballSpeed[j].clone());
            let scalar = centerDist.dot(speedDiff) / centerDist.lengthSq();
            let comp = centerDist.multiplyScalar(scalar);
            ballSpeed[i].sub(comp);
            ballSpeed[j].add(comp);
            ball.children[i].children[0].play();
          }
        }
      }
    }

    if (this.environment) {
      this.environment.update();
    }
  }
}
