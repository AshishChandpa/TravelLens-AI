import os
import azure.cognitiveservices.speech as speechsdk
from webapp.service import Config

def setup_speech_service():
    speech_key = Config.AZURE_SPEECH_KEY
    speech_region = Config.AZURE_SPEECH_REGION
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    return speech_config

# Convert text to speech
def text_to_speech(text):
    speech_config = setup_speech_service()
    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
    synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
    result = synthesizer.speak_text_async(text).get()
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        return "Speech synthesized successfully."
    elif result.reason == speechsdk.ResultReason.Canceled:
        return "Speech synthesis canceled."

# Convert speech to text
def speech_to_text(audio_file):
    speech_config = setup_speech_service()
    audio_config = speechsdk.audio.AudioConfig(filename=audio_file)
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    result = recognizer.recognize_once_async().get()
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    elif result.reason == speechsdk.ResultReason.NoMatch:
        return "No speech could be recognized."
    elif result.reason == speechsdk.ResultReason.Canceled:
        return "Speech recognition canceled."
