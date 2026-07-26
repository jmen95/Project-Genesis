using PetUniverse.Core;
using PetUniverse.Data;
using PetUniverse.Save;

namespace PetUniverse.Lab
{
    public static class LaboratoryProgression
    {
        public static bool CanUpgradeLab()
        {
            var save = SaveManager.Instance.Data;
            if (save.LabLevel >= GameConstants.MaxLabLevel)
            {
                return false;
            }

            var next = GetUpgradeDefinition(save.LabLevel + 1);
            return CurrencyService.Instance.CanAfford(next.CoinCost);
        }

        public static bool TryUpgradeLab()
        {
            var save = SaveManager.Instance.Data;
            if (save.LabLevel >= GameConstants.MaxLabLevel)
            {
                return false;
            }

            var nextLevel = save.LabLevel + 1;
            var upgrade = GetUpgradeDefinition(nextLevel);
            if (!CurrencyService.Instance.Spend(upgrade.CoinCost))
            {
                return false;
            }

            save.LabLevel = nextLevel;
            UnlockEggsForLevel(nextLevel);
            SaveManager.Instance.Save();
            AudioManager.Instance.Play(SoundId.LevelUp);
            return true;
        }

        public static LabUpgradeDefinition GetUpgradeDefinition(int level)
        {
            foreach (var upgrade in GameDatabase.AllLabUpgrades)
            {
                if (upgrade.Level == level)
                {
                    return upgrade;
                }
            }

            return GameDatabase.AllLabUpgrades[0];
        }

        static void UnlockEggsForLevel(int level)
        {
            var save = SaveManager.Instance.Data;
            foreach (var pair in GameDatabase.AllEggs)
            {
                if (pair.Value.RequiredLabLevel <= level && !save.UnlockedEggIds.Contains(pair.Key))
                {
                    save.UnlockedEggIds.Add(pair.Key);
                }
            }
        }
    }
}
