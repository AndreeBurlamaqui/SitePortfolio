---
title: "MOTU: Guardians of Grayskull™"
description: "3D Bullet Heaven (Inverse Bullet Hell) inspired by the Masters of the Universe™ franchise. Face relentless waves of minions in fast-paced Vampire Survivors-style sessions featuring roguelite progression, character customization, and boss battles."
timeFrame: "Jan 2024 - Jan 2026"
sortDate: "2024-01-05"
status: "Soft-launched and cancelled"
cover: "/cover/motu-cover.webp"
trailerId: "jxx7PjNTibQ"
engine: "Unity"
googlePlayUrl: "https://play.google.com/store/apps/details?id=com.Mattel.GuardiansOfGrayskull"
role: "Lead Developer"
language: "C#"
studio: "Hopscotch Games"
extraTechStack:
    - "Firebase" # Most important backend
    - "Beamable" # Cloudsaving and login backend
    - "Addressables"
    - "Jobs System"
    - "Assessment Reviewer"
---

# My Contribution
As the **Lead Developer**, I directed the technical development of this 3D "Vampire Survivors"-like title from concept through to a restricted soft launch, achieving **10k+ downloads** on Google Play. I was responsible for the core architecture, performance optimization for mobile constraints, and the mentorship of the engineering team.
<br>
At first, I defined the whole architecture, creating code standards and defining how we'd approach the project. It needed to be modular and expandable, as ideas and the design were still in progress when the project was already advancing code-wise.
<br>
Following that, since it was a 3D "Bullet Heaven" and the core loop involves the player facing relentless waves of hundreds of minions. The main feature I focused on was bringing this high-entity-count experience to mobile devices without sacrificing visual fidelity or battery life (thermal throttling).

# Goals
1. While working on the game, I got nominated the "Employee of the Month" twice.

# Key Technical Challenges

### 1. Rendering 200+ Enemies on Mobile
**The Challenge:** Standard Unity `SkinnedMeshRenderers` and `Animator` components were too heavy for the target device specs when scaling to hundreds of on-screen enemies. <br>
**The Solution:** I wrote a custom shader and baking tool to implement **Vertex Animation Textures (VATs)**.
* Baked animation vertex data into textures using a custom bit-writer compression.
* Read this data via a custom shader, bypassing the CPU animation overhead entirely.
* Batched enemies using GPU Instancing and Compute Buffers.
**The Result:** Drastic reduction in draw calls and CPU overhead, allowing for massive hordes on low-end devices.

### 2. High-Performance Enemy Navigation
**The Challenge:** Using standard Unity Physics (Rigidbodies) or NavMeshAgents for 200+ units created massive CPU spikes.
**The Solution:** I implemented a custom multithreaded movement system using **Unity's Jobs System**.
* Developed a boid-like avoidance algorithm that runs comfortably on worker threads.
* Implemented a Flow Field pathfinding system for static obstacle avoidance.
* Removed all reliance on Unity's physics engine for enemy movement.

# Leadership & Tools
As the Lead, I prioritized **developer experience (DX)** and codebase scalability:
* **Art Pipeline:** Created custom Editor Tools allowing artists to set up gameplay components and balance levels without engineer supervision.
* **Code Quality:** Enforced strict architectural standards via Code Reviews and PR workflows.
* **Architecture:** Designed a modular component system (Movements, Drops, Effects) that allowed Game Designers to iterate rapidly.

# Gallery
![Gameplay showing high enemy count](/images/gameplay-horde.webp)
*Gameplay capture running on Android*

![Custom Editor Tool](/images/editor-tools.webp)
*Custom inspector tools built for the design team*