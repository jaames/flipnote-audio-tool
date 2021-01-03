Tool for debugging borked converted Flipnote audio. Still a WIP.

## Background

The Nintendo DSi Library was a feature of [Flipnote Studio 3D](https://en.wikipedia.org/wiki/Flipnote_Studio_3D)'s online services where users could view animations that were originally posted to Flipnote Hatena, the online service for the app's predecessor, [Flipnote Studio](https://en.wikipedia.org/wiki/Flipnote_Studio).

Nintendo had to bulk-convert the animations from Flipnote Studio's propritary PPM animation format to Flipnote Studio 3D's new KWZ format. Unfortunately, they managed to mess this up pretty badly, and the audio for a large chunk of these animations cannot be decoded correctly. Even on a 3DS, [they're pretty much unrecognizable](https://twitter.com/AustinSudomemo/status/1220367326085832704).

Luckily @Sudofox has managed to scrape [a full archive of DSi Library](https://twitter.com/AustinSudomemo/status/985706727994773504), which contains pretty much the entire history of the Flipnote Hatena service and its 44 million user-created animations. The last major hurdle for making this accessible to the public is figuring out how to recover the borked audio from Nintendo's conversion process.

KWZ audio is a bit odd - it's a slightly custom variation of ADPCM that switches between 2 bit and 4 bit samples - so it seems likely that Nintendo just made a small typo or error when writing the converter. If this is the case, it's totally likely that audio can be recovered. But due to the nature of ADPCM, we'd need to land on more or less the exact settings they used in order to decode it properly.

And that's where this tool comes in! It can tweak ADPCM decoder settings on-the-fly, making it far quicker to test things.

