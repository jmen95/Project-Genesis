using System;
using System.Collections.Generic;
using UnityEngine;

namespace PetUniverse.Core
{
    public sealed class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        readonly Dictionary<SoundId, AudioClip> _clips = new();
        AudioSource _sfxSource;
        AudioSource _musicSource;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            BuildProceduralClips();
            _sfxSource = gameObject.AddComponent<AudioSource>();
            _musicSource = gameObject.AddComponent<AudioSource>();
            _musicSource.loop = true;
            _musicSource.volume = 0.15f;
            PlayMusic();
        }

        public void Play(SoundId soundId)
        {
            if (!Save.SaveManager.Instance.Data.Settings.SfxEnabled)
            {
                return;
            }

            if (!_clips.TryGetValue(soundId, out var clip))
            {
                return;
            }

            _sfxSource.PlayOneShot(clip, Save.SaveManager.Instance.Data.Settings.SfxVolume);
        }

        public void ApplySettings()
        {
            var settings = Save.SaveManager.Instance.Data.Settings;
            _sfxSource.volume = settings.SfxVolume;
            _musicSource.volume = settings.MusicEnabled ? settings.MusicVolume * 0.25f : 0f;
        }

        void PlayMusic()
        {
            if (_clips.TryGetValue(SoundId.Ambient, out var clip))
            {
                _musicSource.clip = clip;
                _musicSource.Play();
            }
        }

        void BuildProceduralClips()
        {
            _clips[SoundId.Button] = CreateTone(880f, 0.08f, 0.35f);
            _clips[SoundId.Pet] = CreateTone(520f, 0.12f, 0.4f);
            _clips[SoundId.Coin] = CreateTone(1200f, 0.1f, 0.45f);
            _clips[SoundId.LevelUp] = CreateChord(new[] { 523f, 659f, 784f }, 0.35f, 0.5f);
            _clips[SoundId.Hatch] = CreateChord(new[] { 392f, 494f, 587f, 740f }, 0.5f, 0.55f);
            _clips[SoundId.Feed] = CreateTone(330f, 0.1f, 0.35f);
            _clips[SoundId.Play] = CreateTone(660f, 0.14f, 0.4f);
            _clips[SoundId.Ambient] = CreateTone(220f, 2f, 0.08f);
        }

        static AudioClip CreateTone(float frequency, float duration, float volume)
        {
            var sampleRate = 44100;
            var sampleCount = Mathf.CeilToInt(sampleRate * duration);
            var samples = new float[sampleCount];
            for (var i = 0; i < sampleCount; i++)
            {
                var t = i / (float)sampleRate;
                var envelope = Mathf.Clamp01(1f - t / duration);
                samples[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * volume * envelope;
            }

            var clip = AudioClip.Create($"tone_{frequency}", sampleCount, 1, sampleRate, false);
            clip.SetData(samples, 0);
            return clip;
        }

        static AudioClip CreateChord(float[] frequencies, float duration, float volume)
        {
            var sampleRate = 44100;
            var sampleCount = Mathf.CeilToInt(sampleRate * duration);
            var samples = new float[sampleCount];
            for (var i = 0; i < sampleCount; i++)
            {
                var t = i / (float)sampleRate;
                var envelope = Mathf.Clamp01(1f - t / duration);
                var value = 0f;
                foreach (var frequency in frequencies)
                {
                    value += Mathf.Sin(2f * Mathf.PI * frequency * t);
                }

                samples[i] = value / frequencies.Length * volume * envelope;
            }

            var clip = AudioClip.Create("chord", sampleCount, 1, sampleRate, false);
            clip.SetData(samples, 0);
            return clip;
        }
    }

    public enum SoundId
    {
        Button,
        Pet,
        Coin,
        LevelUp,
        Hatch,
        Feed,
        Play,
        Ambient,
    }
}
