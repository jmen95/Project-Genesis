using UnityEngine;

namespace PetUniverse.Effects
{
    public static class ParticleFactory
    {
        public static void SpawnBurst(Vector3 position, Color color)
        {
            var go = new GameObject("HatchBurst");
            go.transform.position = position;
            var particles = go.AddComponent<ParticleSystem>();
            var main = particles.main;
            main.startLifetime = 0.8f;
            main.startSpeed = 2.5f;
            main.startSize = 0.15f;
            main.startColor = color;
            main.maxParticles = 40;
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            var emission = particles.emission;
            emission.rateOverTime = 0f;
            emission.SetBursts(new[] { new ParticleSystem.Burst(0f, 30) });
            var shape = particles.shape;
            shape.shapeType = ParticleSystemShapeType.Sphere;
            shape.radius = 0.2f;
            Object.Destroy(go, 2f);
            particles.Play();
        }

        public static void SpawnCoinSpark(Vector3 position)
        {
            SpawnBurst(position, new Color(1f, 0.9f, 0.3f));
        }
    }
}
