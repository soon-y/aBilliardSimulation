import Application from "./Application";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(){
        this.application = new Application()
        this.size = this.application.sizes
        this.scene = this.application.scene
        this.canvas = this.application.canvas

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            45,
            this.size.width / this.size.height,
            0.1,
            5000
        )
        this.instance.position.set(-10, 10, 10)
        this.scene.add(this.instance)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.size.width / this.size.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}