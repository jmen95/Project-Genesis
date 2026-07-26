using PetUniverse.Core;
using UnityEngine;

namespace PetUniverse.UI
{
    public static class PauseOverlay
    {
        public static GameObject Create(Transform parent, System.Action onClose)
        {
            var overlay = UIBuilder.CreatePanel(parent, "PauseOverlay", new Color(0f, 0f, 0f, 0.8f), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var panel = UIBuilder.CreatePanel(overlay, "Panel", new Color(0.95f, 0.92f, 1f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, Vector2.zero);
            panel.sizeDelta = new Vector2(700f, 520f);

            UIBuilder.CreateTitle(panel, "Pausa", 56, new Color(0.35f, 0.3f, 0.55f));

            var resume = UIBuilder.CreateButton(panel, "Continuar", new Vector2(0.12f, 0.48f), new Vector2(0.88f, 0.62f), Vector2.zero, new Color(0.55f, 0.85f, 1f), 36);
            resume.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            resume.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            resume.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                GameManager.Instance.SetPaused(false);
                Object.Destroy(overlay.gameObject);
                onClose?.Invoke();
            });

            var menu = UIBuilder.CreateButton(panel, "Menú principal", new Vector2(0.12f, 0.3f), new Vector2(0.88f, 0.44f), Vector2.zero, new Color(1f, 0.75f, 0.4f), 34);
            menu.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            menu.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            menu.onClick.AddListener(() =>
            {
                AudioManager.Instance.Play(SoundId.Button);
                GameManager.Instance.SetPaused(false);
                GameManager.Instance.LoadMainMenu();
            });

            return overlay.gameObject;
        }
    }
}
