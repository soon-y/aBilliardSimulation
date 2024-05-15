import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from "./EventEmitter"

const loading = document.querySelector('.loading-page')
const label = document.querySelector('.label')
const loadNum = document.querySelector('.loadNum')
const btn = document.querySelector('.btn')

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        //Options
        this.sources = sources

        //Setup
        this.loadingManager = new THREE.LoadingManager(
            //Loaded
            () => {
                label.classList.add("ended");
                loadNum.classList.add("ended");
                window.setTimeout(() => {
                    btn.style.opacity = '100'
                    loading.style.opacity = '0'
                }, 1000)
                window.setTimeout(() => {
                    loading.style.display = 'none'
                }, 3000)
            },

            //progress
            (itemUrl, itemsLoaded, itemsTotal) => {
                const progress = Math.floor(itemsLoaded / itemsTotal * 100)
                loadNum.innerHTML = `${progress}`
            }
        )

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.dracoLoader = new DRACOLoader(this.loadingManager)
        this.dracoLoader.setDecoderPath('/draco/')
        this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader)
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++
        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}