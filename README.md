# Magic Mine Carpet

Magic Mine Carpet is a modern browser-based game concept aiming to blend the voxel-based world generation and building mechanics of Minecraft with the flying and terrain manipulation of Magic Carpet. The game will focus on delivering a highly immersive and "juicy" experience through modern visual and audio effects.

## Vision

Our goal is to create a dynamic and expansive world where players can fly magic carpets, engage in combat, manipulate terrain with spells, and build intricate castles, all within a web browser. The game will feature:

*   **Voxel World:** A procedurally generated, destructible voxel environment.
*   **Magic Carpet Flight:** Intuitive physics-based flight mechanics.
*   **Spellcasting:** A diverse system of destructive combat spells and constructive terrain manipulation spells, inspired by games like Scorched Earth.
*   **Base Building:** Ability to construct and expand castles using collected resources.
*   **Dynamic Ecosystem:** Simple enemies, resource collection, and unique AI-controlled elements like steampunk zeppelins and dragon worms.
*   **Immersive "Juice":** Modern effects such as screen shakes, particle effects, post-processing (e.g., bloom), and dynamic soundscapes.

## Technology Stack

The game will be built with modern web technologies:

*   **Language:** TypeScript
*   **3D Graphics:** Three.js
*   **Physics:** A lightweight physics engine for collisions and interactions.
*   **Platform:** Runs entirely in a web browser.

## Core Gameplay Features

*   **Player Character:** Fly a magic carpet through a procedurally generated voxel world.
*   **Resource Collection:** Gather resources from the environment.
*   **Castle Building:** Utilize collected resources to build and expand your own castle. The size and complexity of your castle will influence the strength and quantity of your crafts (e.g., zeppelins).
*   **Spellcasting:**
    *   **Destructive Spells:** For combat and significant terrain manipulation, drawing inspiration from the varied weapons of Scorched Earth.
    *   **Constructive Spells:** To manipulate terrain for building purposes and castle construction.
*   **Enemies:**
    *   Simple, AI-driven enemies populating the world.
    *   Crawling and flying dragon worms.
    *   Enemy castles will also have their own crafts (e.g., zeppelins) that collect resources.
*   **Resource Collectors:** Both the player and AI will utilize steampunk zeppelins to collect resources.

## Visuals & Audio ("The Juice")

To enhance immersion and player feedback, the game will incorporate:

*   Screen shakes
*   Extensive particle effects for spells and interactions
*   Post-processing effects (e.g., bloom, depth of field)
*   Dynamic sound effects and an adaptive soundscape
*   Day/night cycle

## Development Roadmap (Initial Steps)

To get started, we will focus on these foundational tasks:

1.  [X] Initialize a new Vite project with TypeScript.
2.  [X] Set up the basic Three.js scene with a skybox and initial lighting.
    *   **Note:** Skybox textures are currently pending.
3.  [W] Implement procedural voxel world generation.
4.  [ ] Create the player's magic carpet and controller with physics-based flight.
5.  [ ] Develop the resource and castle building system.
6.  [ ] Implement the spellcasting system with terrain manipulation and combat spells.
7.  [ ] Design and implement a modular AI system for enemies.
8.  [ ] Add crawling and flying dragon worm enemies.
9.  [ ] Create the steampunk zeppelin resource collectors for both player and AI.
10. [ ] Implement the "juice" (screen shakes, particles, post-processing, dynamic sound, and day/night cycle).
11. [ ] Set up a game loop and state management.

## Architectural Considerations

The game will be architected for expandability and easy improvement, ensuring that new features and optimizations can be integrated seamlessly as development progresses.