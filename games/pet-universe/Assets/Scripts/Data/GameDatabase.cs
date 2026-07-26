using System;
using System.Collections.Generic;
using PetUniverse.Pets;
using UnityEngine;

namespace PetUniverse.Data
{
    [Serializable]
    public sealed class PetSpeciesDefinition
    {
        public string Id;
        public string DisplayName;
        public int UnlockLabLevel = 1;
        public Color BodyColor = new(0.9f, 0.5f, 0.8f);
        public Color AccentColor = new(1f, 0.85f, 0.4f);
        public float BodyScale = 1f;
    }

    [Serializable]
    public sealed class EggDefinition
    {
        public string Id;
        public string DisplayName;
        public int Cost;
        public int RequiredLabLevel = 1;
        public string[] PossibleSpeciesIds = Array.Empty<string>();
        public Color EggColor = new(0.75f, 0.55f, 1f);
        public float HatchSeconds = 3f;
    }

    [Serializable]
    public sealed class LabUpgradeDefinition
    {
        public int Level;
        public string Title;
        public int CoinCost;
        public string Description;
    }

    public static class GameDatabase
    {
        static readonly Dictionary<string, PetSpeciesDefinition> Species = new();
        static readonly Dictionary<string, EggDefinition> Eggs = new();
        static readonly List<LabUpgradeDefinition> LabUpgrades = new();
        static readonly string[] NamePrefixes = { "Bubbles", "Zippy", "Luna", "Pip", "Nori", "Mochi", "Spark", "Coco", "Pixel", "Glim" };
        static readonly string[] NameSuffixes = { "pop", "bean", "wing", "puff", "star", "zoom", "dot", "flare", "whirl", "byte" };
        static readonly System.Random Rng = new();

        public static IReadOnlyDictionary<string, PetSpeciesDefinition> AllSpecies => Species;
        public static IReadOnlyDictionary<string, EggDefinition> AllEggs => Eggs;
        public static IReadOnlyList<LabUpgradeDefinition> AllLabUpgrades => LabUpgrades;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        static void Initialize()
        {
            if (Species.Count > 0)
            {
                return;
            }

            RegisterSpecies("blob", "Blobling", 1, new Color(0.55f, 0.85f, 1f), new Color(1f, 0.9f, 0.5f));
            RegisterSpecies("fluff", "Fluffern", 1, new Color(1f, 0.7f, 0.85f), new Color(0.7f, 0.9f, 1f));
            RegisterSpecies("spark", "Sparkite", 2, new Color(1f, 0.85f, 0.35f), new Color(1f, 0.5f, 0.3f));
            RegisterSpecies("moss", "Mossling", 2, new Color(0.45f, 0.9f, 0.55f), new Color(0.8f, 0.6f, 0.35f));
            RegisterSpecies("crystal", "Crystalox", 3, new Color(0.65f, 0.55f, 1f), new Color(0.9f, 0.95f, 1f));
            RegisterSpecies("ember", "Emberoo", 4, new Color(1f, 0.45f, 0.35f), new Color(1f, 0.75f, 0.25f));
            RegisterSpecies("cloud", "Cloudlet", 5, new Color(0.9f, 0.95f, 1f), new Color(0.75f, 0.8f, 1f));

            RegisterEgg("starter-egg", "Starter Egg", 0, 1, new[] { "blob", "fluff" }, new Color(0.98f, 0.95f, 0.88f));
            RegisterEgg("spark-egg", "Spark Egg", 40, 2, new[] { "spark", "fluff" }, new Color(1f, 0.88f, 0.35f));
            RegisterEgg("forest-egg", "Forest Egg", 75, 2, new[] { "moss", "blob" }, new Color(0.55f, 0.9f, 0.5f));
            RegisterEgg("crystal-egg", "Crystal Egg", 120, 3, new[] { "crystal", "spark" }, new Color(0.75f, 0.65f, 1f));
            RegisterEgg("ember-egg", "Ember Egg", 180, 4, new[] { "ember", "crystal" }, new Color(1f, 0.55f, 0.3f));
            RegisterEgg("cloud-egg", "Cloud Egg", 250, 5, new[] { "cloud", "ember" }, new Color(0.92f, 0.96f, 1f));

            LabUpgrades.Add(new LabUpgradeDefinition { Level = 1, Title = "Starter Lab", CoinCost = 0, Description = "Basic incubator and two egg types." });
            LabUpgrades.Add(new LabUpgradeDefinition { Level = 2, Title = "Spark Lab", CoinCost = 100, Description = "Unlock Spark and Forest eggs." });
            LabUpgrades.Add(new LabUpgradeDefinition { Level = 3, Title = "Crystal Lab", CoinCost = 200, Description = "Unlock Crystal eggs and new species." });
            LabUpgrades.Add(new LabUpgradeDefinition { Level = 4, Title = "Ember Lab", CoinCost = 350, Description = "Unlock Ember eggs." });
            LabUpgrades.Add(new LabUpgradeDefinition { Level = 5, Title = "Cloud Lab", CoinCost = 500, Description = "Unlock legendary Cloud eggs." });
        }

        static void RegisterSpecies(string id, string name, int unlockLevel, Color body, Color accent)
        {
            Species[id] = new PetSpeciesDefinition
            {
                Id = id,
                DisplayName = name,
                UnlockLabLevel = unlockLevel,
                BodyColor = body,
                AccentColor = accent,
            };
        }

        static void RegisterEgg(string id, string name, int cost, int labLevel, string[] species, Color color)
        {
            Eggs[id] = new EggDefinition
            {
                Id = id,
                DisplayName = name,
                Cost = cost,
                RequiredLabLevel = labLevel,
                PossibleSpeciesIds = species,
                EggColor = color,
            };
        }

        public static string GeneratePetName()
        {
            var prefix = NamePrefixes[Rng.Next(NamePrefixes.Length)];
            var suffix = NameSuffixes[Rng.Next(NameSuffixes.Length)];
            return $"{prefix}{suffix}";
        }

        public static List<PetTrait> RollTraits(int count = 3)
        {
            var pool = new List<PetTrait>((PetTrait[])Enum.GetValues(typeof(PetTrait)));
            var traits = new List<PetTrait>();
            while (traits.Count < count && pool.Count > 0)
            {
                var index = Rng.Next(pool.Count);
                traits.Add(pool[index]);
                pool.RemoveAt(index);
            }

            return traits;
        }

        public static PetSpeciesDefinition GetSpeciesOrDefault(string speciesId)
        {
            return Species.TryGetValue(speciesId, out var species) ? species : Species["blob"];
        }

        public static EggDefinition GetEggOrDefault(string eggId)
        {
            return Eggs.TryGetValue(eggId, out var egg) ? egg : Eggs["starter-egg"];
        }
    }
}
