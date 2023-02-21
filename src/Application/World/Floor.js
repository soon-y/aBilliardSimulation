import * as THREE from 'three'
import Application from "../Application"

export default class Floor {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(100,100)
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.floorTexture
        this.textures.normal = this.resources.items.floorNormal
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set(60, 60)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
        this.textures.normal.repeat.set(60, 60)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            map: this.textures.color,
            side: THREE.DoubleSide
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.mesh.position.y = -0.02
        this.scene.add(this.mesh)
    }
}