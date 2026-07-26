using UnityEngine;

namespace PetUniverse.Effects
{
    public static class RuntimeMaterials
    {
        static Shader _unlitShader;

        public static Material CreateSolid(Color color, float emissionStrength = 0f)
        {
            var shader = ResolveUnlitShader();
            if (shader == null)
            {
                Debug.LogError("[PetUniverse] No compatible unlit shader found. 3D objects may appear pink.");
                return null;
            }

            var material = new Material(shader);
            SetColor(material, color);

            if (emissionStrength > 0f)
            {
                ApplyEmission(material, color, emissionStrength);
            }

            return material;
        }

        public static void ApplyToRenderer(Renderer renderer, Color color, float emissionStrength = 0f)
        {
            if (renderer == null)
            {
                return;
            }

            var material = CreateSolid(color, emissionStrength);
            if (material != null)
            {
                renderer.sharedMaterial = material;
            }
        }

        public static void SetColor(Material material, Color color)
        {
            if (material == null)
            {
                return;
            }

            if (material.HasProperty("_BaseColor"))
            {
                material.SetColor("_BaseColor", color);
            }

            if (material.HasProperty("_Color"))
            {
                material.SetColor("_Color", color);
            }
        }

        static Shader ResolveUnlitShader()
        {
            if (_unlitShader != null)
            {
                return _unlitShader;
            }

            var candidates = new[]
            {
                "Universal Render Pipeline/Unlit",
                "Unlit/Color",
                "Unlit/Texture",
                "Sprites/Default",
                "Legacy Shaders/Diffuse",
            };

            foreach (var shaderName in candidates)
            {
                var shader = Shader.Find(shaderName);
                if (shader != null)
                {
                    _unlitShader = shader;
                    return _unlitShader;
                }
            }

            return null;
        }

        static void ApplyEmission(Material material, Color color, float emissionStrength)
        {
            var emissive = color * emissionStrength;
            if (material.HasProperty("_EmissionColor"))
            {
                material.EnableKeyword("_EMISSION");
                material.SetColor("_EmissionColor", emissive);
                return;
            }

            SetColor(material, Color.Lerp(color, Color.white, Mathf.Clamp01(emissionStrength)));
        }
    }
}
