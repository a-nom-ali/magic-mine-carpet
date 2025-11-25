import * as THREE from 'three';
import World from './world';

class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: World;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.setupSkybox();
    this.setupLighting();

    this.world = new World(this.scene);
    this.world.generate();

    this.camera.position.z = 5;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  private setupSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'skybox/right.png',
      'skybox/left.png',
      'skybox/top.png',
      'skybox/bottom.png',
      'skybox/front.png',
      'skybox/back.png',
    ]);
    this.scene.background = texture;
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    this.scene.add(directionalLight);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);
  }
}

export default Game;
