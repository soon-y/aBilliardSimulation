import * as THREE from 'three'
import Application from '../Application';

export default class Room {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.resource = this.resources.items.room

        this.setModel()
    }

    setModel() {
        this.room = this.resource.scene
        this.scene.add(this.room)

        this.room.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true
            }
        })
    }
}