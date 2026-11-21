#!/usr/bin/env python3
"""The kept versions of this repository's MGU Store catalog.

  catalog    the GitHub release the Store reads for waliworld/iDrive8-RideTube (Releases): built from main.
  stable-1   Beta 1, the first version confirmed with sound and picture on a car: a copy, never rebuilt.
  beta2      Beta 2 (the branch beta2), not rebuilt either.

pin     python3 tools/channel.py pin <dist/release> <a kept catalog.json: a file or an https address>
        Every component of the built catalog that the kept catalog has at the same version is taken from there as
        it is (its entry, with the kept release's address, size and hash), and its package is removed from the
        folder: a car keeps the very packages that were confirmed for what did not change.
freeze  python3 tools/channel.py freeze <catalog.json address> <tag> <out folder> [--expect id=version ...]
        A copy of a published catalog for keeping: every package and icon it names is downloaded and checked against
        its size and sha256, and the catalog is written with their addresses in the release <tag> of the same
        repository. --expect: stop unless the catalog has that component at that version.

Standard library only (downloads through curl).
"""
import hashlib
import json
import os
import re
import subprocess
import sys


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def fetch(url, out):
    if not re.match(r'^https://[\w.-]+/[\w./@%+~-]+$', url):
        sys.exit('channel.py: not an address this tool downloads: %r' % url)
    subprocess.run(['curl', '-fsSL', '--retry', '3', '-o', out, url], check=True)


def load(src, tmp):
    if src.startswith('https://'):
        fetch(src, tmp)
        src = tmp
    with open(src) as f:
        return json.load(f)


def pin(out, stable_src):
    path = os.path.join(out, 'catalog.json')
    with open(path) as f:
        cat = json.load(f)
    stable = load(stable_src, os.path.join(out, '.stable-catalog.json'))
    try:
        os.unlink(os.path.join(out, '.stable-catalog.json'))
    except OSError:
        pass
    by_id = {c['id']: c for c in stable.get('components', [])}
    said = []
    for i, c in enumerate(cat['components']):
        s = by_id.get(c['id'])
        if not s or s.get('version') != c.get('version'):
            said.append('%s %s: built now' % (c['id'], c.get('version')))
            continue
        name = c['artifact']['name']
        # (an app's icon belongs to its entry: the stable one's goes with the stable entry, by its whole address -
        # a catalog's `icon` is an https address or a name beside the catalog)
        if s.get('icon') and not s['icon'].startswith('https://'):
            s = dict(s, icon=s['artifact']['url'].rsplit('/', 1)[0] + '/' + s['icon'])
        cat['components'][i] = s
        for f in [name] + ([c['icon']] if c.get('icon') else []):
            try:
                os.unlink(os.path.join(out, f))
            except OSError:
                pass
        said.append('%s %s: the kept package (%s)' % (c['id'], c['version'], s['artifact']['url']))
    with open(path, 'w') as f:
        json.dump(cat, f, indent=2)
        f.write('\n')
    print('\n'.join(said))


def freeze(src, tag, out, expect):
    m = re.match(r'^(https://github\.com/[\w.-]+/[\w.-]+/releases/download/)[\w.-]+/catalog\.json$', src)
    if not m or not re.match(r'^[\w.-]+$', tag):
        sys.exit('channel.py freeze: <address> is a release\'s catalog.json on github.com, <tag> a release tag')
    base = m.group(1) + tag + '/'
    os.makedirs(out, exist_ok=True)
    cat = load(src, os.path.join(out, 'catalog.json'))
    have = {c['id']: c.get('version') for c in cat.get('components', [])}
    for e in expect:
        cid, _, ver = e.partition('=')
        if have.get(cid) != ver:
            sys.exit('channel.py freeze: the catalog has %s %s, not %s: nothing kept' % (cid, have.get(cid), ver))
    for c in cat['components']:
        a = c['artifact']
        if not re.match(r'^[\w.@+-]+$', a['name']):
            sys.exit('channel.py freeze: a package name this tool does not keep: %r' % a['name'])
        p = os.path.join(out, a['name'])
        fetch(a['url'], p)
        if os.path.getsize(p) != a['size'] or sha256(p) != a['sha256']:
            sys.exit('channel.py freeze: %s is not what the catalog lists (size or sha256)' % a['name'])
        old = a['url'].rsplit('/', 1)[0] + '/'
        a['url'] = base + a['name']
        if c.get('icon'):
            if not re.match(r'^[\w.@+-]+$', c['icon']):
                sys.exit('channel.py freeze: an icon name this tool does not keep: %r' % c['icon'])
            ip = os.path.join(out, c['icon'])
            fetch(old + c['icon'], ip)
            if c.get('iconSha256') and sha256(ip) != c['iconSha256']:
                sys.exit('channel.py freeze: %s is not what the catalog lists' % c['icon'])
        print('%s %s: kept (%d bytes)' % (c['id'], c.get('version'), a['size']))
    with open(os.path.join(out, 'catalog.json'), 'w') as f:
        json.dump(cat, f, indent=2)
        f.write('\n')


def main(argv):
    if len(argv) == 4 and argv[1] == 'pin':
        return pin(argv[2], argv[3])
    if len(argv) >= 5 and argv[1] == 'freeze':
        expect = []
        rest = argv[5:]
        while rest:
            if rest[0] != '--expect' or len(rest) < 2:
                sys.exit(__doc__)
            expect.append(rest[1])
            rest = rest[2:]
        return freeze(argv[2], argv[3], argv[4], expect)
    sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv)
