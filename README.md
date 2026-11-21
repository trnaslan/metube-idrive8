# BeeMTube2

**YouTube on the BMW iDrive 8 screen.** BeeMTube2 is an unofficial YouTube client for iDrive 8 head units (MGU,
`ID8`), installed from the [MGU Store](https://github.com/robertnisipeanu/mgu-store). Sound through the car's own
media player, picture on the curved display, your own Home, Subscriptions and Watch later.

By Waliworld (#tunedbywali). Based on [RideTube by JustAnotherPU](https://github.com/JustAnotherPU/ridetube); see
[Credits and licence](#credits-and-licence).

> **Unofficial and experimental.** Not affiliated with, endorsed by or sponsored by Google, YouTube or BMW. Use it
> at your own risk. You are responsible for following YouTube's Terms of Service and the laws of your country, and
> for using it safely: by default the picture shows only while the car is parked.

| | |
|---|---|
| ![Home](docs/media/b2-home.png) | ![The player](docs/media/b2-player.png) |
| Home: your shelves, dragged sideways with a finger | The player: Previous, 10 s back, pause, 10 s on, Next; quality and picture size |
| ![Fill](docs/media/b2-player-fill.png) | ![Double tap](docs/media/b2-player-double-tap.png) |
| Picture size **Fill**: as wide as the screen | Two quick taps on a side: 10 s back or on |
| ![Search](docs/media/b2-search.png) | ![Keyboard](docs/media/b2-keyboard.png) |
| Search results, five a row | Its own keyboard, recent searches as buttons |
| ![Driving](docs/media/b2-driving.png) | ![Settings](docs/media/b2-settings.png) |
| While driving: the sound plays on, no picture | Settings |
| ![Start screen](docs/media/b2-start.png) | ![Zoom](docs/media/b2-player-zoom.png) |
| The start screen | Picture size **Zoom 1** |

The screenshots are rendered on a computer at the car's 2880 x 960 with invented demo data
(`docs/readme_shots.js`); the pictures in them are drawn stand-ins, not anyone's videos.

## Confirmed on a car

| | |
|---|---|
| Car | BMW M2 (G87), iDrive 8 (Intel MGU21 head unit) |
| Works there | install from the Store, the tile, the screen and touch, search and thumbnails, **sound and picture**, pause, the picture sizes (**zoom and Fill**) |
| Not reported yet | Beta 4's additions: pages that glide, double tap to seek, Previous / Next, "When a video ends", picture brightness |

One car so far. Reports from other iDrive 8 cars are welcome in the issues, with photos of **Settings >
Diagnostics** when something does not play.

## Features

**Your YouTube**

- **Home**, **Subscriptions** and **Watch later** once you sign in on the car with the TV device sign-in: a code to
  enter on your phone. BeeMTube2 never sees your password.
- **Search** with its own on-screen keyboard; your recent searches are buttons (they work while driving, typing
  does not).
- **Channel pages**, **Continue watching** with the place you stopped, video chapters on the progress bar.
- Signed in, what you watch goes to your YouTube history, as on a TV. Members-only videos can be shown or hidden.

**The player**

- **Picture size**: Fit (the whole picture), Zoom 1, Zoom 2, or **Fill** - as wide as the screen. One button in the
  player steps through them at once; the sound plays on.
- **Double tap to seek**: two quick taps on the right third of the picture go 10 s on, on the left third 10 s
  back; each further tap 10 s more.
- **Previous** and **Next**, 10 s back and on, play / pause, and a progress bar with the video's chapters.
- **Video quality**: Auto (720p on Wi-Fi, 480p on phone data), 720p, 480p or 360p, changed from the player.
- **When a video ends**: play the next of its row, play it again, or stop.
- **Picture brightness**: 100, 85, 70 or 55 % for a bright video at night.
- **SponsorBlock**: sponsors, self-promotion, intros and similar are skipped, offered with a Skip button, or left
  alone - per category ([sponsor.ajay.app](https://sponsor.ajay.app)).
- **On phone**: a QR code of the video to carry on with it on your phone.
- **Sound through the car's own media player**, so the car's volume, mute and audio focus behave as for any source.

**In the car**

- **While driving**, the picture gives way to a podcast view (title, progress, controls) and the sound plays on. The
  picture comes back when the car is parked. (Video while driving is a setting, off by default: only for a car
  coded for video in motion, and only passengers.)
- **Made for the screen**: the whole app area of the curved display, five tiles a row, touch throughout.
- **Smooth**: pages follow a finger and run on when let go; shelves are dragged sideways and settle on a tile.
- **Easy on the battery**: parked, playback pauses when the 12 V battery falls under 60, 65 or 70 %.
- **Nothing is kept**: the video playing is downloaded to the head unit while it plays, then deleted. Expect the
  video's whole size on your data plan, even if you stop early.
- **Diagnostics** in Settings: what the car answered, page by page - a photo of it is a bug report.

## Install

1. Root SSH on the head unit and the [MGU Store](https://github.com/robertnisipeanu/mgu-store) installed (its
   README). Back up the head unit's coding before rooting it.
2. The car online through the Store's uplink (`mgu-uplink`: phone hotspot, USB LTE stick or Wi-Fi).
3. In the Store: Settings, **Add source**, type `waliworld/iDrive8-RideTube` and pick **Releases**.
4. Install **BeeMTube2**. The Store installs with it, from this source, its service (`jap-ridetube-d`, listed as
   "RideTube service") and Node.js 22 (`jap-node22`); from its own source the renderer `mgu-render`, `mgu-python`
   and the deploy tool.
5. **Restart the head unit**: on iDrive 8 an app installs at the next start.
6. Open BeeMTube2 from All apps. Home shows a code: enter it at google.com/device on your phone to sign in (or
   search without signing in).

**If you see it playing and hear nothing**, press **No sound?** on the player, twice: the service leaves that way
out and tries the next. **If nothing plays**, photograph every page of **Settings > Diagnostics**. Settings'
**Sound: start over** makes the service find the car's sound again from the start.

For iDrive 7, use the original [RideTube](https://github.com/JustAnotherPU/ridetube).

## Versions, and going back

| Version | What it is | In the MGU Store: Add source | Branch |
|---|---|---|---|
| **Beta 4** (the main release) | app 0.7.0: gliding pages and shelves, double tap to seek, Previous / Next, when a video ends, picture brightness, the logo on the start screen | `waliworld/iDrive8-RideTube`, **Releases** | `main`, `beta4` |
| Beta 3 | app 0.6.0: the name BeeMTube2, picture size (zoom), the start screen | the address `https://github.com/waliworld/iDrive8-RideTube/releases/download/beta3/catalog.json` | `beta3` |
| Beta 2 | app 0.5.0 (still named RideTube): picture size, the start screen | the address `https://github.com/waliworld/iDrive8-RideTube/releases/download/beta2/catalog.json` | `beta2` |
| Beta 1 (stable) | app 0.4.6: the first version with sound and picture on a car | the address `https://github.com/waliworld/iDrive8-RideTube/releases/download/stable-1/catalog.json` | `beta1-stable` |

All of them run the **same service package** (0.5.2, the one confirmed on a car); only the app differs. **To go
back** on a car: add the older version's address as a source (easiest from the Store's phone page), uninstall the
app (the service can stay), install it again from that source, restart the head unit. The releases `stable-1`,
`beta2` and `beta3` and their branches are kept as they are for that. [CHANGELOG.md](CHANGELOG.md) has every
version.

## Settings

- **Picture size**: Fit, Zoom 1, Zoom 2, Fill (also the Zoom button of the player).
- **Picture brightness**: 100, 85, 70 or 55 %.
- **Video quality**: Auto, 720p, 480p or 360p.
- **When a video ends**: play the next of its row, play it again, or stop.
- **Video while driving**: off by default. Leave it off unless the car is coded for video in motion and only
  passengers can see the screen. It takes effect only once switched on while the car is parked.
- **Show members-only videos**: off by default. A channel can also be hidden from its page.
- **SponsorBlock**, per category: skip, show a Skip button, or off.
- **Parked: pause when the 12 V battery is under** 60, 65 (default) or 70 %, or never.
- **Sign in** / **Sign out** (pressed twice), **Diagnostics** and **Sound: start over** on the Settings card.

The parked check reads the car's speed. A reading older than 5 seconds counts as driving.

## Good to know

- yt-dlp breaks now and then when YouTube changes; a fixed release then needs a new yt-dlp
  (`native/jap-ridetube-d/README.md`, "Updating yt-dlp").
- H.264 only (up to 720p, 30 fps preferred), decoded on the head unit's GPU. A video with no H.264 stream does not
  play.
- **Fill** cuts the top and bottom of a 16:9 picture: the screen is far wider than a video. The picture cannot cover
  BMW's own status strip or climate bar.
- The first play on a car new to BeeMTube2 may take a moment: the service finds which of the car's players sounds.
- The switch from the first seconds of sound to the full file may be heard as a short break.
- Signing in uses the TV device sign-in that YouTube's TV apps use. The client id is read from YouTube's TV page
  when you sign in; BeeMTube2 ships none.
- Any app installed on the head unit can drive the service through its control socket (it is open to the group
  every app shares). Install only apps you trust; see `native/jap-ridetube-d/README.md`, "Security notes".

## Uninstall

1. In BeeMTube2's Settings, **Sign out** (or later, remove "YouTube on TV" at
   https://myaccount.google.com/permissions): uninstalling deletes the sign-in from the car, but Google keeps the
   grant until it is revoked.
2. In the MGU Store, uninstall **BeeMTube2**, then its service ("RideTube service", `jap-ridetube-d`).

## How it works on iDrive 8

- **The app** (`jap_ridetube8`) is a source package the Store's deploy tool builds on the head unit against BMW's
  own SDK. The HMI gives it a page; the GPU renderer `mgu-render` draws the whole app area over it (2880 x 764,
  under the status strip, over the climate bar) and routes touch.
- **The service** (`jap-ridetube-d`) fetches with yt-dlp on Node.js 22, decodes the picture on the Intel GPU
  (`ytdec`, the head unit's Media SDK) into the renderer's video layer, and plays the sound through the car.
- **The sound.** iDrive 8 does not offer the media player iDrive 7 plays app media with. The service plays through
  the car's dynamic media player instead, which it found by trying: it asks for the audio focus as BMW's own apps
  do, hands the file over as an item made the way BMW's code makes one, and starts it. The way that plays is kept;
  [CHANGELOG.md](CHANGELOG.md) (Beta 1) has what the car takes, and `native/jap-ridetube-d/README.md` the detail.
- **The picture's size** is the renderer's: the same decoded 16:9 frame is drawn larger around the centre and cut
  at the app area's edges, so a step takes effect at once.

## Layout

| Path | |
|---|---|
| `apps/jap_ridetube` | the app (Node 8, the iDrive's own app runtime), built for iDrive 8 with `--hmi ID8` |
| `kit/` | the app kit: the screen, touch, sheets, the keyboard, the renderer's protocol |
| `native/jap-ridetube-d` | the service on the car: player, fetcher, account, search, thumbnails, the search for the car's sound |
| `native/ytaud` | the AAC decoder of the service's own player |
| `tools/` | the release: `release_id8.sh`, the catalog (`release.py`), the kept versions (`channel.py`) |
| `docs/` | the front page's screenshots and what makes them (`readme_shots.js`, `readme_shots.py`) |

## Build and test on a computer

```sh
node kit/tools/test_runtime.js && node kit/tools/test_life.js && node kit/tools/test_parked.js \
  && node kit/tools/test_qr.js && node kit/tools/test_keyboard.js
(cd native/jap-ridetube-d && node test/test_ytd.js && node test/test_sdkread.js && node test/test_sound.js && node test/test_thumb.js \
  && python3.12 -I test/test_ytfetch.py && python3.12 -I test/test_ytalsa.py)
(cd native/ytaud && sh build.sh && python3.12 -I test_ytaud.py)     # FAAD2 fetched at its pinned commit; a static libc
(cd native/ytdec && make test && make target)     # make target needs Docker
```

A release needs an `oap-sdk` folder extracted from a BMW app you own (`node kit/tools/extract_sdk.js
<javascript/app.js of a BMW app>`; never commit it), then:

```sh
python3 kit/tools/build.py jap_ridetube && node kit/tools/test_ridetube.js
python3 kit/tools/build.py --hmi ID8 jap_ridetube && node kit/tools/test_ridetube8.js   # SHOTS=<dir>: PNGs of each screen
MGU_STORE=<a clone of github.com/robertnisipeanu/mgu-store> node kit/tools/test_mgu8.js   # iDrive 8: built by the Store's linker, started
node kit/tools/test_node8.js                                                             # every shipped file parses as Node 8 does
export MGU_STORE=<a clone of the MGU Store>
(cd native/jap-ridetube-d && ./build.sh)      # jap-node22 is built in github.com/JustAnotherPU/mgu-apps
python3 tools/release.py      # dist/release/: upload every file to a GitHub release tagged "catalog"
```

The tests need Node 18 or newer, Python 3.12 and ffmpeg.

## Releasing (maintainers)

```sh
MGU_STORE=<a clone of github.com/robertnisipeanu/mgu-store> tools/release_id8.sh   # -> dist/release/
```

The Release workflow runs it on a push to `main`: it builds, takes every component whose version did not change from
the kept release `stable-1` as it is (`tools/channel.py pin`: the service a car runs stays the very package that
was confirmed), and publishes the rest with the new `catalog.json` to the release tagged `catalog`, which the Store
reads. The prebuilt binaries (the video decoder `ytdec`, yt-dlp and the Node.js 22 build) are taken from
JustAnotherPU's published releases and checked against sha256 sums pinned in the script. The screenshots:
`python3 kit/tools/build.py --hmi ID8 jap_ridetube && node docs/readme_shots.js <folder> && python3
docs/readme_shots.py <folder>`.

## Credits and licence

BeeMTube2 began as a port of **[RideTube](https://github.com/JustAnotherPU/ridetube) by JustAnotherPU** (iDrive 7)
and is built on that work: the app, its service and the way they are built are JustAnotherPU's. The iDrive 8
version - how it finds the car's sound, its picture sizes, its motion, its screens - has grown far enough from the
original to carry its own name. The repository, the package ids (`jap_ridetube8`, `jap-ridetube-d`) and the
service's name in the Store keep theirs, so a car that has an earlier version updates in place.

GPL-3.0-or-later, as RideTube ([LICENSE](LICENSE), copyright JustAnotherPU and contributors). The app kit (`kit/`)
and the Node.js 22 tool (`tools/jap-node22/`) are MIT ([kit/LICENSE](kit/LICENSE),
[tools/jap-node22/LICENSE.mgu-apps](tools/jap-node22/LICENSE.mgu-apps)); third-party parts (yt-dlp, SponsorBlock
data, FAAD2 and others) as in [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES). Thanks to robertnisipeanu for the MGU
Store and its renderer.
