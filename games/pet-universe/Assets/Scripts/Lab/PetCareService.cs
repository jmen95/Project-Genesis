using System;
using PetUniverse.Pets;
using PetUniverse.Save;
using UnityEngine;

namespace PetUniverse.Lab
{
    public sealed class PetCareService : MonoBehaviour
    {
        PetRuntimeModel _activePet;

        public PetRuntimeModel ActivePet => _activePet;
        public event Action<PetRuntimeModel> OnActivePetChanged;

        float _decayTimer;

        public void RefreshActivePet()
        {
            var save = SaveManager.Instance.Data;
            PetSaveData data = null;
            if (!string.IsNullOrEmpty(save.ActivePetId))
            {
                foreach (var pet in save.Pets)
                {
                    if (pet.Id == save.ActivePetId)
                    {
                        data = pet;
                        break;
                    }
                }
            }

            if (data == null && save.Pets.Count > 0)
            {
                data = save.Pets[0];
                save.ActivePetId = data.Id;
                SaveManager.Instance.Save();
            }

            _activePet = data != null ? new PetRuntimeModel(data) : null;
            OnActivePetChanged?.Invoke(_activePet);
        }

        public bool Interact(InteractionType interaction)
        {
            if (_activePet == null)
            {
                return false;
            }

            _activePet.ApplyInteraction(interaction);
            SaveManager.Instance.Save();
            return true;
        }

        void Update()
        {
            if (_activePet == null)
            {
                return;
            }

            _decayTimer += Time.deltaTime;
            if (_decayTimer < 5f)
            {
                return;
            }

            _decayTimer = 0f;
            _activePet.TickNeeds(5f / 60f);
            SaveManager.Instance.Save();
        }
    }
}
