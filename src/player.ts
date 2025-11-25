import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class Player {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;

  private camera: THREE.PerspectiveCamera;
  private input: { [key: string]: boolean };

  constructor(scene: THREE.Scene, world: CANNON.World, camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.input = {};

    // Create the magic carpet model
    const geometry = new THREE.BoxGeometry(2, 0.1, 3);
    const material = new THREE.MeshStandardMaterial({ color: 0x800080 });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    // Create the physics body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 0.05, 1.5));
    this.body = new CANNON.Body({ mass: 1 });
    this.body.addShape(shape);
    this.body.position.set(0, 30, 0);
    world.addBody(this.body);

    this.setupControls();
  }

  private setupControls() {
    window.addEventListener('keydown', (e) => {
      this.input[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.input[e.key] = false;
    });
  }

  public update() {
    this.handleInput();

    this.mesh.position.copy(this.body.position as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);

    // Update camera position to follow the player
    const offset = new THREE.Vector3(0, 5, 10);
    offset.applyQuaternion(this.mesh.quaternion);
    const cameraPosition = this.mesh.position.clone().add(offset);
    this.camera.position.copy(cameraPosition);
    this.camera.lookAt(this.mesh.position);
  }

  private handleInput() {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.mesh.quaternion);

    if (this.input['w']) {
      this.body.applyForce(forward.multiplyScalar(10) as any);
    }
    if (this.input['s']) {
      this.body.applyForce(forward.multiplyScalar(-10) as any);
    }
    if (this.input['a']) {
      this.body.angularVelocity.y = 1;
    }
    if (this.input['d']) {
      this.body.angularVelocity.y = -1;
    }
    if (!this.input['a'] && !this.input['d']) {
      this.body.angularVelocity.y = 0;
    }
    if (this.input[' ']) {
      this.body.applyForce(new CANNON.Vec3(0, 10, 0));
    }
    if (this.input['Shift']) {
      this.body.applyForce(new CANNON.Vec3(0, -10, 0));
    }
  }
}

export default Player;
