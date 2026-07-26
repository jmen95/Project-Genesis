using UnityEngine;

namespace PetUniverse.Core
{
    public static class GameBootstrap
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        static void Initialize()
        {
            if (Object.FindFirstObjectByType<GameManager>() != null)
            {
                return;
            }

            var root = new GameObject("GameBootstrap");
            Object.DontDestroyOnLoad(root);
            root.AddComponent<GameManager>();
        }
    }
}
