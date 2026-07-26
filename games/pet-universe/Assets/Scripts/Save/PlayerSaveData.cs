using System;
using System.Collections.Generic;

namespace PetUniverse.Save
{
    [Serializable]
    public sealed class GameSettingsData
    {
        public float MasterVolume = 1f;
        public float SfxVolume = 1f;
        public float MusicVolume = 0.6f;
        public bool SfxEnabled = true;
        public bool MusicEnabled = true;
    }

    [Serializable]
    public sealed class PetSaveData
    {
        public string Id = string.Empty;
        public string Name = string.Empty;
        public string SpeciesId = string.Empty;
        public int Level = 1;
        public int Experience;
        public int Energy = 80;
        public int Hunger = 70;
        public int Happiness = 75;
        public string Mood = "Happy";
        public List<string> Traits = new();
        public float ColorR = 1f;
        public float ColorG = 0.6f;
        public float ColorB = 0.8f;
        public long LastPlayedUnix;
    }

    [Serializable]
    public sealed class PlayerSaveData
    {
        public int Coins = 50;
        public int LabLevel = 1;
        public int LabExperience;
        public string ActivePetId = string.Empty;
        public string IncubatingEggId = string.Empty;
        public float IncubationRemaining;
        public List<string> UnlockedEggIds = new() { "starter-egg" };
        public List<string> OwnedSpeciesIds = new();
        public List<PetSaveData> Pets = new();
        public GameSettingsData Settings = new();
        public long LastSaveUnix;
    }
}
