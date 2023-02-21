import * as THREE from 'three'
import Application from "../Application"

export default class Environment {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.debug = this.application.debug

        //Debug
        this.debugFolder1 = this.debug.gui.addFolder('AmbientLight')
        this.debugFolder = this.debug.gui.addFolder('SpotLight')

        this.setLight()
    }

    setLight() {
        this.ambLight = new THREE.AmbientLight('#080808')

        this.light = new THREE.SpotLight(0xffffff)
        this.light.position.y = 5
        this.light.angle = Math.PI / 3
        this.light.penumbra = 1
        this.light.intensity = 5
        this.light.decay = 0.2
        this.light.distance = 0
        this.light.castShadow = true
        this.light.shadow.mapSize.width = 1024
        this.light.shadow.mapSize.height = 1024
        this.light.shadow.camera.near = 0.1
        this.light.shadow.camera.far = 200
        this.light.shadow.focus = 1

        this.helper = new THREE.SpotLightHelper(this.light)
        this.helper.visible = false
        this.scene.add(this.ambLight, this.light, this.helper)

        // Debug
        this.debugFolder1
            .addColor(this.ambLight, 'color')

        this.debugFolder
            .add(this.light.position, 'y')
            .min(1).max(20).step(0.001)
            .name('y-position')

        this.debugFolder
            .add(this.light, 'intensity')
            .min(0).max(10).step(0.001)

        this.debugFolder
            .add(this.light, 'angle')
            .min(Math.PI / 10).max(Math.PI / 2).step(0.0001)

        this.debugFolder
            .add(this.light, 'penumbra')
            .min(0).max(1).step(0.001)

        this.debugFolder
            .add(this.light, 'decay')
            .min(0).max(2).step(0.001)

        this.debugFolder
            .add(this.light.shadow, 'focus')
            .min(0).max(1).step(0.001)

        this.debugFolder
            .addColor(this.light, 'color')

        this.debugFolder
            .add(this.helper, 'visible')
            .name('LightHelper')
    }

    update() {
        this.helper.update()
    }
}