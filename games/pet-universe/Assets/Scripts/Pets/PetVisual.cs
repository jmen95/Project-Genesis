using PetUniverse.Effects;
using UnityEngine;

namespace PetUniverse.Pets
{
    public sealed class PetVisual : MonoBehaviour
    {
        Transform _body;
        Transform _face;
        Transform _accent;
        PetRuntimeModel _model;
        float _bouncePhase;

        public void Bind(PetRuntimeModel model)
        {
            _model = model;
            BuildVisual();
            ApplyMoodColor();
        }

        void Update()
        {
            if (_model == null || _body == null)
            {
                return;
            }

            _bouncePhase += Time.deltaTime * 2.5f;
            var bounce = Mathf.Sin(_bouncePhase) * 0.05f;
            _body.localPosition = new Vector3(0f, bounce, 0f);
            transform.Rotate(0f, 15f * Time.deltaTime, 0f, Space.World);
        }

        public void PlayInteractionBounce()
        {
            if (_body == null)
            {
                return;
            }

            StopAllCoroutines();
            StartCoroutine(BounceRoutine());
        }

        System.Collections.IEnumerator BounceRoutine()
        {
            var original = _body.localScale;
            var peak = original * 1.15f;
            var elapsed = 0f;
            const float duration = 0.2f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var t = elapsed / duration;
                _body.localScale = Vector3.LerpUnclamped(original, peak, Mathf.Sin(t * Mathf.PI));
                yield return null;
            }

            _body.localScale = original;
        }

        public void PlayHatchBurst()
        {
            ParticleFactory.SpawnBurst(transform.position + Vector3.up * 0.5f, _model.Species.AccentColor);
        }

        void BuildVisual()
        {
            foreach (Transform child in transform)
            {
                Destroy(child.gameObject);
            }

            var species = _model.Species;
            var bodyColor = new Color(_model.Data.ColorR, _model.Data.ColorG, _model.Data.ColorB);

            _body = CreatePrimitive(PrimitiveType.Sphere, "Body", transform, bodyColor, Vector3.zero, Vector3.one * 0.9f * species.BodyScale);
            _accent = CreatePrimitive(PrimitiveType.Sphere, "Accent", _body, species.AccentColor, new Vector3(0f, 0.35f, 0.2f), Vector3.one * 0.35f);
            _face = new GameObject("Face").transform;
            _face.SetParent(_body, false);
            _face.localPosition = new Vector3(0f, 0.15f, 0.45f);
            CreatePrimitive(PrimitiveType.Sphere, "EyeL", _face, Color.black, new Vector3(-0.12f, 0.05f, 0f), Vector3.one * 0.08f);
            CreatePrimitive(PrimitiveType.Sphere, "EyeR", _face, Color.black, new Vector3(0.12f, 0.05f, 0f), Vector3.one * 0.08f);
            CreatePrimitive(PrimitiveType.Sphere, "CheekL", _face, new Color(1f, 0.5f, 0.6f), new Vector3(-0.2f, -0.05f, 0f), Vector3.one * 0.06f);
            CreatePrimitive(PrimitiveType.Sphere, "CheekR", _face, new Color(1f, 0.5f, 0.6f), new Vector3(0.2f, -0.05f, 0f), Vector3.one * 0.06f);
        }

        void ApplyMoodColor()
        {
            if (_body == null)
            {
                return;
            }

            var renderer = _body.GetComponent<Renderer>();
            if (renderer == null)
            {
                return;
            }

            var baseColor = new Color(_model.Data.ColorR, _model.Data.ColorG, _model.Data.ColorB);
            var moodColor = _model.CurrentMood switch
            {
                PetMood.Ecstatic => Color.Lerp(baseColor, Color.white, 0.2f),
                PetMood.Sad => Color.Lerp(baseColor, Color.gray, 0.25f),
                PetMood.Exhausted => Color.Lerp(baseColor, new Color(0.6f, 0.65f, 0.8f), 0.3f),
                _ => baseColor,
            };
            RuntimeMaterials.SetColor(renderer.material, moodColor);
        }

        static Transform CreatePrimitive(PrimitiveType type, string name, Transform parent, Color color, Vector3 localPos, Vector3 scale)
        {
            var go = GameObject.CreatePrimitive(type);
            go.name = name;
            go.transform.SetParent(parent, false);
            go.transform.localPosition = localPos;
            go.transform.localScale = scale;
            PlaceholderVisuals.ApplyColor(go, color, 0.08f);

            var collider = go.GetComponent<Collider>();
            if (collider != null)
            {
                Destroy(collider);
            }

            return go.transform;
        }
    }
}
