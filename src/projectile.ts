import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class Projectile {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;

  constructor(scene: THREE.Scene, world: CANNON.World, position: THREE.Vector3, velocity: THREE.Vector3) {
    // Create the projectile model
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    scene.add(this.mesh);

    // Create the physics body
    const shape = new CANNON.Sphere(0.1);
    this.body = new CANNON.Body({ mass: 0.1 });
    this.body.addShape(shape);
    this.body.position.copy(position as any);
    this.body.velocity.copy(velocity as any);
    world.addBody(this.body);
  }

  public update() {
    this.mesh.position.copy(this.body.position as any);
  }
}

export default Projectile;
