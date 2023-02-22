import * as THREE from 'three'
import Application from "../Application"
import Environment from './Environment'
import Debug from '../Utils/Debug'
import { param } from '../param'
import Table from './Table'
import lightBulb from './lightBulb'
import Ball8 from './Ball8'
import Ball9 from './Ball9'
import Ball10 from './Ball10'
import Ball11 from './Ball11'
import Ball12 from './Ball12'
import Ball13 from './Ball13'
import Ball14 from './Ball14'
import Ball15 from './Ball15'
import Room from './Room'
import Cue from './Cue'

const instances = new THREE.Group()
const radius = param.unit / 8
let centerDist = new THREE.Vector3(0, 0, 0)
let ballSpeed = []
let audio, listener

const params = {
    speedVolume: 1
}

export default class World {
    constructor() {
        this.application = new Application()
        this.time = this.application.time
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.planeNormal = new THREE.Vector3(0, 1, 0)
        this.tableBedWidth = param.tableWidth - param.ballRadius * 2
        this.tableBedLength = param.tableLength - param.ballRadius * 2
        this.audioLoader = new THREE.AudioLoader()

        // Wait for resources
        this.resources.on('ready', () => {
            this.debug = new Debug()
            this.debugFolder = this.debug.gui.addFolder("Ball")
            this.debugFolder.close()
            //Debug
            this.debugFolder.add(params, 'speedVolume')
                .name('Speed volume')
                .min(1).max(10).step(1)
            
            // Setup
            this.environment = new Environment(this.debug)
            this.room = new Room()
            this.cue = new Cue()
            this.table = new Table()
            this.lightBulb = new lightBulb(this.environment.light)
            this.ball8 = new Ball8().instance
            this.ball9 = new Ball9().instance
            this.ball10 = new Ball10().instance
            this.ball11 = new Ball11().instance
            this.ball12 = new Ball12().instance
            this.ball13 = new Ball13().instance
            this.ball14 = new Ball14().instance
            this.ball15 = new Ball15().instance

            instances.add(
                this.ball8, this.ball9, this.ball10, this.ball11,
                this.ball12, this.ball13, this.ball14, this.ball15)
            instances.position.y = param.ballRadius + 0.05
            this.scene.add(instances)
            this.placeBalls()
            this.setSpeed()
        })
    }

    placeBalls() {
        /**
         * place balls initially at the ramdom positions without overlapping
         */
        for (let i = 0; i < instances.children.length; i++) {
            let x = Math.floor(this.tableBedWidth * Math.random()) - this.tableBedWidth / 2
            let z = Math.floor(this.tableBedLength * Math.random()) - this.tableBedLength / 2

            if (i > 0) {
                while (samePosition(x, z)) {
                    x = Math.floor(this.tableBedWidth * Math.random()) - this.tableBedWidth / 2
                    z = Math.floor(this.tableBedLength * Math.random()) - this.tableBedLength / 2
                }
            }
            instances.children[i].position.x = x
            instances.children[i].position.z = z
            instances.children[i].matrixAutoUpdate = false
        }
    }

    setSpeed() {
        // random velocity vector
        for (let i = 0; i < instances.children.length; i++) {
            let speed = new THREE.Vector3((Math.random() - 0.5)*0.1, 0, (Math.random() - 0.5)*0.1)
            ballSpeed.push(speed);
        }
    }

    update() {
        if (this.lightBulb) {
            this.lightBulb.update()
            this.lightBulb.lightMat.opacity = this.environment.light.intensity / 10
        }

        if (instances.children.length) {
            // update position of rolling balls
            for (let i = 0; i < instances.children.length; i++) {
                instances.children[i].position.add(ballSpeed[i].clone().multiplyScalar(this.time.delta))
                const om = ballSpeed[i].length() / param.ballRadius;
                const axis = this.planeNormal.clone().cross(ballSpeed[i]).normalize()
                const dR = new THREE.Matrix4().makeRotationAxis(axis, om * this.time.delta)
                instances.children[i].matrix.premultiply(dR);
                instances.children[i].matrix.setPosition(instances.children[i].position)
            }

            // rebounded off cushions 
            for (let i = 0; i < instances.children.length; i++) {
                if (instances.children[i].position.x > this.tableBedWidth / 2) {
                    ballSpeed[i].x = - Math.abs(ballSpeed[i].x)
                    ballSpeed[i].z = ballSpeed[i].z
                }
                if (instances.children[i].position.z > this.tableBedLength / 2) {
                    ballSpeed[i].z = - Math.abs(ballSpeed[i].z)
                    ballSpeed[i].x = ballSpeed[i].x
                }
                if (instances.children[i].position.x < - this.tableBedWidth / 2) {
                    ballSpeed[i].x = Math.abs(ballSpeed[i].x)
                    ballSpeed[i].z = ballSpeed[i].z
                }
                if (instances.children[i].position.z < - this.tableBedLength / 2) {
                    ballSpeed[i].z = Math.abs(ballSpeed[i].z)
                    ballSpeed[i].x = ballSpeed[i].x
                }
            }

            // collision
            for (let i = 0; i < instances.children.length - 1; i++) {
                for (let j = i + 1; j < instances.children.length; j++) {
                    if (colliding(instances.children[i], instances.children[j])) {
                        let speedDiff = ballSpeed[i].clone().sub(ballSpeed[j].clone());
                        let scalar = centerDist.dot(speedDiff) / centerDist.lengthSq();
                        let comp = centerDist.multiplyScalar(scalar);
                        ballSpeed[i].sub(comp);
                        ballSpeed[j].add(comp);

                        if(audio!= null){
                            this.audioLoader.load('./sound/billiards.wav', function (buffer) {
                            audio.setBuffer(buffer)
                            audio.play()
                        });}
                    }
                }
            }
        }

        if (this.environment) {
            this.environment.update()
        }
    }
}

function samePosition(x, z) {
    /**
    * copmare position x, z to other balls' positions to avoid overlapping
    */
    for (let i = 0; i < instances.children.length; i++) {
        if (x + radius > instances.children[i].position.x - radius &&
            x - radius < instances.children[i].position.x + radius &&
            z + radius > instances.children[i].position.z - radius &&
            z - radius < instances.children[i].position.z + radius) {
            return true;
        }
    }
    return false;
}

function colliding(b1, b2) {
    /**
     * check if two balls collide
     */
    let xd = b1.position.x - b2.position.x;
    let zd = b1.position.z - b2.position.z;
    let distSqr = Math.sqrt((xd * xd) + (zd * zd));
    centerDist.x = xd;
    centerDist.z = zd;

    if (distSqr <= param.ballRadius * 2) {
        return true;
    } return false;
}

document.getElementById("resetSpeed").onclick = function () {
    /**
    * reset speed array when reset button clicked.
    */
    ballSpeed = [];
    for (let i = 0; i < instances.children.length; i++) {
        let speed = new THREE.Vector3(params.speedVolume * (Math.random() * 2 - 1), 0, params.speedVolume * (Math.random() * 2 - 1));
        ballSpeed.push(speed);
    }
    listener = new THREE.AudioListener()
    audio = new THREE.PositionalAudio( listener )   

}

setInterval(() => {
    /**
    * speed of each ball drops by 20% every second due to friction 
    */
    for (let i = 0; i < instances.children.length; i++) {
        ballSpeed[i].x -= ballSpeed[i].x * 0.2;
        ballSpeed[i].z -= ballSpeed[i].z * 0.2;
    }
}, 1000)