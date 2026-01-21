# 🌈 FreeAAC

A free and open-source Augmentative and Alternative Communication (AAC) app for Android, iOS and web, built using React Native.

### 🚀 Beta app: **[Web](https://free-aac.org)** | _Android_ | _iOS_

### 🗺 [Project roadmap](https://github.com/orgs/sonicbaume/projects/4/views/1)

> 💡 We are in the very early stages of development - please say hello and **[let us know what you think](https://github.com/sonicbaume/FreeAAC/discussions)** to help guide the project in the right direction.

## Introduction

AAC technology is dominated by proprietary software that can cost upwards of $300, limiting people’s ability to access the best tools and functionality. There are some excellent free and open-source AAC apps already available (see below) that are hugely valuable to the community. These are mostly built using Javascript frameworks that run in a browser, either natively or wrapped in a mobile app.

As these AAC apps are based on web technology, advanced functionality such as neural TTS and word/sentence prediction needs to be delivered through cloud services. This introduces a cost that must be met by the product owner (i.e. through a subscription) or the user (i.e. through an API key).

Recently, lightweight AI models have become available that can be run on the user’s device, eliminating the need for servers or API keys. This approach might enable apps to offer features that rival commercial offerings while being truly free and open.

Our ambition is to develop an AAC app that:

- **is free and open-source**<br>
  Can be run, modified, and distributed freely by anyone.

- **works offline**<br>
  Can run reliably in any environment. 
  
- **uses open standards**<br>
  Supports switching boards between apps and standardised logging.

- **is decentralised**<br>
  Doesn't rely on maintained servers or require user registration.

- **features neural text-to-speech**<br>
  Gives people a rich and natural-sounding voice.

- **employs predictive text**<br>
  Enables near-real-time communication with minimal effort.

To achieve this, we plan to use:

- **[React Native](https://reactnative.dev/)**, for serving Android, iOS and web from a single Javascript codebase. (_It is technically possible to run AI models in a browser (e.g. using [tfjs](https://github.com/tensorflow/tfjs)), but being able to run local models natively brings performance and reliability benefits._)
- **[Open Board Format](https://www.openboardformat.org/) (OBF)**, with [adapters](https://github.com/willwade/AACProcessors-nodejs) for interoperability with other AAC apps.
- **[Kokoro](https://github.com/hexgrad/kokoro)**, for rendering natural sounding speech on the user’s device.
- **[AAC-GPT2](https://huggingface.co/IntelLabs/aac_gpt2)**, for near-real-time conversations by predicting utterances or sentences.

## Existing open software

We want to build on the shoulders of those who came before by combining the best bits from existing open-source projects.

| Name | Platforms | Framework | Licence | Links |
| --- | --- | --- | --- | --- |
| CBoard | [Web](https://app.cboard.io), [iOS](https://apps.apple.com/gb/app/aac-cboard-app/id6453683048), [Android](https://play.google.com/store/apps/details?id=com.unicef.cboard), [Windows](https://apps.microsoft.com/store/detail/XP9M5KQV699FLR) | React | GPLv3 | [Website](https://www.cboard.io)<br>[Code](https://github.com/cboard-org/cboard) |
| FreeSpeech | [Web](https://www.freespeechaac.com/) | Svelte | MIT | [Website](https://www.freespeechaac.com/)<br>[Code](https://github.com/Merkie/freespeech)
| PicTalk | [Android](https://play.google.com/store/apps/details?id=org.pictalk.www.twa), [iOS](https://apps.apple.com/ca/app/pictalk-aac/id1617860868?l=en)  | Vue, Node | GPLv3 | [Website](https://www.pictalk.org/)<br>[Code](https://github.com/Pictalk-speech-made-easy/pictalk-frontend)  |
| AsTeRICS Grid | [Web](https://grid.asterics.eu)  | Vue | AGPLv3 | [Website](https://grid.asterics.eu)<br>[Code](https://github.com/asterics/AsTeRICS-Grid) |
| OneTalker | _Windows, macOS, Linux_  | Iced (Rust) | GPLv3 | [Code](https://codeberg.org/OneTalker/OneTalker) |
| OTTAA | (_unpublished_) | Flutter | GPLv3 | [Website](https://ottaaproject.com/)<br>[Code](https://github.com/OTTAA-Project/ottaa_project_flutter)
| AAC Communication Assistant | (_unpublished_) | React Native | ⚠️ None | [Code](https://github.com/FastTrack-Academy/Augmentative-Alternative-Communication)
| AAC Speech Android | (_unpublished_) | Android (Java) | ⚠️  None | [Code](https://github.com/vidma/aac-speech-android) |

## Resources

| Category | Name | Description | Licence |
| --- | --- | --- | --- |
| Standards | [OpenAAC Developer Considerations](https://www.openaac.org/considerations) | Prioritised feature lists | ⚠️ None |
| Standards |  [Open Board Format](https://docs.google.com/document/d/1Bnl5neOf9-y53yOAGjd8BzQ7jvAdLhcB6y9Zw7ITYbA/edit) | Open file format for boards | CC-BY |
| Standards |  [Word Forms and Inflection Rules](https://docs.google.com/document/d/1JJI82jk9hPy-PHMgx5rXNhEhy8Z38-MtSF0Uirt8gFY/edit) | Standardised format for tracking word-level information | CC-BY |
| Symbols | [ARASAAC](https://arasaac.org/) | Symbol set | CC-BY-NC-SA |
| Symbols | [OpenSymbols](https://www.opensymbols.org/) | Symbol set | Mixed CC |
| Symbols | [Global Symbols](https://globalsymbols.com/) | Symbol set | Mixed CC |
| TTS | [Piper](https://github.com/OHF-Voice/piper1-gpl) | Neural TTS | GPLv3 |
| TTS | [Kokoro](https://github.com/hexgrad/kokoro) | Neural TTS | Apache-2.0 |
| TTS | [RN ExecuTorch](https://github.com/software-mansion/react-native-executorch) | On-device inference with Kokoro support | MIT |
| Interoperability | [obf-node](https://github.com/willwade/obf-node) | OBF validator and converter for Node.js | MIT |
| Interoperability | [react-obf](https://github.com/cboard-org/react-obf) | OBF renderer for React | MIT |
| Interoperability | [obf-utils](https://www.npmjs.com/package/obf-utils) | OBF file utility for Typescript  | MIT |
| Interoperability | [AACProcessors-nodejs](https://github.com/willwade/AACProcessors-nodejs) | OBF file utility for Typescript | GPLv3 |
| Prediction | [ConvAssist](https://github.com/IntelLabs/ConvAssist) | Predictive text tool | GPLv3<br>([was Apache-2.0](https://github.com/IntelLabs/ConvAssist/commit/10d8473efda23d0b1cc1269c3e17456030e7cc02)) |
| Prediction | [AAC-GPT2](https://huggingface.co/IntelLabs/aac_gpt2) | Language model (used in ConvAssist) | MIT |
| Prediction | [KWickChat](https://github.com/CambridgeIIS/KWickChat) | Language model | ⚠️ None |
| Prediction | [AAC-LLM](https://github.com/Textualization/aac-llm) | Language model research | ⚠️ None |
| Prediction | [Dynamic AAC](https://github.com/AI-AAC/Dynamic-Augmentative-and-Alternative-Communication) | Board generation research | GPLv3 |
| Prediction | [pictoBERT](https://github.com/jayralencar/pictoBERT) | Pictogram Prediction using Transformers | MIT |
| Prediction | [Pictalk_PrAACT](https://github.com/LucasMagnana/Pictalk_PrAACT) | Implementation of the PrAACT method | ⚠️ None |

## How to contribute

### You can:
- ⭐️ Star this repository to improve its visibility.

- 💬 [Offer feedback and suggestions](https://github.com/sonicbaume/FreeAAC/discussions) by up-voting, commenting on a discussion topic, or starting a discussion.

### AAC users can:

- ✋ _Sign up to be a tester, try releases, report problems and offer feedback._ [coming soon...]

- 📝 [Request a feature](https://github.com/sonicbaume/FreeAAC/issues/new?type=feature) by writing a user story.

- 🐛 [Report a bug](https://github.com/sonicbaume/FreeAAC/issues/new?type=bug) so we're aware of any problems you're having.

- 💬 [Contribute to our roadmap](https://github.com/orgs/sonicbaume/projects/4/views/1) by commenting on tasks.

### Developers can:

- 🗺 Build a feature [from our roadmap](https://github.com/orgs/sonicbaume/projects/4/views/1) that is ready to be picked up.

- 🔧 [Fix a bug that has been found](https://github.com/sonicbaume/FreeAAC/issues?q=is%3Aissue%20state%3Aopen%20type%3ABug) and submitting a Pull Request.

- 🔍 Find and suggest libraries or models that could be used to improve or extend the app.

## Development

To run locally with live reloading:
```
npm install
npx expo start --web
npx expo run android
npx expo run ios
```

## Authors

- [Chris Baume](https://sonic.bau.me/about) is a software engineer, researcher, and SEN parent with expertise in audio and AI.