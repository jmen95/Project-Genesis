using PetUniverse.Core;
using PetUniverse.Save;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace PetUniverse.UI
{
    public static class SettingsOverlay
    {
        public static void Show(Transform parent)
        {
            var existing = parent.Find("SettingsOverlay");
            if (existing != null)
            {
                Object.Destroy(existing.gameObject);
            }

            var overlay = UIBuilder.CreatePanel(parent, "SettingsOverlay", new Color(0f, 0f, 0f, 0.75f), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var panel = UIBuilder.CreatePanel(overlay, "Panel", new Color(0.95f, 0.92f, 1f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero);
            panel.sizeDelta = new Vector2(800f, 900f);

            var title = UIBuilder.CreateTitle(panel, "Ajustes", 56, new Color(0.35f, 0.3f, 0.55f));

            var settings = SaveManager.Instance.Data.Settings;
            CreateToggle(panel, "Sound Effects", settings.SfxEnabled, 0.7f, value =>
            {
                settings.SfxEnabled = value;
                SaveManager.Instance.Save();
            });
            CreateToggle(panel, "Music", settings.MusicEnabled, 0.58f, value =>
            {
                settings.MusicEnabled = value;
                AudioManager.Instance.ApplySettings();
                SaveManager.Instance.Save();
            });
            CreateSlider(panel, "SFX Volume", settings.SfxVolume, 0.46f, value =>
            {
                settings.SfxVolume = value;
                AudioManager.Instance.ApplySettings();
                SaveManager.Instance.Save();
            });
            CreateSlider(panel, "Music Volume", settings.MusicVolume, 0.34f, value =>
            {
                settings.MusicVolume = value;
                AudioManager.Instance.ApplySettings();
                SaveManager.Instance.Save();
            });

            var close = UIBuilder.CreateButton(panel, "Close", new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(300f, 80f), new Color(1f, 0.55f, 0.75f), 32);
            close.GetComponent<RectTransform>().anchoredPosition = new Vector2(0f, 50f);
            close.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                Object.Destroy(overlay.gameObject);
            });
        }

        static void CreateToggle(Transform parent, string label, bool initial, float anchorY, System.Action<bool> onChanged)
        {
            var row = new GameObject(label, typeof(RectTransform));
            row.transform.SetParent(parent, false);
            var rect = row.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.05f, anchorY);
            rect.anchorMax = new Vector2(0.95f, anchorY + 0.08f);
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            var text = UIBuilder.CreateText(row.transform, label, 34, new Color(0.25f, 0.25f, 0.35f), TextAlignmentOptions.MidlineLeft);
            text.rectTransform.anchorMin = Vector2.zero;
            text.rectTransform.anchorMax = new Vector2(0.7f, 1f);
            var toggleGo = new GameObject("Toggle", typeof(RectTransform), typeof(Toggle), typeof(Image));
            toggleGo.transform.SetParent(row.transform, false);
            var toggleRect = toggleGo.GetComponent<RectTransform>();
            toggleRect.anchorMin = new Vector2(0.75f, 0.1f);
            toggleRect.anchorMax = new Vector2(0.95f, 0.9f);
            toggleRect.offsetMin = Vector2.zero;
            toggleRect.offsetMax = Vector2.zero;
            var image = toggleGo.GetComponent<Image>();
            image.color = new Color(0.8f, 0.8f, 0.9f);
            var toggle = toggleGo.GetComponent<Toggle>();
            toggle.isOn = initial;
            toggle.onValueChanged.AddListener(value => onChanged(value));
        }

        static void CreateSlider(Transform parent, string label, float initial, float anchorY, System.Action<float> onChanged)
        {
            var row = new GameObject(label, typeof(RectTransform));
            row.transform.SetParent(parent, false);
            var rect = row.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.05f, anchorY);
            rect.anchorMax = new Vector2(0.95f, anchorY + 0.08f);
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            UIBuilder.CreateText(row.transform, label, 30, new Color(0.25f, 0.25f, 0.35f), TextAlignmentOptions.TopLeft);
            var slider = UIBuilder.CreateSlider(row.transform, label + "Slider", new Color(0.55f, 0.8f, 1f));
            var sliderRect = slider.GetComponent<RectTransform>();
            sliderRect.anchorMin = new Vector2(0f, 0f);
            sliderRect.anchorMax = new Vector2(1f, 0.45f);
            sliderRect.offsetMin = Vector2.zero;
            sliderRect.offsetMax = Vector2.zero;
            slider.interactable = true;
            slider.value = initial;
            slider.onValueChanged.AddListener(value => onChanged(value));
        }
    }
}
