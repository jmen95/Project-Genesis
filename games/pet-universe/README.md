# Pet Universe — MVP

Mobile-first pet laboratory game built with **Unity 6** and **URP**.

Discover eggs, hatch unique pets, care for them, earn coins, and upgrade your lab.

## Open in Unity

1. Install **Unity 6** (6000.0.x) with **Android/iOS Build Support** (optional for device builds).
2. Open `games/pet-universe` as a Unity project.
3. On first open, import **TextMesh Pro Essential Resources** when prompted  
   (`Window → TextMeshPro → Import TMP Essential Resources`).
4. Press **Play** — `MainMenu` is the entry scene.

## Controls

Portrait, one-handed UI:

- **Main Menu** — Play, Settings, Quit
- **Laboratory** — Hatch Egg, interact (Feed / Play / Rest / Pet / Clean / Train), Shop, Pause
- **Shop** — Buy eggs, upgrade lab
- **Settings** — Audio toggles and volume

## Core loop

```
Main Menu → Laboratory → Hatch Egg → Interact → Earn Coins → Shop / Upgrade → Repeat
```

## Architecture

```
Assets/Scripts/
  Core/       GameManager, Audio, Currency, Bootstrap, SceneAutoSetup
  Save/       JSON local save (Application.persistentDataPath)
  Data/       GameDatabase (species, eggs, lab upgrades)
  Pets/       Stats, traits, visuals, interactions
  Lab/        Incubator, pet care, progression
  UI/         Runtime-built canvas UI (placeholder art)
  Effects/    Particle bursts
  Scenes/     Laboratory scene controller
```

Save file: `pet_universe_save.json`

## Build

1. `File → Build Settings`
2. Scenes: `MainMenu`, `Laboratory` (pre-configured)
3. Switch platform to Android or iOS
4. Player Settings → Portrait orientation only
5. Build and Run

## MVP feature checklist

- [x] Main Menu (Play, Settings, Quit)
- [x] Laboratory scene with 3D placeholder environment
- [x] Egg incubator with timer and hatch VFX
- [x] Pet system (name, species, mood, energy, hunger, happiness, level, XP, traits)
- [x] Six interactions (Feed, Play, Rest, Pet, Clean, Train)
- [x] Coins and rewards per interaction / level-up
- [x] Shop (eggs + lab upgrades)
- [x] Lab levels 1–5 unlocking new eggs/species
- [x] JSON save/load (pets, coins, lab, incubation, settings)
- [x] Pause menu (Resume, Main Menu)
- [x] Settings (SFX/Music toggles and volume)
- [x] Procedural placeholder SFX (button, pet, coin, hatch, level-up)
- [x] Particle hatch burst
- [x] Portrait responsive UI (1080×1920 reference)
- [x] No multiplayer, backend, ads, or IAP

## Remaining technical debt

- Replace primitive placeholder meshes with authored art and animations
- Import real audio clips instead of procedural tones
- Add Input Actions asset for advanced gestures (optional)
- URP volume/profile tuning for mobile performance
- Unit tests with Unity Test Framework
- Addressables for content scaling (post-MVP)

## Future ideas (outside MVP)

- Daily care streaks and gentle missions
- Pet evolution forms
- Mini-games per trait
- Collection album / pokedex
- Seasonal egg events
- Cloud save (with parent gate)
- Cosmetic shop

## Sprint 2 recommendations

1. **Art pass** — Replace primitives with cute rigged pets and lab environment
2. **Animation** — Hatch sequence, idle moods, interaction reactions
3. **Juice** — Screen shake, coin fly VFX, mood bubbles
4. **Balancing** — Tune decay rates and economy for 30–90s sessions
5. **Mobile QA** — Test on mid-range Android + iPhone, thermal/FPS profiling
6. **Tutorial** — First-time guided hatch without text walls

## Genesis

This game lives under `games/pet-universe` and consumes Project Genesis framework conventions. It does not modify framework packages.
