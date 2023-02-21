import EventEmitter from "./EventEmitter"
import * as THREE from 'three'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.clock = new THREE.Clock()
        this.tick()    
    }

    tick()
    {
        this.delta = this.clock.getDelta()
        this.elapsed = this.clock.getElapsedTime()
        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        }) 
    }
}