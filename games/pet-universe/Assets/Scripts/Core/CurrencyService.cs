using System;
using PetUniverse.Save;
using UnityEngine;

namespace PetUniverse.Core
{
    public sealed class CurrencyService : MonoBehaviour
    {
        public static CurrencyService Instance { get; private set; }

        public event Action<int> OnCoinsChanged;

        public int Coins => SaveManager.Instance.Data.Coins;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public bool CanAfford(int amount) => Coins >= amount;

        public bool Spend(int amount)
        {
            if (!CanAfford(amount))
            {
                return false;
            }

            SaveManager.Instance.Data.Coins -= amount;
            SaveManager.Instance.Save();
            OnCoinsChanged?.Invoke(Coins);
            return true;
        }

        public void Add(int amount)
        {
            if (amount <= 0)
            {
                return;
            }

            SaveManager.Instance.Data.Coins += amount;
            SaveManager.Instance.Save();
            OnCoinsChanged?.Invoke(Coins);
        }
    }
}
