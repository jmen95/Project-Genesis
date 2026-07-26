using PetUniverse.Core;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace PetUniverse.UI
{
    public static class UIBuilder
    {
        public static Canvas CreateCanvas(string name)
        {
            var canvasGo = new GameObject(name);
            var canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasGo.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(GameConstants.PortraitWidth, GameConstants.PortraitHeight);
            scaler.matchWidthOrHeight = 0.5f;
            canvasGo.AddComponent<GraphicRaycaster>();
            return canvas;
        }

        public static RectTransform CreatePanel(Transform parent, string name, Color color, Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(Image));
            go.transform.SetParent(parent, false);
            var image = go.GetComponent<Image>();
            image.color = color;
            var rect = go.GetComponent<RectTransform>();
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.offsetMin = offsetMin;
            rect.offsetMax = offsetMax;
            return rect;
        }

        public static Button CreateButton(Transform parent, string label, Vector2 anchorMin, Vector2 anchorMax, Vector2 size, Color color, int fontSize = 36)
        {
            var panel = CreatePanel(parent, label + "Button", color, anchorMin, anchorMax, Vector2.zero, Vector2.zero);
            panel.sizeDelta = size;
            var button = panel.gameObject.AddComponent<Button>();
            var text = CreateText(panel, label, fontSize, Color.white, TextAlignmentOptions.Center, false);
            text.rectTransform.anchorMin = Vector2.zero;
            text.rectTransform.anchorMax = Vector2.one;
            text.rectTransform.offsetMin = new Vector2(8f, 4f);
            text.rectTransform.offsetMax = new Vector2(-8f, -4f);
            ConfigureSingleLineLabel(text);
            return button;
        }

        public static Image CreateImage(Transform parent, string name, Sprite sprite, Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(Image));
            go.transform.SetParent(parent, false);
            var image = go.GetComponent<Image>();
            image.sprite = sprite;
            image.preserveAspect = true;
            var rect = go.GetComponent<RectTransform>();
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.offsetMin = offsetMin;
            rect.offsetMax = offsetMax;
            return image;
        }

        public static TextMeshProUGUI CreateText(Transform parent, string text, int fontSize, Color color, TextAlignmentOptions alignment, bool enableWordWrap = false)
        {
            var go = new GameObject("Text", typeof(RectTransform));
            go.transform.SetParent(parent, false);
            var tmp = go.AddComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = fontSize;
            tmp.color = color;
            tmp.alignment = alignment;
            tmp.enableWordWrapping = enableWordWrap;
            tmp.overflowMode = enableWordWrap ? TextOverflowModes.Ellipsis : TextOverflowModes.Overflow;
            return tmp;
        }

        public static void ConfigureSingleLineLabel(TextMeshProUGUI tmp)
        {
            tmp.enableWordWrapping = false;
            tmp.overflowMode = TextOverflowModes.Overflow;
            tmp.enableAutoSizing = true;
            tmp.fontSizeMin = 16;
            tmp.fontSizeMax = tmp.fontSize;
        }

        public static TextMeshProUGUI CreateTitle(Transform parent, string text, int fontSize, Color color)
        {
            var title = CreateText(parent, text, fontSize, color, TextAlignmentOptions.Center, false);
            title.rectTransform.anchorMin = new Vector2(0f, 1f);
            title.rectTransform.anchorMax = new Vector2(1f, 1f);
            title.rectTransform.pivot = new Vector2(0.5f, 1f);
            title.rectTransform.offsetMin = new Vector2(24f, -120f);
            title.rectTransform.offsetMax = new Vector2(-24f, -24f);
            ConfigureSingleLineLabel(title);
            return title;
        }

        public static Slider CreateSlider(Transform parent, string name, Color fillColor)
        {
            var root = new GameObject(name, typeof(RectTransform), typeof(Slider));
            root.transform.SetParent(parent, false);
            var slider = root.GetComponent<Slider>();
            var background = CreatePanel(root.transform, "Background", new Color(0.2f, 0.2f, 0.25f, 0.9f), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            var fillArea = CreatePanel(root.transform, "Fill Area", Color.clear, Vector2.zero, Vector2.one, new Vector2(10f, 6f), new Vector2(-10f, -6f));
            var fill = CreatePanel(fillArea, "Fill", fillColor, Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            slider.fillRect = fill;
            slider.targetGraphic = fill.GetComponent<Image>();
            slider.interactable = false;
            slider.minValue = 0f;
            slider.maxValue = 1f;
            return slider;
        }
    }
}
