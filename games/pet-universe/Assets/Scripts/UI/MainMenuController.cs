using PetUniverse.Core;
using UnityEngine;
using UnityEngine.UI;

namespace PetUniverse.UI
{
    public sealed class MainMenuController : MonoBehaviour
    {
        static readonly Color LabBlue = new(0.1f, 0.16f, 0.34f);
        static readonly Color LabPurple = new(0.22f, 0.12f, 0.38f);
        static readonly Color AccentYellow = new(1f, 0.88f, 0.25f);
        static readonly Color AccentCyan = new(0.35f, 0.82f, 1f);
        static readonly Color AccentMagenta = new(0.72f, 0.38f, 0.95f);

        void Start()
        {
            BuildUI();
        }

        void BuildUI()
        {
            var canvas = UIBuilder.CreateCanvas("MainMenuCanvas");
            UIBuilder.CreatePanel(canvas.transform, "BackgroundTop", LabPurple, new Vector2(0f, 0.45f), Vector2.one, Vector2.zero, Vector2.zero);
            UIBuilder.CreatePanel(canvas.transform, "BackgroundBottom", LabBlue, Vector2.zero, new Vector2(1f, 0.45f), Vector2.zero, Vector2.zero);

            var logoSprite = Resources.Load<Sprite>("UI/pet-universe-logo");
            if (logoSprite != null)
            {
                UIBuilder.CreateImage(
                    canvas.transform,
                    "Logo",
                    logoSprite,
                    new Vector2(0.08f, 0.42f),
                    new Vector2(0.92f, 0.98f),
                    Vector2.zero,
                    Vector2.zero);
            }
            else
            {
                var fallbackTitle = UIBuilder.CreateText(canvas.transform, "Pet Universe", 84, AccentYellow, TMPro.TextAlignmentOptions.Center);
                fallbackTitle.rectTransform.anchorMin = new Vector2(0.1f, 0.72f);
                fallbackTitle.rectTransform.anchorMax = new Vector2(0.9f, 0.95f);
                fallbackTitle.rectTransform.offsetMin = Vector2.zero;
                fallbackTitle.rectTransform.offsetMax = Vector2.zero;
            }

            var subtitle = UIBuilder.CreateText(canvas.transform, "Discover · Hatch · Love", 34, AccentCyan, TMPro.TextAlignmentOptions.Center);
            subtitle.rectTransform.anchorMin = new Vector2(0.08f, 0.36f);
            subtitle.rectTransform.anchorMax = new Vector2(0.92f, 0.42f);
            subtitle.rectTransform.offsetMin = Vector2.zero;
            subtitle.rectTransform.offsetMax = Vector2.zero;

            var howTo = UIBuilder.CreateText(canvas.transform, "Jugar → Incubar huevo → Cuidar mascota", 26, new Color(0.92f, 0.95f, 1f), TMPro.TextAlignmentOptions.Center);
            howTo.rectTransform.anchorMin = new Vector2(0.08f, 0.3f);
            howTo.rectTransform.anchorMax = new Vector2(0.92f, 0.36f);
            howTo.rectTransform.offsetMin = Vector2.zero;
            howTo.rectTransform.offsetMax = Vector2.zero;

            var play = UIBuilder.CreateButton(canvas.transform, "Jugar", new Vector2(0.5f, 0.2f), new Vector2(0.5f, 0.2f), new Vector2(520f, 110f), AccentYellow, 46);
            play.GetComponent<RectTransform>().anchoredPosition = Vector2.zero;
            play.GetComponent<Image>().color = AccentYellow;
            play.GetComponentInChildren<TMPro.TextMeshProUGUI>().color = new Color(0.15f, 0.2f, 0.35f);
            play.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                GameManager.Instance.LoadLaboratory();
            });

            var settings = UIBuilder.CreateButton(canvas.transform, "Ajustes", new Vector2(0.5f, 0.11f), new Vector2(0.5f, 0.11f), new Vector2(420f, 80f), AccentMagenta, 34);
            settings.GetComponent<RectTransform>().anchoredPosition = Vector2.zero;
            settings.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                SettingsOverlay.Show(canvas.transform);
            });

            var quit = UIBuilder.CreateButton(canvas.transform, "Salir", new Vector2(0.5f, 0.03f), new Vector2(0.5f, 0.03f), new Vector2(320f, 70f), new Color(0.35f, 0.42f, 0.62f), 30);
            quit.GetComponent<RectTransform>().anchoredPosition = Vector2.zero;
            quit.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                GameManager.Instance.QuitGame();
            });
        }
    }
}
