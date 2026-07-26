using PetUniverse.Core;
using PetUniverse.Data;
using PetUniverse.Lab;
using PetUniverse.Save;
using TMPro;
using UnityEngine;

namespace PetUniverse.UI
{
    public static class ShopOverlay
    {
        public static GameObject Create(Transform parent, System.Action onClose)
        {
            var overlay = UIBuilder.CreatePanel(parent, "ShopOverlay", new Color(0f, 0f, 0f, 0.7f), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var panel = UIBuilder.CreatePanel(overlay, "Panel", new Color(0.98f, 0.95f, 1f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero);
            panel.sizeDelta = new Vector2(900f, 1200f);

            UIBuilder.CreateTitle(panel, "Tienda", 56, new Color(0.35f, 0.3f, 0.55f));

            var y = 0.82f;
            foreach (var pair in GameDatabase.AllEggs)
            {
                var egg = pair.Value;
                if (egg.RequiredLabLevel > SaveManager.Instance.Data.LabLevel + 1)
                {
                    continue;
                }

                CreateEggRow(panel, egg, y, overlay.gameObject, onClose);
                y -= 0.1f;
            }

            var upgrade = LaboratoryProgression.GetUpgradeDefinition(SaveManager.Instance.Data.LabLevel + 1);
            if (SaveManager.Instance.Data.LabLevel < GameConstants.MaxLabLevel)
            {
                var upgradeButton = UIBuilder.CreateButton(panel, $"Upgrade Lab ({upgrade.CoinCost}c)", new Vector2(0.1f, 0.12f), new Vector2(0.9f, 0.18f), Vector2.zero, new Color(0.55f, 0.85f, 1f), 30);
                upgradeButton.GetComponent<RectTransform>().offsetMin = Vector2.zero;
                upgradeButton.GetComponent<RectTransform>().offsetMax = Vector2.zero;
                upgradeButton.onClick.AddListener(() =>
                {
                    if (LaboratoryProgression.TryUpgradeLab())
                    {
                        AudioManager.Instance.Play(SoundId.Coin);
                    }
                });
            }

            var close = UIBuilder.CreateButton(panel, "Close", new Vector2(0.3f, 0.02f), new Vector2(0.7f, 0.08f), Vector2.zero, new Color(1f, 0.55f, 0.75f), 32);
            close.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            close.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            close.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                Object.Destroy(overlay.gameObject);
                onClose?.Invoke();
            });

            return overlay.gameObject;
        }

        static void CreateEggRow(Transform panel, EggDefinition egg, float anchorY, GameObject overlay, System.Action onClose)
        {
            var row = UIBuilder.CreatePanel(panel, egg.Id, new Color(0.9f, 0.88f, 1f), new Vector2(0.05f, anchorY), new Vector2(0.95f, anchorY + 0.08f), Vector2.zero, Vector2.zero);
            var label = $"{egg.DisplayName} — {egg.Cost}c (Lv {egg.RequiredLabLevel})";
            UIBuilder.CreateText(row, label, 28, new Color(0.25f, 0.25f, 0.35f), TextAlignmentOptions.MidlineLeft).rectTransform.offsetMin = new Vector2(20f, 0f);
            var buy = UIBuilder.CreateButton(row, "Buy & Hatch", new Vector2(0.62f, 0.15f), new Vector2(0.95f, 0.85f), Vector2.zero, new Color(0.75f, 0.55f, 1f), 24);
            buy.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            buy.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            buy.onClick.AddListener(() =>
            {
                var incubator = Object.FindFirstObjectByType<IncubatorSystem>();
                if (incubator != null && incubator.StartIncubation(egg.Id))
                {
                    AudioManager.Instance.Play(SoundId.Button);
                    Object.Destroy(overlay);
                    onClose?.Invoke();
                }
            });
        }
    }
}
