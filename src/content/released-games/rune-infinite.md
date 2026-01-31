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
<summary>Skill Library</summary>

- Skill Bind was inspired by [Ashen Inventory UI](https://www.gameuidatabase.com/gameData.php?id=302&autoload=9824)

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-SkillLibrary.mp4" type="video/mp4" />
  </video>

1. Every skill should show info about their damage, cooldown and cost;
2. Slots were based on type (6 attack, 4 utility and 2 movement)
3. Each page is known as "Gear". Gears could be created as much as the player wanted. Gears could ne renamed.
4. Skills could be searched by their names
5. Inputs would automatically update on binding or input change 

</details>

<details>
<summary>Notification Queue</summary>

It can be stacked, and will be showing until it reaches the limit, which then will be send to the queue. Other videos in this project also showcase the notification system, such as the [Keyboard, Mouse and Gamepad: On Battle](#input-on-battle).

Some notifications could be set to be permanent until canceled manually by code. Others had timers set on creation, and the UI shows which is which.

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-NotificationQueue.mp4" type="video/mp4" />
  </video>

</details>

<details>
<summary>Rebind UI</summary>

The rebinding system also notified the player when there was some overlapping bind, and didn't allow the player to continue (and save the configuration).

Everything had an explanation of what it represents on changing, that updated on hover.

On rebind, or on main input change (keyboard/mouse < > gamepad), input guides on every screen would update accordingly, showcasing the bind that represents a given action, e.g. esc/triangle to go back.

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-RebindUI.mp4" type="video/mp4" />
  </video>

</details>

<details>
<summary>Gamepad Control In-Game</summary>

To access shortcuts in-game, such as skill library and character stats. On Gamepad, the player would have a "open side bar" bind (in this case, the left arrow), which would teleport the cursor to the sidebar and open it. 

This activates the digital cursor, which allows the player to navigate the UI on gamepad.
To deactivate the cursor, moving out of UI State to Gameplay State, the player just needed to press the "back bind", (in this case, the north button, triangle).

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-GamepadSidebar.mp4" type="video/mp4" />
  </video>

</details>

<details>
<summary>Buff and Debuff Tooltips and Icons</summary>

When affected by a conditional effect, an icon would show above the player character, and when valid, on the top bar.

These icons have different border to indicate if the conditional is in favour or against.

These icons can be hovered to see tooltips.

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-BuffDebuff.mp4" type="video/mp4" />
  </video>

</details>

<details>
<summary>Round Over UI Animation</summary>

When a round is over, either by time or by killing, a transition screen animation would play. This screen showcases the who that won, and what happened to the player. Texts would also change to tell the player if the enemy has quit.

By being a best of 3, it will at first show only 2 "orb points" for each. If both win a round, it shows the third "orb point" that is used as tiebreaker.

Also used as a lazy-loading screen. So the screen only transition back to the game when allowed by the battle manager, which tells that everything is ready for the next round.

All done using manual tweening using Coroutines.

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-RoundOverScreen.mp4" type="video/mp4" />
  </video>

</details>

<details>
<summary>Game Over UI Animation</summary>

After the last round. The game would transition to the a statistics screen of the battle. Telling which skill did the most damage and how much it was used.

Also displaying the floor (the ranks in the game), if any of the players advanced or regressed and by how much, changing the button to explicitely tell what happened ("Next Floor" or "Previous Floor").

The moving background texture is done by shader, on a UI with a custom material.

  <video height=500px autoplay loop muted playsinline controls>
    <source src="/attachments/rune-infinite/Infinite-BattleOverScreen.mp4" type="video/mp4" />
  </video>

</details>

## INPUT <a name="input"></a>
Supports both *Keyboard and Mouse* or *Gamepad*. Players could change their input choice at any time at runtime.

<details>
<summary>Keyboard, Mouse and Gamepad: Movement</summary>

- When using *Mouse* to move, you could select where you want to go, similar to MOBA or RTS games.

![Movement indication arrow](../../assets/attachments/rune-infinite/destinationarrow.gif)

- When using *Keyboard* or *Gamepad* to move. It'd do some pathfinding check every few frames to make it smooth and also avoid obstacles.

![Pathfinding movement](../../assets/attachments/rune-infinite/movementWASD.gif)

</details>

<details>
<summary id="input-on-battle">Keyboard, Mouse and Gamepad: On Battle</summary>

During battle, on *Keyboard and Mouse*, the player would aim with mouse, giving direction and/or spot to spawn. On *Gamepad*, it would aim with the right joystick, and the spot to spawn would be a few units away from the player, with a valid position checker to get the proper place to spawn.
Since we got *12 Skills* and *1 Ultimate* for the player to choose to use, on Gamepad we access the other 6 skills by holding a trigger key (usually RT/R2).

![Battle controls](../../assets/attachments/rune-infinite/battlegamepadkbm.gif)

</details>