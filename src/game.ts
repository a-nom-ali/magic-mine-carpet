import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import World from './world';
import Player from './player';
import Projectile from './projectile';

class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private physicsWorld: CANNON.World;
  private world: World;
  private player: Player;
  private projectiles: Projectile[] = [];

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

    this.player = new Player(this.scene, this.physicsWorld, this.camera);
    this.world = new World(this.scene, this.physicsWorld, this.player);
    this.world.generate();

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const position = this.player.body.position.clone().vadd(new CANNON.Vec3(forward.x, forward.y, forward.z).scale(2));
        const velocity = new CANNON.Vec3(forward.x, forward.y, forward.z).scale(50);
        this.projectiles.push(new Projectile(this.scene, this.physicsWorld, position as any, velocity as any));
      }
    });

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

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      const { x, y, z } = projectile.body.position;
      const result = new CANNON.RaycastResult();
      const ray = new CANNON.Ray(projectile.body.previousPosition, projectile.body.position);
      if (this.physicsWorld.raycastClosest(ray.from, ray.to, {}, result)) {
        const hitPoint = result.hitPointWorld;
        const normal = result.hitNormalWorld;
        this.world.removeBlock(hitPoint, normal);

        this.scene.remove(projectile.mesh);
        this.physicsWorld.removeBody(projectile.body);
        this.projectiles.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default Game;
