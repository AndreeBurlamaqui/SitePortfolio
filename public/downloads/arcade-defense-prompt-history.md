# Space Invaders project prompt history

This is a chronological transcript of the Space Invaders prompts visible in the current Codex conversation. It preserves the user's wording, including repeated prompts and follow-up corrections.

## Chat 1 — current conversation

Order: first (and only) Space Invaders conversation available to this assistant in the current session. The relative order of this conversation versus other chats or branches cannot be established from the records available here.

### 1. Initial technology question

> I need to create a browser game similar to Space Invaders. I was thinking of using Vanilla JS + HTML5 Canvas. What do you think?

### 2. Research and scope request

> Beforehand, search for the rules of Space Invaders. We need to create a scope

### 3. Repeated research and scope request

> Beforehand, search for the rules of Space Invaders. We need to create a scope

### 4. Required first playable version

> Use the sprites I added in the folder. Every name is seld describing.
>
> Also, it must includes:
>
> 1. Keyboard movement and firing, with on-screen instructions
> 2. Enemy waves, working collisions, a visible score and health/lives
> 3. Increasing difficulty
> 4. A start screen, game over and restart
>
> Keep it simple for now, but make sure the musts are in from the beginning

### 5. Texture update and descending zigzag correction

> I added more textures and updated their name.
> Regarding mechanics, its missing a core feature which is the ships coming towards the bottom, in a zigzag

### 6. Repeated descending zigzag correction

> I added more textures and updated their name.
> Regarding mechanics, its missing a core feature which is the ships coming towards the bottom, in a zigzag

### 7. Health and input tint; tunable constants

> Tint the hp icons in red. And tint the input in grey when used (so, when using moving left, tint both arrows and a key).
> And create a few constants that I can finetune myself b opening the game.js. Such as projectile width

### 8. Spacebar tint correction

> The spacebar is not tinting when used

### 9. Repeated spacebar tint correction

> The spacebar is not tinting when used

### 10. HUD layout request

> Regarding UI. Make the score and the wave on the top part of the screen.
> For Lives and Gas, make it on the bottom but on the left, with the order being Gas > Lives.
> Then on the bottom left, add the input instructions. For the instructions, make "Move" and "Fire" to be on top of the sprites. Similar organization as the other UI, which has the "title" on top of the actual thing

### 11. Gas reset and control placement correction

> Reset the gas when the wave resets too (or advance). Any wave changes means gas reset.
> Regarding UI, the instructions should be on bottom right. Not on left

### 12. Control alignment correction

> The instructions should be side to the Lives and Gas. Just on the bottom right. It's a bit down

### 13. Endless waves and scoreboard capacity

> Remove the "total waves". The game should run infinitely. At least until we cant hold the scoreboard anymore.

### 14. Repeated endless waves and scoreboard capacity request

> Remove the "total waves". The game should run infinitely. At least until we cant hold the scoreboard anymore.

### 15. Prompt-history document request

> Complete chronological prompt-history link  
> Include exact prompts, follow-ups, corrections, and failed attempts in chronological order. Label separate Codex chats and show their order. A text or Markdown document is fine.
>
> Do it for every chat that was created for this space invaders type of game. Including the branches and new chats made

## Other chats, branches, and new chats

No transcripts, chat identifiers, branch records, or links for other Codex conversations were present in the current conversation context or exposed through the available tools. They are therefore not included here, and this document does not claim to be a complete cross-chat history. The repeated requests above are separate prompt events in this one visible conversation, not evidence of separate chats.

## Failed or interrupted attempts visible in this conversation

- An early project inspection command was aborted by the user before it returned results.
- During the later attempt to inspect chat and branch records for this history, shell startup failed five times with `helper_unknown_error: setup refresh had errors`; the project workspace and Git branch history could not be checked during that attempt.
- The assistant's attempt to ask about Gas behavior first failed because it used an unsupported `question` field. The corrected clarification was sent, but no answer was received before the conversation moved on.
- Two patch attempts failed because their CSS context did not match the file. The changes were reapplied with matching context and by appending CSS.
- A later edit to cap the score at the scoreboard's six-digit capacity was interrupted by the user before any patch was applied. No score cap was added in that attempt.
