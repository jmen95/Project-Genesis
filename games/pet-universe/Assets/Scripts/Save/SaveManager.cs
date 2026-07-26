using System;
using System.IO;
using PetUniverse.Core;
using UnityEngine;

namespace PetUniverse.Save
{
    public sealed class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance { get; private set; }

        public PlayerSaveData Data { get; private set; } = new();

        public event Action<PlayerSaveData> OnSaved;

        string SavePath => Path.Combine(Application.persistentDataPath, GameConstants.SaveFileName);

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            Load();
        }

        public void Load()
        {
            if (!File.Exists(SavePath))
            {
                Data = CreateNewSave();
                Save();
                return;
            }

            try
            {
                var json = File.ReadAllText(SavePath);
                var loaded = JsonUtility.FromJson<PlayerSaveData>(json);
                Data = loaded ?? CreateNewSave();
            }
            catch (Exception exception)
            {
                Debug.LogWarning($"Save load failed, creating new save: {exception.Message}");
                Data = CreateNewSave();
            }
        }

        public void Save()
        {
            Data.LastSaveUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var json = JsonUtility.ToJson(Data, true);
            File.WriteAllText(SavePath, json);
            OnSaved?.Invoke(Data);
        }

        static PlayerSaveData CreateNewSave()
        {
            return new PlayerSaveData
            {
                Coins = 50,
                LabLevel = 1,
                UnlockedEggIds = new System.Collections.Generic.List<string> { "starter-egg" },
            };
        }
    }
}
