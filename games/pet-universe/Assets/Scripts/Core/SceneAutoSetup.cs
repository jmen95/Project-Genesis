using PetUniverse.Scenes;
using PetUniverse.UI;
using UnityEngine;
using UnityEngine.EventSystems;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem.UI;
#endif
using UnityEngine.SceneManagement;

namespace PetUniverse.Core
{
    public static class SceneAutoSetup
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void SetupActiveScene()
        {
            var sceneName = SceneManager.GetActiveScene().name;
            if (sceneName == GameConstants.MainMenuScene)
            {
                EnsureMainMenu();
            }
            else if (sceneName == GameConstants.LaboratoryScene)
            {
                EnsureLaboratory();
            }
        }

        static void EnsureMainMenu()
        {
            if (Object.FindFirstObjectByType<MainMenuController>() != null)
            {
                return;
            }

            EnsureCamera();
            EnsureEventSystem();
            new GameObject("MainMenuController").AddComponent<MainMenuController>();
        }

        static void EnsureLaboratory()
        {
            if (Object.FindFirstObjectByType<LaboratorySceneController>() != null)
            {
                return;
            }

            EnsureCamera();
            EnsureEventSystem();
            new GameObject("LaboratorySceneController").AddComponent<LaboratorySceneController>();
        }

        static void EnsureCamera()
        {
            if (Camera.main != null)
            {
                return;
            }

            var cameraGo = new GameObject("Main Camera");
            cameraGo.tag = "MainCamera";
            var camera = cameraGo.AddComponent<Camera>();
            cameraGo.AddComponent<AudioListener>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.4f, 0.6f, 0.95f);
        }

        static void EnsureEventSystem()
        {
            if (Object.FindFirstObjectByType<EventSystem>() != null)
            {
                return;
            }

            var eventSystem = new GameObject("EventSystem");
            eventSystem.AddComponent<EventSystem>();
#if ENABLE_INPUT_SYSTEM
            eventSystem.AddComponent<InputSystemUIInputModule>();
#else
            eventSystem.AddComponent<StandaloneInputModule>();
#endif
        }
    }
}
