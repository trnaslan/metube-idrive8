# MeTube (fork of BeeMTube2)

This directory started as an unmodified copy of github.com/waliworld/iDrive8-RideTube (BeeMTube2, GPL-3.0-or-later),
which is itself based on RideTube by JustAnotherPU. Licence and credits stay as in LICENSE, README.md and
THIRD_PARTY_LICENSES. Changes made here are GPL-3.0-or-later too.

Baseline only: ids, names and behaviour are unchanged. The package ids (jap_ridetube8, jap-ridetube-d) are
kept on purpose: the sound code asks the car for audio focus under the app id, so renaming is a change to
make deliberately and test on the car, not a side effect.

Checked here (host): kit tests, test_node8, service tests test_ytd, test_sdkread, test_thumb.
Not checked: anything on the car; the app builds (need oap-sdk from a BMW app).

## Changes so far (apps/jap_ridetube)
- Name shown in the app and app.json titles: BeeMTube2 -> MeTube. Credits to RideTube / BeeMTube2 stay in the app's
  Settings ("Based on", "iDrive 8 version by") and on the start screen.
- Own logo (pink rounded square with a play mark): logo.js (start-screen picture), icon.png, icon.svg, the in-app mark.
- Palette: neutral dark greys instead of the navy theme; the accent stays pink. Layout unchanged (it already has the
  left rail Home / Subscriptions / Watch later, search, tile grid, player).
- Package ids unchanged (see above). Not rendered anywhere: no oap-sdk here, so no screenshots; checked: kit tests,
  test_node8, logo.js unpacks to 164x164x4.

## Silent video (service 0.5.3, app 0.7.1)
Found on a car (G20, MGU): the car's DynamicMediaPlayer accepts getAudioFocus and createPlaylist but leaves its list empty,
every way tried; the play then failed and the picture never started (ytdec is paced by the player's clock).
Now, with silentVideo on (default on an id8 head unit; MGU_YT_SILENT_VIDEO=0/1 forces it), a play whose sound fails runs the
picture on the service's own clock (playSilent/silentTick in ytd.js) and tells the driver (note + toast). Pause, resume,
seek, stop and "ended" work on that clock. Sound is NOT fixed by this. Host-tested only (test_ytd.js, fake ytdec); the
picture path on the car is unverified.

## Known item form when BMW's code cannot be read (service 0.5.4)
Found on a G20 car: no installed app carries BMW's player code, so sdkread found no item form and the service only tried
guesses (a 12-byte id, no ITEM_ID): every list stayed empty. Now, in that case, sound.js (builtinIdForms) first tries the
form that played on the G87 the service was confirmed on: FILE_SIZE / ITEM_ID / FILE_NAME, id four bytes 03 B8 00 01 on
TempMedia (type per instance: Media 0, TempMedia 3, TempLumMedia 4; number from the logging id RTB8). It only counts when
it plays; otherwise the other forms follow. Host-tested against the fake car; the real car is the test.

## The media engine's own output (service 0.5.5)

On the iDrive 8 head unit the car's media engine writes to the ALSA device
`smartx:MediaSink_AudioOut_Front_CF_48_COMBINED_STEREO_MULTICHANNEL` (named in
`/etc/mediaconfig/mediaengine_config_hu.xml` and `mediaapp_config_hu.xml`). Its name has "sink" in it, which
`ytalsa.py probe` took for a device that is not ours, so the direct route never tried it. It is now ours (first
among the devices to try). `test/test_ytalsa.py` covers it.
