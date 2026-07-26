using TMPro;
using UnityEngine;

namespace PetUniverse.Effects
{
    public static class LabEnvironmentBuilder
    {
        public struct LabAnchors
        {
            public Transform EggAnchor;
            public Transform PetAnchor;
        }

        public static LabAnchors Build()
        {
            var root = new GameObject("LabEnvironment");
            BuildRoom(root.transform);
            BuildIncubatorStation(root.transform, out var eggAnchor);
            BuildPetStage(root.transform, out var petAnchor);
            BuildLighting();
            CreateLabel(eggAnchor, "HUEVO", new Color(0.45f, 0.9f, 1f), new Vector3(0f, 1.05f, 0f));
            CreateLabel(petAnchor, "MASCOTA", new Color(1f, 0.92f, 0.45f), new Vector3(0f, 1.15f, 0f));
            return new LabAnchors { EggAnchor = eggAnchor, PetAnchor = petAnchor };
        }

        static void BuildRoom(Transform parent)
        {
            var floor = GameObject.CreatePrimitive(PrimitiveType.Cube);
            floor.name = "LabFloor";
            floor.transform.SetParent(parent, false);
            floor.transform.position = new Vector3(0f, -0.6f, 0.2f);
            floor.transform.localScale = new Vector3(8f, 0.2f, 6f);
            RuntimeMaterials.ApplyToRenderer(floor.GetComponent<Renderer>(), new Color(0.14f, 0.18f, 0.32f));
            RemoveCollider(floor);

            var backWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backWall.name = "BackWall";
            backWall.transform.SetParent(parent, false);
            backWall.transform.position = new Vector3(0f, 1.4f, 2.4f);
            backWall.transform.localScale = new Vector3(8f, 3.2f, 0.2f);
            RuntimeMaterials.ApplyToRenderer(backWall.GetComponent<Renderer>(), new Color(0.1f, 0.14f, 0.28f));
            RemoveCollider(backWall);

            var leftWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leftWall.name = "LeftWall";
            leftWall.transform.SetParent(parent, false);
            leftWall.transform.position = new Vector3(-3.8f, 1.2f, 0.2f);
            leftWall.transform.localScale = new Vector3(0.2f, 2.8f, 6f);
            RuntimeMaterials.ApplyToRenderer(leftWall.GetComponent<Renderer>(), new Color(0.12f, 0.16f, 0.3f));
            RemoveCollider(leftWall);

            var rightWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rightWall.name = "RightWall";
            rightWall.transform.SetParent(parent, false);
            rightWall.transform.position = new Vector3(3.8f, 1.2f, 0.2f);
            rightWall.transform.localScale = new Vector3(0.2f, 2.8f, 6f);
            RuntimeMaterials.ApplyToRenderer(rightWall.GetComponent<Renderer>(), new Color(0.12f, 0.16f, 0.3f));
            RemoveCollider(rightWall);

            var window = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            window.name = "PlanetWindow";
            window.transform.SetParent(parent, false);
            window.transform.position = new Vector3(0f, 1.8f, 2.25f);
            window.transform.localScale = new Vector3(1.6f, 0.08f, 1.6f);
            RuntimeMaterials.ApplyToRenderer(window.GetComponent<Renderer>(), new Color(0.2f, 0.55f, 0.95f), 0.35f);
            RemoveCollider(window);

            var windowCore = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            windowCore.name = "Planet";
            windowCore.transform.SetParent(parent, false);
            windowCore.transform.position = new Vector3(0f, 1.8f, 2.1f);
            windowCore.transform.localScale = Vector3.one * 0.55f;
            RuntimeMaterials.ApplyToRenderer(windowCore.GetComponent<Renderer>(), new Color(0.35f, 0.7f, 1f), 0.2f);
            RemoveCollider(windowCore);

            for (var i = -2; i <= 2; i++)
            {
                var strip = GameObject.CreatePrimitive(PrimitiveType.Cube);
                strip.name = $"NeonStrip_{i}";
                strip.transform.SetParent(parent, false);
                strip.transform.position = new Vector3(i * 1.2f, 0.4f, 2.28f);
                strip.transform.localScale = new Vector3(0.08f, 1.6f, 0.05f);
                RuntimeMaterials.ApplyToRenderer(strip.GetComponent<Renderer>(), new Color(0.55f, 0.35f, 0.95f), 0.5f);
                RemoveCollider(strip);
            }
        }

