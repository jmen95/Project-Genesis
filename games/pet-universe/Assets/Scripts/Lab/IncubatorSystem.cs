using System;
using PetUniverse.Core;
using PetUniverse.Data;
using PetUniverse.Pets;
using PetUniverse.Save;
using UnityEngine;

namespace PetUniverse.Lab
{
    public sealed class IncubatorSystem : MonoBehaviour
    {
        public event Action<float> OnIncubationProgress;
        public event Action<PetSaveData> OnHatchComplete;
        public event Action<string> OnIncubationStarted;

        EggDefinition _activeEgg;
        float _remaining;

        public bool IsIncubating => _activeEgg != null && _remaining > 0f;
        public string ActiveEggId => _activeEgg?.Id ?? string.Empty;

        void Awake()
        {
            var save = SaveManager.Instance.Data;
            if (!string.IsNullOrEmpty(save.IncubatingEggId) && save.IncubationRemaining > 0f)
            {
                _activeEgg = GameDatabase.GetEggOrDefault(save.IncubatingEggId);
                _remaining = save.IncubationRemaining;
            }
        }

        void Update()
        {
            if (!IsIncubating)
            {
                return;
            }

            _remaining -= Time.deltaTime;
            SaveManager.Instance.Data.IncubationRemaining = _remaining;
            OnIncubationProgress?.Invoke(1f - _remaining / _activeEgg.HatchSeconds);

            if (_remaining > 0f)
            {
                return;
            }

            CompleteHatch();
        }

        public bool StartIncubation(string eggId)
        {
            if (IsIncubating)
            {
                return false;
            }

            var egg = GameDatabase.GetEggOrDefault(eggId);
            var save = SaveManager.Instance.Data;
            if (save.LabLevel < egg.RequiredLabLevel)
            {
                return false;
            }

            if (!save.UnlockedEggIds.Contains(eggId))
            {
                return false;
            }

            if (egg.Cost > 0 && !CurrencyService.Instance.Spend(egg.Cost))
            {
                return false;
            }

            _activeEgg = egg;
            _remaining = egg.HatchSeconds;
            save.IncubatingEggId = egg.Id;
            save.IncubationRemaining = _remaining;
            SaveManager.Instance.Save();
            OnIncubationStarted?.Invoke(egg.Id);
            AudioManager.Instance.Play(SoundId.Button);
            return true;
        }

        void CompleteHatch()
        {
            var speciesPool = _activeEgg.PossibleSpeciesIds;
            var speciesId = speciesPool.Length == 0 ? "blob" : speciesPool[UnityEngine.Random.Range(0, speciesPool.Length)];
            var pet = PetFactory.CreateNewPet(speciesId);
            var save = SaveManager.Instance.Data;
            save.Pets.Add(pet);
            save.ActivePetId = pet.Id;
            if (!save.OwnedSpeciesIds.Contains(speciesId))
            {
                save.OwnedSpeciesIds.Add(speciesId);
            }

            save.IncubatingEggId = string.Empty;
            save.IncubationRemaining = 0f;
            SaveManager.Instance.Save();
            AudioManager.Instance.Play(SoundId.Hatch);
            OnHatchComplete?.Invoke(pet);
            _activeEgg = null;
            _remaining = 0f;
        }
    }
}
