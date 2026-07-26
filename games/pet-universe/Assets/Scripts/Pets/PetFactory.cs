using System;
using System.Collections.Generic;
using PetUniverse.Data;
using PetUniverse.Save;
using UnityEngine;

namespace PetUniverse.Pets
{
    public sealed class PetFactory
    {
        public static PetSaveData CreateNewPet(string speciesId)
        {
            var species = GameDatabase.GetSpeciesOrDefault(speciesId);
            var traits = GameDatabase.RollTraits(UnityEngine.Random.Range(3, 6));
            var traitNames = new List<string>();
            foreach (var trait in traits)
            {
                traitNames.Add(trait.ToString());
            }

            return new PetSaveData
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = GameDatabase.GeneratePetName(),
                SpeciesId = species.Id,
                Level = 1,
                Experience = 0,
                Energy = UnityEngine.Random.Range(65, 90),
                Hunger = UnityEngine.Random.Range(55, 80),
                Happiness = UnityEngine.Random.Range(60, 85),
                Mood = PetMood.Happy.ToString(),
                Traits = traitNames,
                ColorR = species.BodyColor.r,
                ColorG = species.BodyColor.g,
                ColorB = species.BodyColor.b,
                LastPlayedUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            };
        }
    }
}
