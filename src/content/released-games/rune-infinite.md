---
title: "Rune Infinite"
description: "2.5D fast-paced multiplayer (PvP) with “diablo-like” mechanics."
timeFrame: "Sep 2021 - Nov 2022"
sortDate: "2021-09-07"
status: "Studio shutdown"
cover: "/cover/cover-runeinfinite.webp"
trailerId: "irwsmfSPDXw"
engine: "Unity"
role: "Programmer"
language: "C#"
studio: "Rune Games"
importantTechStack:
    - "PC"
extraTechStack:
    - "Mirror"

---

# Rune Universe
Started the project with a team of 3 programmers. Created the Movement System, UI/UX, Network Architecture (using Mirror) and majority of the Combat System .
All that can be seen in the Gallery was implemented by me, including VFX creation.

Section            | Description
---                | ---
[UI](#ui)          | Explanation about how UI was designed, made and implemented.
[INPUT](#input)    | Explanation about how Input was designed, made and implemented.


## UI <a name="ui"></a>
Designed the UX and implemented all of the UI in game. Assets were from packs.
<details>
<summary>Skill Bind UI (click to expand)</summary>

- Skill Bind was inspired by [Ashen Inventory UI](https://www.gameuidatabase.com/gameData.php?id=302&autoload=9824)<br>
![Skill bind UI](/attachments/rune-infinite/uiblocktest.gif)
1. Every skill should show info about their damage, cooldown and cost;
2. Slots were based on type (6 attack, 4 utility and 2 movement)
3. Each page is known as "Gear". Gears could be created as much as the player wanted. Gears could ne renamed.
4. Skills could be searched by their names
5. Inputs would automatically update on binding or input change 

</details>

## INPUT <a name="input"></a>
Supports both *Keyboard and Mouse* or *Gamepad*. Players could change their input choice at any time at runtime.

<details>
<summary>Keyboard, Mouse and Gamepad: Movement (click to expand)</summary>

- When using *Mouse* to move, you could select where you want to go, similar to MOBA or RTS games.
![Movement indication arrow](/attachments/rune-infinite/destinationarrow.gif)!

- When using *Keyboard* or *Gamepad* to move. It'd do some pathfinding check every few frames to make it smooth and also avoid obstacles.
![Pathfinding movement](/attachments/rune-infinite/movementWASD.gif)

</details>

<details>
<summary>Keyboard, Mouse and Gamepad: On Battle (click to expand)</summary>

During battle, on *Keyboard and Mouse*, the player would aim with mouse, giving direction and/or spot to spawn. On *Gamepad*, it would aim with the right joystick, and the spot to spawn would be a few units away from the player, with a valid position checker to get the proper place to spawn.
Since we got *12 Skills* and *1 Ultimate* for the player to choose to use, on Gamepad we access the other 6 skills by holding a trigger key (usually RT/R2).
![Battle controls](/attachments/rune-infinite/battlegamepadkbm.gif)

</details>