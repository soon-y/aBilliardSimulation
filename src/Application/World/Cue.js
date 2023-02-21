import * as THREE from 'three'
import Application from '../Application';

export default class Cue {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.resource = this.resources.items.cue

        this.setModel()
    }

    setModel() {
        this.cue = this.resource.scene
        this.scene.add(this.cue)

        this.cue.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
    }
}