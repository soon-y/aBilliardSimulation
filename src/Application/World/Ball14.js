import * as THREE from 'three'
import Application from "../Application";
import { param } from '../param';

export default class Ball14 {
    constructor() {
        this.application = new Application()
        this.resources = this.application.resources
        this.scene = this.application.scene

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.SphereGeometry(param.ballRadius, 32, 32)
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.ball14
        this.textures.color.encoding = THREE.sRGBEncoding
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            map: this.textures.color
        })
    }

    setMesh() {
        this.instance = new THREE.Mesh(this.geometry, this.material)
        this.instance.castShadow = true
    }
}
