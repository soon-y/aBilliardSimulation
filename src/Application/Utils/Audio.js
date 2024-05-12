import * as THREE from "three";
import Application from "../Application";
import EventEmitter from "./EventEmitter";

export default class Audio extends EventEmitter {
  constructor(ball, mute = false) {
    super();
    this.application = new Application();
    this.resources = this.application.resources;
    this.camera = this.application.camera;
    this.set = false;
    this.toLoad = sources.length;
    this.loaded = 0;
    this.items = {};

    this.on("ready", () => {
      if (this.loaded === this.toLoad) {
        this.hit = this.items.hit;

        for (let i = 0; i < ball.children.length; i++) {
          const audio = new THREE.PositionalAudio(this.listener);
          audio.setBuffer(this.hit);
          ball.children[i].add(audio);
        }
        this.set = true;

        if (mute) this.mute();
      }
    });

    this.loadingManager = new THREE.LoadingManager();
    this.setAudio();
  }

  setAudio() {
    this.loader = new THREE.AudioLoader(this.loadingManager);
    this.listener = new THREE.AudioListener();
    this.camera.instance.add(this.listener);

    for (const source of sources) {
      this.loader.load(source.path, (file) => {
        this.sourceLoaded(source, file);
      });
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }

  mute() {
    this.gulp.setVolume(0);
  }

  soundOn() {
    this.gulp.setVolume(1);
  }
}

const sources = [
  {
    name: "hit",
    path: "./sound/billiards.wav",
  },
];
