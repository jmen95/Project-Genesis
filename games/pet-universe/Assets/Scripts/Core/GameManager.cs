using System;
using PetUniverse.Core;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace PetUniverse.Core
{
    public sealed class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public bool IsPaused { get; private set; }

        public event Action<bool> OnPauseChanged;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            EnsureServices();
            Application.targetFrameRate = 60;
            Screen.orientation = ScreenOrientation.Portrait;
            Screen.autorotateToLandscapeLeft = false;
            Screen.autorotateToLandscapeRight = false;
        }

        void EnsureServices()
        {
            if (FindFirstObjectByType<Save.SaveManager>() == null)
            {
                new GameObject("SaveManager").AddComponent<Save.SaveManager>();
            }

            if (FindFirstObjectByType<CurrencyService>() == null)
            {
                new GameObject("CurrencyService").AddComponent<CurrencyService>();
            }

            if (FindFirstObjectByType<AudioManager>() == null)
            {
                new GameObject("AudioManager").AddComponent<AudioManager>();
            }
        }

        public void LoadMainMenu()
        {
            Time.timeScale = 1f;
            IsPaused = false;
            SceneManager.LoadScene(GameConstants.MainMenuScene);
        }

        public void LoadLaboratory()
        {
            Time.timeScale = 1f;
            IsPaused = false;
            SceneManager.LoadScene(GameConstants.LaboratoryScene);
        }

        public void SetPaused(bool paused)
        {
            IsPaused = paused;
            Time.timeScale = paused ? 0f : 1f;
            OnPauseChanged?.Invoke(paused);
        }

        public void QuitGame()
        {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
            Application.Quit();
#endif
        }
    }
}
