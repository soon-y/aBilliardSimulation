import * as THREE from "three";
import Application from "../Application";
import { param } from "../param";

export default class Ball {
  constructor() {
    this.application = new Application();
    this.resources = this.application.resources;
    this.scene = this.application.scene;
    this.instance = new THREE.Group();

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(param.ballRadius, 32, 32);
  }

  setTextures() {
    this.textures = {};
    this.textures.ball8 = this.resources.items.ball8;
    this.textures.ball8.encoding = THREE.sRGBEncoding;
    this.textures.ball9 = this.resources.items.ball9;
    this.textures.ball9.encoding = THREE.sRGBEncoding;
    this.textures.ball10 = this.resources.items.ball10;
    this.textures.ball10.encoding = THREE.sRGBEncoding;
    this.textures.ball11 = this.resources.items.ball11;
    this.textures.ball11.encoding = THREE.sRGBEncoding;
    this.textures.ball12 = this.resources.items.ball12;
    this.textures.ball12.encoding = THREE.sRGBEncoding;
    this.textures.ball13 = this.resources.items.ball13;
    this.textures.ball13.encoding = THREE.sRGBEncoding;
    this.textures.ball14 = this.resources.items.ball14;
    this.textures.ball14.encoding = THREE.sRGBEncoding;
    this.textures.ball15 = this.resources.items.ball15;
    this.textures.ball15.encoding = THREE.sRGBEncoding;
  }

  setMaterial() {
    this.mat8 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball8,
    });
    this.mat9 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball9,
    });
    this.mat10 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball10,
    });
    this.mat11 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball11,
    });
    this.mat12 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball12,
    });
    this.mat13 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball13,
    });
    this.mat14 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball14,
    });
    this.mat15 = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: this.textures.ball15,
    });
  }

  setMesh() {
    this.ball8 = new THREE.Mesh(this.geometry, this.mat8);
    this.ball9 = new THREE.Mesh(this.geometry, this.mat9);
    this.ball10 = new THREE.Mesh(this.geometry, this.mat10);
    this.ball11 = new THREE.Mesh(this.geometry, this.mat11);
    this.ball12 = new THREE.Mesh(this.geometry, this.mat12);
    this.ball13 = new THREE.Mesh(this.geometry, this.mat13);
    this.ball14 = new THREE.Mesh(this.geometry, this.mat14);
    this.ball15 = new THREE.Mesh(this.geometry, this.mat15);

    this.instance.add(
      this.ball8,
      this.ball9,
      this.ball10,
      this.ball11,
      this.ball12,
      this.ball13,
      this.ball14,
      this.ball15
    );

    for (let i = 0; i < this.instance.children.length; i++) {
      this.instance.children[i].castShadow = true;
    }
  }
}
