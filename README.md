# 🌈 FreeAAC

Augmentative and Alternative Communication (AAC) tools support people who have difficulty speaking to communicate effectively. This initiative aims to provide free and open-source AAC software that offers state-of-the-art technology and a high quality user experience.

> 💡 This project is currently in the **planning stage**. We are looking for feedback to guide the project at this initial stage. See below for how you can contribute...

## The problem

Everyone has the right to freedom of opinion and expression, yet for some people, their ability to communicate effectively sits behind a paywall.

There are some excellent free tools available (see below), but many are limited in their ability to offer advanced functionality or rely on servers that must be funded and maintained.

## The proposal

Our ambition is to develop an AAC tool that:

- **is free and open-source**<br>
  Can be run, modified, and distributed freely by anyone.

- **is decentralised**<br>
  Doesn't rely on maintained servers or require user registration.

- **uses open standards**<br>
  Supports switching boards between apps and standardised logging.

- **works offline**<br>
  Can run reliably in any environment. 

- **features neural text-to-speech**<br>
  Gives people a rich and natural-sounding voice.

- **employs predictive text**<br>
  Enables near-real-time communication with minimal effort.

## Existing open software

We want to build on the shoulders of those who came before by combining the best bits from existing open-source projects.

| Name | Platforms | Framework | Licence | Links |
| --- | --- | --- | --- | --- |
| CBoard | [Web](https://app.cboard.io), [iOS](https://apps.apple.com/gb/app/aac-cboard-app/id6453683048), [Android](https://play.google.com/store/apps/details?id=com.unicef.cboard), [Windows](https://apps.microsoft.com/store/detail/XP9M5KQV699FLR) | React | GPLv3 | [Website](https://www.cboard.io)<br>[Code](https://github.com/cboard-org/cboard) |
| FreeSpeech | [Web](https://www.freespeechaac.com/) | Svelte | MIT | [Website](https://www.freespeechaac.com/)<br>[Code](https://github.com/Merkie/freespeech)
| PicTalk | [Android](https://play.google.com/store/apps/details?id=org.pictalk.www.twa), [iOS](https://apps.apple.com/ca/app/pictalk-aac/id1617860868?l=en)  | Vue, Node | GPLv3 | [Website](https://www.pictalk.org/)<br>[Code](https://github.com/Pictalk-speech-made-easy/pictalk-frontend)  |
| AsTeRICS Grid | [Web](https://grid.asterics.eu)  | Vue | AGPLv3 | [Website](https://grid.asterics.eu)<br>[Code](https://github.com/asterics/AsTeRICS-Grid) |
| OTTAA | (_unpublished_) | Flutter | GPLv3 | [Website](https://ottaaproject.com/)<br>[Code](https://github.com/OTTAA-Project/ottaa_project_flutter)
| AAC Communication Assistant | (_unpublished_) | React Native | ⚠️ None | [Code](https://github.com/FastTrack-Academy/Augmentative-Alternative-Communication)
| AAC Speech Android | (_unpublished_) | Android (Java) | ⚠️  None | [Code](https://github.com/vidma/aac-speech-android) |

## Resources

| Name | Description | Licence |
| --- | --- | --- |
| [OpenAAC Developer Considerations](https://www.openaac.org/considerations) | Prioritised feature lists | ⚠️ None |
| [Open Board Format](https://docs.google.com/document/d/1Bnl5neOf9-y53yOAGjd8BzQ7jvAdLhcB6y9Zw7ITYbA/edit) | Open file format for boards | CC-BY |
| [Word Forms and Inflection Rules](https://docs.google.com/document/d/1JJI82jk9hPy-PHMgx5rXNhEhy8Z38-MtSF0Uirt8gFY/edit) | Standardised format for tracking word-level information | CC-BY |
| [ARASAAC](https://arasaac.org/) | Symbol set | CC-BY-NC-SA |
| [OpenSymbols](https://www.opensymbols.org/) | Symbol set | Mixed CC |
| [Global Symbols](https://globalsymbols.com/) | Symbol set | Mixed CC |
| [ConvAssist](https://github.com/IntelLabs/ConvAssist) | Predictive text tool | GPLv3<br>([was Apache-2.0](https://github.com/IntelLabs/ConvAssist/commit/10d8473efda23d0b1cc1269c3e17456030e7cc02)) |
| [AAC-GPT2](https://huggingface.co/IntelLabs/aac_gpt2) | Language model (used in ConvAssist) | MIT |
| [KWickChat](https://github.com/CambridgeIIS/KWickChat) | Language model | ⚠️ None |
| [PrAACT](https://github.com/jayralencar/praact) | Language model (WIP) | MIT |
| [AAC-LLM](https://github.com/Textualization/aac-llm) | Language model research | ⚠️ None |
| [Dynamic AAC](https://github.com/AI-AAC/Dynamic-Augmentative-and-Alternative-Communication) | Board generation research | GPLv3 |
| [Piper](https://github.com/OHF-Voice/piper1-gpl) | Neural TTS | GPLv3 |
| [Kokoro](https://github.com/hexgrad/kokoro) | Neural TTS | Apache-2.0 |

## How to contribute

### You can:
- ⭐️ Star this repository to improve its visibility.

- 💬 [Join the conversation](https://github.com/sonicbaume/FreeAAC/discussions) by up-voting, commenting, or starting a discussion.

### AAC users can:

- ✋ Sign up to be a tester, try releases, report problems and offer feedback.

- 📝 [Request a feature](https://github.com/sonicbaume/FreeAAC/issues/new) by writing a user story.

### Developers can:

- 🗺 Build features [listed in the roadmap](https://github.com/sonicbaume/FreeAAC/projects?query=is%3Aopen).

- 🔧 [Fix a problem identified in Issues](https://github.com/sonicbaume/FreeAAC/issues) and submitting a Pull Request.

- 🔍 Find and suggest libraries or models that could be used to improve or extend the app.

## Authors

- [Chris Baume](https://sonic.bau.me/about) is a software engineer, researcher, and SEN parent with expertise in audio and AI.