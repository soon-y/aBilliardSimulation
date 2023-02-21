import * as THREE from 'three'
import Application from '../Application';

export default class Table {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.table = this.resources.items.table
        this.bed = this.resources.items.tableBed

        this.setModel()
    }

    setModel() {
        this.poolTable = this.table.scene
        this.tableBed = this.bed.scene
        this.scene.add(this.poolTable, this.tableBed)

        this.poolTable.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.tableBed.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true
            }
        })
    }
}