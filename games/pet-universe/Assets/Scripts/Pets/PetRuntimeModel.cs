using System;
using System.Collections.Generic;
using PetUniverse.Core;
using PetUniverse.Data;
using PetUniverse.Save;
using UnityEngine;

namespace PetUniverse.Pets
{
    public sealed class PetRuntimeModel
    {
        public PetSaveData Data { get; }

        public PetRuntimeModel(PetSaveData data)
        {
            Data = data;
        }

        public PetMood CurrentMood => EvaluateMood();

        public PetSpeciesDefinition Species => GameDatabase.GetSpeciesOrDefault(Data.SpeciesId);

        public void ApplyInteraction(InteractionType interaction)
        {
            var hungerMod = 1f;
            var energyMod = 1f;
            var happyMod = 1f;
            var xpGain = 8;

            foreach (var traitName in Data.Traits)
            {
                if (!Enum.TryParse<PetTrait>(traitName, out var trait))
                {
                    continue;
                }

                switch (trait)
                {
                    case PetTrait.Playful:
                        if (interaction == InteractionType.Play) happyMod += 0.2f;
                        break;
                    case PetTrait.Lazy:
                        if (interaction == InteractionType.Rest) energyMod += 0.25f;
                        break;
                    case PetTrait.Energetic:
                        if (interaction == InteractionType.Train) xpGain += 3;
                        break;
                    case PetTrait.Greedy:
                        if (interaction == InteractionType.Feed) hungerMod += 0.2f;
                        break;
                    case PetTrait.Shy:
                        if (interaction == InteractionType.Pet) happyMod -= 0.1f;
                        break;
                    case PetTrait.Friendly:
                        if (interaction == InteractionType.Pet) happyMod += 0.15f;
                        break;
                }
            }

            switch (interaction)
            {
                case InteractionType.Feed:
                    Data.Hunger = Clamp(Data.Hunger + Mathf.RoundToInt(22 * hungerMod));
                    Data.Energy = Clamp(Data.Energy + 5);
                    AudioManager.Instance.Play(SoundId.Feed);
                    break;
                case InteractionType.Play:
                    Data.Happiness = Clamp(Data.Happiness + Mathf.RoundToInt(18 * happyMod));
                    Data.Energy = Clamp(Data.Energy - 12);
                    Data.Hunger = Clamp(Data.Hunger - 8);
                    AudioManager.Instance.Play(SoundId.Play);
                    break;
                case InteractionType.Rest:
                    Data.Energy = Clamp(Data.Energy + Mathf.RoundToInt(28 * energyMod));
                    Data.Hunger = Clamp(Data.Hunger - 5);
                    AudioManager.Instance.Play(SoundId.Pet);
                    break;
                case InteractionType.Pet:
                    Data.Happiness = Clamp(Data.Happiness + Mathf.RoundToInt(12 * happyMod));
                    AudioManager.Instance.Play(SoundId.Pet);
                    break;
                case InteractionType.Clean:
                    Data.Happiness = Clamp(Data.Happiness + 10);
                    Data.Hunger = Clamp(Data.Hunger - 3);
                    AudioManager.Instance.Play(SoundId.Pet);
                    break;
                case InteractionType.Train:
                    Data.Energy = Clamp(Data.Energy - 15);
                    Data.Hunger = Clamp(Data.Hunger - 10);
                    Data.Happiness = Clamp(Data.Happiness + 6);
                    xpGain += 4;
                    AudioManager.Instance.Play(SoundId.Play);
                    break;
            }

            GainExperience(xpGain);
            Data.Mood = CurrentMood.ToString();
            Data.LastPlayedUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            CurrencyService.Instance.Add(GameConstants.BaseCoinsPerInteraction);
            AudioManager.Instance.Play(SoundId.Coin);
        }

        public void TickNeeds(float deltaMinutes)
        {
            Data.Hunger = Clamp(Data.Hunger - Mathf.RoundToInt(deltaMinutes * 1.5f));
            Data.Energy = Clamp(Data.Energy - Mathf.RoundToInt(deltaMinutes * 1f));
            if (Data.Hunger < 35 || Data.Energy < 30)
            {
                Data.Happiness = Clamp(Data.Happiness - Mathf.RoundToInt(deltaMinutes * 0.8f));
            }

            Data.Mood = CurrentMood.ToString();
        }

        void GainExperience(int amount)
        {
            Data.Experience += amount;
            var required = RequiredExperienceForLevel(Data.Level);
            while (Data.Experience >= required)
            {
                Data.Experience -= required;
                Data.Level += 1;
                Data.Happiness = Clamp(Data.Happiness + 15);
                CurrencyService.Instance.Add(GameConstants.LevelUpCoinBonus);
                AudioManager.Instance.Play(SoundId.LevelUp);
                required = RequiredExperienceForLevel(Data.Level);
            }
        }

        static int RequiredExperienceForLevel(int level) => 40 + level * 20;

        static int Clamp(int value) => Mathf.Clamp(value, GameConstants.MinStat, GameConstants.MaxStat);

        PetMood EvaluateMood()
        {
            if (Data.Energy < 20)
            {
                return PetMood.Exhausted;
            }

            if (Data.Happiness >= 80 && Data.Hunger >= 50)
            {
                return PetMood.Ecstatic;
            }

            if (Data.Happiness >= 55)
            {
                return PetMood.Happy;
            }

            if (Data.Happiness >= 35)
            {
                return PetMood.Neutral;
            }

            return PetMood.Sad;
        }
    }
}
