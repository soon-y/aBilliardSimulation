import * as THREE from 'three'
import Application from "../Application"
import { param } from '../param'

export default class lightBulb {
    constructor(light) {
        //Options
        this.light = light

        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.debug = this.application.debug

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }
    setGeometry() {
        this.lightGeo = new THREE.SphereGeometry(param.ballRadius * 3 / 2, 32, 32)
        this.caseGeo = new THREE.CylinderGeometry(param.ballRadius / 10, param.ballRadius * 3, param.ballRadius * 3, 32)
        this.cordGeometry = new THREE.CylinderGeometry(param.ballRadius / 10, param.ballRadius / 10, 200, 32);
        this.cordGeometry.computeBoundingBox()
        this.cordGeometry.translate(0, this.cordGeometry.boundingBox.max.y, 0
        )
    }

    setMaterial() {
        this.lightMat = new THREE.MeshBasicMaterial({
            color: '#FFFF00',
            transparent: true,
            opacity: 0.5
        })
        this.caseMat = new THREE.MeshBasicMaterial({ color: '#030303' })
    }

    setMesh() {
        this.lightBulb = new THREE.Mesh(this.lightGeo, this.lightMat)
        this.lightCase = new THREE.Mesh(this.caseGeo, this.caseMat)
        this.cord = new THREE.Mesh(this.cordGeometry, this.caseMat)
        this.lightBulb.position.copy(this.light.position)
        this.lightCase.position.y += param.ballRadius
        this.light.add(this.lightCase, this.cord)
        this.scene.add(this.lightBulb)
    }

    update() {
        this.lightBulb.position.copy(this.light.position)
    }
}