using PetUniverse.Data;
using PetUniverse.Effects;
using PetUniverse.Lab;
using PetUniverse.Pets;
using PetUniverse.UI;
using UnityEngine;

namespace PetUniverse.Scenes
{
    public sealed class LaboratorySceneController : MonoBehaviour
    {
        Transform _petAnchor;
        Transform _eggAnchor;
        PetVisual _petVisual;
        GameObject _eggVisual;
        GameObject _idleEggVisual;
        float _eggWobblePhase;

        public IncubatorSystem Incubator { get; private set; }
        public PetCareService PetCare { get; private set; }

        void Start()
        {
            BuildEnvironment();
            Incubator = gameObject.AddComponent<IncubatorSystem>();
            PetCare = gameObject.AddComponent<PetCareService>();
            PetCare.RefreshActivePet();
            RefreshPetVisual();
            RefreshEggVisual();
            ShowIdleEgg();

            var ui = gameObject.AddComponent<LaboratoryUIController>();
            ui.Initialize(this);

            Incubator.OnIncubationStarted += _ =>
            {
                HideIdleEgg();
                RefreshEggVisual();
            };
            Incubator.OnIncubationProgress += _ => RefreshEggVisual();
            Incubator.OnHatchComplete += pet =>
            {
                RefreshEggVisual();
                RefreshPetVisual();
                if (_petVisual != null)
                {
                    _petVisual.PlayHatchBurst();
                }
            };
        }

        void Update()
        {
            AnimateEgg();
        }

        void BuildEnvironment()
        {
            var camera = Camera.main;
            if (camera != null)
            {
                camera.clearFlags = CameraClearFlags.SolidColor;
                camera.backgroundColor = new Color(0.08f, 0.12f, 0.24f);
                camera.transform.position = new Vector3(0f, 1.55f, -5.2f);
                camera.transform.rotation = Quaternion.Euler(16f, 0f, 0f);
                camera.fieldOfView = 42f;
            }

            var anchors = LabEnvironmentBuilder.Build();
            _eggAnchor = anchors.EggAnchor;
            _petAnchor = anchors.PetAnchor;
        }

        void ShowIdleEgg()
        {
            if (PetCare.ActivePet != null || Incubator.IsIncubating)
            {
                return;
            }

            var starter = GameDatabase.GetEggOrDefault("starter-egg");
            _idleEggVisual = PlaceholderVisuals.CreateEgg(starter.EggColor, Color.white, false);
            _idleEggVisual.transform.SetParent(_eggAnchor, false);
            _idleEggVisual.transform.localPosition = Vector3.zero;
            _idleEggVisual.transform.localScale = Vector3.one * 1.15f;
        }

        void HideIdleEgg()
        {
            if (_idleEggVisual != null)
            {
                Destroy(_idleEggVisual);
                _idleEggVisual = null;
            }
        }

        void AnimateEgg()
        {
            var target = _eggVisual != null ? _eggVisual.transform : _idleEggVisual?.transform;
            if (target == null)
            {
                return;
            }

            _eggWobblePhase += Time.deltaTime * (Incubator != null && Incubator.IsIncubating ? 4f : 1.5f);
            var wobble = Mathf.Sin(_eggWobblePhase) * 0.05f;
            target.localPosition = new Vector3(0f, wobble, 0f);
            if (Incubator != null && Incubator.IsIncubating)
            {
                target.Rotate(0f, 25f * Time.deltaTime, 0f, Space.Self);
            }
        }

        public void RefreshPetVisual()
        {
            PetCare.RefreshActivePet();
            if (_petVisual != null)
            {
                Destroy(_petVisual.gameObject);
                _petVisual = null;
            }

            var pet = PetCare.ActivePet;
            if (pet == null)
            {
                ShowIdleEgg();
                return;
            }

            HideIdleEgg();
            var go = new GameObject("PetVisual");
            go.transform.SetParent(_petAnchor, false);
            go.transform.localScale = Vector3.one * 1.2f;
            _petVisual = go.AddComponent<PetVisual>();
            _petVisual.Bind(pet);
        }

        public void RefreshPetVisualAfterInteraction()
        {
            if (_petVisual != null)
            {
                _petVisual.PlayInteractionBounce();
            }

            RefreshPetVisual();
        }

        void RefreshEggVisual()
        {
            if (_eggVisual != null)
            {
                Destroy(_eggVisual);
                _eggVisual = null;
            }

            if (Incubator == null || !Incubator.IsIncubating)
            {
                if (PetCare.ActivePet == null)
                {
                    ShowIdleEgg();
                }

                return;
            }

            HideIdleEgg();
            var egg = GameDatabase.GetEggOrDefault(Incubator.ActiveEggId);
            _eggVisual = PlaceholderVisuals.CreateEgg(egg.EggColor, new Color(1f, 0.98f, 0.85f), true);
            _eggVisual.transform.SetParent(_eggAnchor, false);
            _eggVisual.transform.localPosition = Vector3.zero;
            _eggVisual.transform.localScale = Vector3.one * 1.15f;
        }
    }
}
