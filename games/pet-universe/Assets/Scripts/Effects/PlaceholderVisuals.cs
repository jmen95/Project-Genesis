using UnityEngine;

namespace PetUniverse.Effects
{
    public static class PlaceholderVisuals
    {
        public static GameObject CreateEgg(Color bodyColor, Color accentColor, bool glowing)
        {
            var root = new GameObject("Egg");
            var body = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            body.name = "EggBody";
            body.transform.SetParent(root.transform, false);
            body.transform.localScale = new Vector3(0.62f, 0.92f, 0.62f);
            RuntimeMaterials.ApplyToRenderer(body.GetComponent<Renderer>(), bodyColor, glowing ? 0.25f : 0f);

            var highlight = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            highlight.name = "EggHighlight";
            highlight.transform.SetParent(root.transform, false);
            highlight.transform.localPosition = new Vector3(-0.1f, 0.16f, 0.14f);
            highlight.transform.localScale = Vector3.one * 0.16f;
            RuntimeMaterials.ApplyToRenderer(highlight.GetComponent<Renderer>(), accentColor, 0.1f);

            var spotA = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            spotA.name = "EggSpotA";
            spotA.transform.SetParent(root.transform, false);
            spotA.transform.localPosition = new Vector3(0.12f, -0.02f, 0.16f);
            spotA.transform.localScale = Vector3.one * 0.09f;
            RuntimeMaterials.ApplyToRenderer(spotA.GetComponent<Renderer>(), new Color(0.55f, 0.35f, 0.85f));

            var spotB = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            spotB.name = "EggSpotB";
            spotB.transform.SetParent(root.transform, false);
            spotB.transform.localPosition = new Vector3(-0.05f, -0.2f, 0.12f);
            spotB.transform.localScale = Vector3.one * 0.07f;
            RuntimeMaterials.ApplyToRenderer(spotB.GetComponent<Renderer>(), new Color(0.45f, 0.75f, 1f));

            RemoveCollider(body);
            RemoveCollider(highlight);
            RemoveCollider(spotA);
            RemoveCollider(spotB);
            return root;
        }

        public static void ApplyColor(GameObject go, Color color, float emissionStrength)
        {
            var renderer = go.GetComponent<Renderer>();
            RuntimeMaterials.ApplyToRenderer(renderer, color, emissionStrength);
        }

        static void RemoveCollider(GameObject go)
        {
            var collider = go.GetComponent<Collider>();
            if (collider != null)
            {
                Object.Destroy(collider);
            }
        }
    }
}