        static void BuildIncubatorStation(Transform parent, out Transform eggAnchor)
        {
            var station = new GameObject("IncubatorStation");
            station.transform.SetParent(parent, false);
            station.transform.position = new Vector3(-1.35f, 0f, 0.35f);

            var basePad = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            basePad.name = "IncubatorBase";
            basePad.transform.SetParent(station.transform, false);
            basePad.transform.localPosition = new Vector3(0f, 0.08f, 0f);
            basePad.transform.localScale = new Vector3(1.2f, 0.1f, 1.2f);
            RuntimeMaterials.ApplyToRenderer(basePad.GetComponent<Renderer>(), new Color(0.28f, 0.2f, 0.45f));
            RemoveCollider(basePad);

            for (var i = 0; i < 4; i++)
            {
                var post = GameObject.CreatePrimitive(PrimitiveType.Cube);
                post.name = $"IncubatorPost_{i}";
                post.transform.SetParent(station.transform, false);
                var angle = i * 90f * Mathf.Deg2Rad;
                post.transform.localPosition = new Vector3(Mathf.Cos(angle) * 0.42f, 0.35f, Mathf.Sin(angle) * 0.42f);
                post.transform.localScale = new Vector3(0.08f, 0.7f, 0.08f);
                RuntimeMaterials.ApplyToRenderer(post.GetComponent<Renderer>(), new Color(0.5f, 0.85f, 1f), 0.25f);
                RemoveCollider(post);
            }

            var ring = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            ring.name = "IncubatorRing";
            ring.transform.SetParent(station.transform, false);
            ring.transform.localPosition = new Vector3(0f, 0.72f, 0f);
            ring.transform.localScale = new Vector3(1.05f, 0.03f, 1.05f);
            RuntimeMaterials.ApplyToRenderer(ring.GetComponent<Renderer>(), new Color(0.45f, 0.9f, 1f), 0.45f);
            RemoveCollider(ring);

            var nest = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            nest.name = "IncubatorNest";
            nest.transform.SetParent(station.transform, false);
            nest.transform.localPosition = new Vector3(0f, 0.2f, 0f);
            nest.transform.localScale = new Vector3(0.75f, 0.12f, 0.75f);
            RuntimeMaterials.ApplyToRenderer(nest.GetComponent<Renderer>(), new Color(0.35f, 0.55f, 0.95f), 0.15f);
            RemoveCollider(nest);

            eggAnchor = new GameObject("EggAnchor").transform;
            eggAnchor.SetParent(station.transform, false);
            eggAnchor.localPosition = new Vector3(0f, 0.42f, 0f);
        }

        static void BuildPetStage(Transform parent, out Transform petAnchor)
        {
            var stage = new GameObject("PetStage");
            stage.transform.SetParent(parent, false);
            stage.transform.position = new Vector3(1.35f, 0f, 0.35f);

            var platform = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            platform.name = "PetPlatform";
            platform.transform.SetParent(stage.transform, false);
            platform.transform.localPosition = new Vector3(0f, 0.1f, 0f);
            platform.transform.localScale = new Vector3(1.5f, 0.12f, 1.5f);
            RuntimeMaterials.ApplyToRenderer(platform.GetComponent<Renderer>(), new Color(0.95f, 0.97f, 1f), 0.1f);
            RemoveCollider(platform);

            var ring = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            ring.name = "PetRing";
            ring.transform.SetParent(stage.transform, false);
            ring.transform.localPosition = new Vector3(0f, 0.2f, 0f);
            ring.transform.localScale = new Vector3(1.65f, 0.02f, 1.65f);
            RuntimeMaterials.ApplyToRenderer(ring.GetComponent<Renderer>(), new Color(1f, 0.85f, 0.35f), 0.35f);
            RemoveCollider(ring);

            petAnchor = new GameObject("PetAnchor").transform;
            petAnchor.SetParent(stage.transform, false);
            petAnchor.localPosition = new Vector3(0f, 0.42f, 0f);
        }

        static void BuildLighting()
        {
            var sun = new GameObject("LabSun");
            var sunLight = sun.AddComponent<Light>();
            sunLight.type = LightType.Directional;
            sunLight.color = new Color(0.85f, 0.9f, 1f);
            sunLight.intensity = 1.1f;
            sun.transform.rotation = Quaternion.Euler(50f, -25f, 0f);

            var eggLightGo = new GameObject("EggSpotlight");
            var eggLight = eggLightGo.AddComponent<Light>();
            eggLight.type = LightType.Point;
            eggLight.color = new Color(0.5f, 0.9f, 1f);
            eggLight.intensity = 2.5f;
            eggLight.range = 4f;
            eggLightGo.transform.position = new Vector3(-1.35f, 1.4f, 0.1f);

            var petLightGo = new GameObject("PetSpotlight");
            var petLight = petLightGo.AddComponent<Light>();
            petLight.type = LightType.Point;
            petLight.color = new Color(1f, 0.9f, 0.55f);
            petLight.intensity = 2.5f;
            petLight.range = 4f;
            petLightGo.transform.position = new Vector3(1.35f, 1.4f, 0.1f);
        }

        static void CreateLabel(Transform anchor, string text, Color color, Vector3 localOffset)
        {
            var labelGo = new GameObject($"{text}Label");
            labelGo.transform.SetParent(anchor, false);
            labelGo.transform.localPosition = localOffset;
            labelGo.transform.localRotation = Quaternion.identity;

            var tmp = labelGo.AddComponent<TextMeshPro>();
            tmp.text = text;
            tmp.fontSize = 3.2f;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.color = color;
            tmp.fontStyle = FontStyles.Bold;
            tmp.rectTransform.sizeDelta = new Vector2(3f, 1f);

            var font = Resources.Load<TMP_FontAsset>("Fonts & Materials/LiberationSans SDF");
            if (font != null)
            {
                tmp.font = font;
            }
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
