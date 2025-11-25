import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import World from './world';
import Player from './player';

class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private physicsWorld: CANNON.World;
  private world: World;
  private player: Player;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    this.setupSkybox();
    this.setupLighting();

    this.world = new World(this.scene, this.physicsWorld);
    this.world.generate();

    this.player = new Player(this.scene, this.physicsWorld, this.camera);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  private setupSkybox() {
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue color
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

    this.physicsWorld.step(1 / 60);
    this.player.update();

    this.renderer.render(this.scene, this.camera);
  }
}

export default Game;
