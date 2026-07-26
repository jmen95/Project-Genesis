using System;
using PetUniverse.Core;
using PetUniverse.Data;
using PetUniverse.Lab;
using PetUniverse.Pets;
using PetUniverse.Save;
using PetUniverse.Scenes;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace PetUniverse.UI
{
    public sealed class LaboratoryUIController : MonoBehaviour
    {
        LaboratorySceneController _scene;
        TextMeshProUGUI _coinText;
        TextMeshProUGUI _petInfoText;
        TextMeshProUGUI _statusText;
        TextMeshProUGUI _hintText;
        Slider _incubationSlider;
        TextMeshProUGUI _incubationLabel;
        Transform _canvasRoot;
        GameObject _shopPanel;
        GameObject _pausePanel;

        public void Initialize(LaboratorySceneController scene)
        {
            _scene = scene;
            BuildUI();
            RefreshCoins(CurrencyService.Instance.Coins);
            CurrencyService.Instance.OnCoinsChanged += RefreshCoins;
            _scene.PetCare.OnActivePetChanged += OnPetChanged;
            _scene.Incubator.OnIncubationProgress += OnIncubationProgress;
            _scene.Incubator.OnIncubationStarted += OnIncubationStarted;
            _scene.Incubator.OnHatchComplete += OnHatchComplete;
            RefreshPetInfo();
            UpdateFlowHint();
        }

        void OnDestroy()
        {
            if (CurrencyService.Instance != null)
            {
                CurrencyService.Instance.OnCoinsChanged -= RefreshCoins;
            }
        }

        void BuildUI()
        {
            var canvas = UIBuilder.CreateCanvas("LaboratoryCanvas");
            _canvasRoot = canvas.transform;

            UIBuilder.CreatePanel(canvas.transform, "TopBar", new Color(0.15f, 0.2f, 0.38f, 0.92f), new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(0f, -120f), Vector2.zero);

            _coinText = UIBuilder.CreateText(canvas.transform, "Coins: 0", 34, new Color(1f, 0.9f, 0.4f), TextAlignmentOptions.MidlineLeft);
            _coinText.rectTransform.anchorMin = new Vector2(0.04f, 1f);
            _coinText.rectTransform.anchorMax = new Vector2(0.55f, 1f);
            _coinText.rectTransform.offsetMin = new Vector2(0f, -100f);
            _coinText.rectTransform.offsetMax = Vector2.zero;

            var labText = UIBuilder.CreateText(canvas.transform, $"Lab Lv {SaveManager.Instance.Data.LabLevel}", 28, Color.white, TextAlignmentOptions.MidlineRight);
            labText.rectTransform.anchorMin = new Vector2(0.55f, 1f);
            labText.rectTransform.anchorMax = new Vector2(0.96f, 1f);
            labText.rectTransform.offsetMin = new Vector2(0f, -100f);
            labText.rectTransform.offsetMax = Vector2.zero;

            UIBuilder.CreatePanel(canvas.transform, "HintPanel", new Color(0.1f, 0.12f, 0.22f, 0.9f), new Vector2(0.04f, 0.84f), new Vector2(0.96f, 0.9f), Vector2.zero, Vector2.zero);
            _hintText = UIBuilder.CreateText(canvas.transform, "", 24, new Color(1f, 0.95f, 0.55f), TextAlignmentOptions.Center, true);
            _hintText.rectTransform.anchorMin = new Vector2(0.05f, 0.845f);
            _hintText.rectTransform.anchorMax = new Vector2(0.95f, 0.895f);
            _hintText.rectTransform.offsetMin = Vector2.zero;
            _hintText.rectTransform.offsetMax = Vector2.zero;
            _hintText.fontStyle = FontStyles.Bold;

            BuildViewportFrame(canvas.transform);

            _petInfoText = UIBuilder.CreateText(canvas.transform, "Sin mascota", 24, new Color(0.92f, 0.95f, 1f), TextAlignmentOptions.TopLeft, true);
            _petInfoText.rectTransform.anchorMin = new Vector2(0.04f, 0.24f);
            _petInfoText.rectTransform.anchorMax = new Vector2(0.96f, 0.32f);
            _petInfoText.rectTransform.offsetMin = Vector2.zero;
            _petInfoText.rectTransform.offsetMax = Vector2.zero;

            _statusText = UIBuilder.CreateText(canvas.transform, "", 22, new Color(0.85f, 0.9f, 1f), TextAlignmentOptions.Center);
            _statusText.rectTransform.anchorMin = new Vector2(0.04f, 0.18f);
            _statusText.rectTransform.anchorMax = new Vector2(0.96f, 0.24f);
            _statusText.rectTransform.offsetMin = Vector2.zero;
            _statusText.rectTransform.offsetMax = Vector2.zero;

            _incubationLabel = UIBuilder.CreateText(canvas.transform, "Incubando...", 20, new Color(0.9f, 0.8f, 1f), TextAlignmentOptions.Center);
            _incubationLabel.rectTransform.anchorMin = new Vector2(0.1f, 0.14f);
            _incubationLabel.rectTransform.anchorMax = new Vector2(0.9f, 0.18f);
            _incubationLabel.rectTransform.offsetMin = Vector2.zero;
            _incubationLabel.rectTransform.offsetMax = Vector2.zero;
            _incubationLabel.gameObject.SetActive(false);

            _incubationSlider = UIBuilder.CreateSlider(canvas.transform, "Incubation", new Color(0.75f, 0.55f, 1f));
            var sliderRect = _incubationSlider.GetComponent<RectTransform>();
            sliderRect.anchorMin = new Vector2(0.1f, 0.1f);
            sliderRect.anchorMax = new Vector2(0.9f, 0.14f);
            sliderRect.offsetMin = Vector2.zero;
            sliderRect.offsetMax = Vector2.zero;
            _incubationSlider.gameObject.SetActive(false);

            BuildInteractionButtons(canvas.transform);
            BuildBottomBar(canvas.transform);
        }

        void BuildViewportFrame(Transform parent)
        {
            var frameColor = new Color(0.45f, 0.75f, 1f, 0.55f);
            UIBuilder.CreatePanel(parent, "ViewportTop", frameColor, new Vector2(0.03f, 0.82f), new Vector2(0.97f, 0.84f), Vector2.zero, Vector2.zero);
            UIBuilder.CreatePanel(parent, "ViewportBottom", frameColor, new Vector2(0.03f, 0.33f), new Vector2(0.97f, 0.35f), Vector2.zero, Vector2.zero);
            UIBuilder.CreatePanel(parent, "ViewportLeft", frameColor, new Vector2(0.03f, 0.33f), new Vector2(0.05f, 0.84f), Vector2.zero, Vector2.zero);
            UIBuilder.CreatePanel(parent, "ViewportRight", frameColor, new Vector2(0.95f, 0.33f), new Vector2(0.97f, 0.84f), Vector2.zero, Vector2.zero);

            var leftLabel = UIBuilder.CreateText(parent, "← HUEVO", 22, new Color(0.5f, 0.9f, 1f), TextAlignmentOptions.MidlineLeft);
            leftLabel.rectTransform.anchorMin = new Vector2(0.06f, 0.8f);
            leftLabel.rectTransform.anchorMax = new Vector2(0.45f, 0.83f);
            leftLabel.rectTransform.offsetMin = Vector2.zero;
            leftLabel.rectTransform.offsetMax = Vector2.zero;

            var rightLabel = UIBuilder.CreateText(parent, "MASCOTA →", 22, new Color(1f, 0.9f, 0.45f), TextAlignmentOptions.MidlineRight);
            rightLabel.rectTransform.anchorMin = new Vector2(0.55f, 0.8f);
            rightLabel.rectTransform.anchorMax = new Vector2(0.94f, 0.83f);
            rightLabel.rectTransform.offsetMin = Vector2.zero;
            rightLabel.rectTransform.offsetMax = Vector2.zero;
        }

        void BuildInteractionButtons(Transform parent)
        {
            var interactions = new[]
            {
                (InteractionType.Feed, "Feed", new Color(1f, 0.7f, 0.45f)),
                (InteractionType.Play, "Play", new Color(0.55f, 0.85f, 1f)),
                (InteractionType.Rest, "Rest", new Color(0.65f, 0.75f, 1f)),
                (InteractionType.Pet, "Pet", new Color(1f, 0.6f, 0.8f)),
                (InteractionType.Clean, "Clean", new Color(0.55f, 1f, 0.75f)),
                (InteractionType.Train, "Train", new Color(1f, 0.85f, 0.45f)),
            };

            for (var i = 0; i < interactions.Length; i++)
            {
                var entry = interactions[i];
                var col = i % 3;
                var row = i / 3;
                var xMin = 0.06f + col * 0.31f;
                var xMax = xMin + 0.28f;
                var yMax = 0.48f - row * 0.1f;
                var yMin = yMax - 0.085f;
                var button = UIBuilder.CreateButton(parent, entry.Item2, new Vector2(xMin, yMin), new Vector2(xMax, yMax), Vector2.zero, entry.Item3, 24);
                var rect = button.GetComponent<RectTransform>();
                rect.offsetMin = Vector2.zero;
                rect.offsetMax = Vector2.zero;
                var interaction = entry.Item1;
                button.onClick.AddListener(() => OnInteraction(interaction));
            }
        }

        void BuildBottomBar(Transform parent)
        {
            UIBuilder.CreatePanel(parent, "BottomBar", new Color(0.12f, 0.14f, 0.26f, 0.9f), new Vector2(0f, 0f), new Vector2(1f, 0f), new Vector2(0f, 130f), Vector2.zero);

            var hatch = UIBuilder.CreateButton(parent, "Incubar huevo", new Vector2(0.05f, 0.02f), new Vector2(0.35f, 0.12f), Vector2.zero, new Color(0.75f, 0.55f, 1f), 28);
            hatch.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            hatch.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            hatch.onClick.AddListener(OnHatchClicked);

            var shop = UIBuilder.CreateButton(parent, "Tienda", new Vector2(0.37f, 0.02f), new Vector2(0.63f, 0.12f), Vector2.zero, new Color(1f, 0.75f, 0.4f), 28);
            shop.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            shop.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            shop.onClick.AddListener(ToggleShop);

            var pause = UIBuilder.CreateButton(parent, "⏸", new Vector2(0.65f, 0.02f), new Vector2(0.95f, 0.12f), Vector2.zero, new Color(0.7f, 0.7f, 0.85f), 34);
            pause.GetComponent<RectTransform>().offsetMin = Vector2.zero;
            pause.GetComponent<RectTransform>().offsetMax = Vector2.zero;
            pause.onClick.AddListener(TogglePause);
        }

        void OnInteraction(InteractionType interaction)
        {
            if (_scene.PetCare.Interact(interaction))
            {
                _scene.RefreshPetVisualAfterInteraction();
                RefreshPetInfo();
                RefreshStatus($"¡{interaction}! Tu mascota está contenta.");
                UpdateFlowHint();
            }
            else
            {
                RefreshStatus("Primero incuba un huevo.");
                AudioManager.Instance.Play(SoundId.Button);
            }
        }

        void OnHatchClicked()
        {
            if (_scene.Incubator.IsIncubating)
            {
                RefreshStatus("El huevo sigue incubando...");
                return;
            }

            if (_scene.PetCare.ActivePet != null)
            {
                RefreshStatus("Ya tienes una mascota. Cuídala con los botones de arriba.");
                return;
            }

            var eggId = SaveManager.Instance.Data.UnlockedEggIds.Count > 0
                ? SaveManager.Instance.Data.UnlockedEggIds[0]
                : "starter-egg";
            if (_scene.Incubator.StartIncubation(eggId))
            {
                _incubationSlider.gameObject.SetActive(true);
                _incubationLabel.gameObject.SetActive(true);
                RefreshStatus("El huevo está incubando. Mira la barra de progreso.");
                UpdateFlowHint();
            }
            else
            {
                RefreshStatus("No se pudo incubar. Revisa monedas o la tienda.");
            }
        }

        void ToggleShop()
        {
            AudioManager.Instance.Play(SoundId.Button);
            if (_shopPanel != null)
            {
                Destroy(_shopPanel);
                _shopPanel = null;
                return;
            }

            _shopPanel = ShopOverlay.Create(_canvasRoot, OnShopClosed);
        }

        void OnShopClosed()
        {
            _shopPanel = null;
            RefreshCoins(CurrencyService.Instance.Coins);
            RefreshPetInfo();
            UpdateFlowHint();
        }

        void TogglePause()
        {
            AudioManager.Instance.Play(SoundId.Button);
            if (_pausePanel != null)
            {
                Destroy(_pausePanel);
                _pausePanel = null;
                GameManager.Instance.SetPaused(false);
                return;
            }

            GameManager.Instance.SetPaused(true);
            _pausePanel = PauseOverlay.Create(_canvasRoot, () =>
            {
                _pausePanel = null;
            });
        }

        void RefreshCoins(int coins)
        {
            _coinText.text = $"Monedas: {coins}";
        }

        void OnPetChanged(PetRuntimeModel pet)
        {
            RefreshPetInfo();
            UpdateFlowHint();
        }

        void OnIncubationStarted(string eggId)
        {
            _incubationSlider.gameObject.SetActive(true);
            _incubationLabel.gameObject.SetActive(true);
            UpdateFlowHint();
        }

        void OnIncubationProgress(float progress)
        {
            _incubationSlider.gameObject.SetActive(true);
            _incubationLabel.gameObject.SetActive(true);
            _incubationSlider.value = progress;
            _incubationLabel.text = $"Incubando... {Mathf.RoundToInt(progress * 100)}%";
        }

        void OnHatchComplete(PetSaveData pet)
        {
            _incubationSlider.gameObject.SetActive(false);
            _incubationLabel.gameObject.SetActive(false);
            _scene.RefreshPetVisual();
            RefreshPetInfo();
            RefreshStatus($"¡{pet.Name} nació! Ahora cuídalo con los botones.");
            UpdateFlowHint();
        }

        void RefreshPetInfo()
        {
            var pet = _scene.PetCare.ActivePet;
            if (pet == null)
            {
                _petInfoText.text = "Sin mascota — el huevo está a la izquierda.";
                return;
            }

            var traits = string.Join(", ", pet.Data.Traits);
            _petInfoText.text =
                $"{pet.Data.Name} · {pet.Species.DisplayName} · Nv {pet.Data.Level}\n" +
                $"Felicidad {pet.Data.Happiness} · Hambre {pet.Data.Hunger} · Energía {pet.Data.Energy}\n" +
                $"Estado: {pet.CurrentMood} · Rasgos: {traits}";
        }

        void UpdateFlowHint()
        {
            if (_scene.Incubator.IsIncubating)
            {
                _hintText.text = "PASO 2 · Espera a que el huevo eclosione (barra morada)";
                return;
            }

            if (_scene.PetCare.ActivePet != null)
            {
                _hintText.text = "PASO 3 · Usa Feed, Play, Pet… para cuidar a tu mascota";
                return;
            }

            _hintText.text = "PASO 1 · Pulsa «Incubar huevo» abajo para empezar";
        }

        void RefreshStatus(string message = null)
        {
            if (!string.IsNullOrEmpty(message))
            {
                _statusText.text = message;
            }
        }
    }
}
