#!/usr/bin/env python3
"""Search or verify IconTree icon IDs offline.

  python search_icons.py "arrow right"      # IDs containing any term (spaces/commas separate terms)
  python search_icons.py --check heart star # report which IDs exist, suggest close matches for the rest
"""
import json
import re
import sys
from pathlib import Path

ids = json.loads((Path(__file__).resolve().parent.parent / "assets" / "icon-names.json").read_text())


def search(query: str):
    terms = [t for t in re.split(r"[\s,]+", query.strip().lower()) if t]
    return [i for i in ids if terms and any(t in i.lower() for t in terms)]


def main(argv):
    if not argv:
        print(__doc__)
        return 1
    if argv[0] == "--check":
        bad = 0
        for name in argv[1:]:
            if name in ids:
                print(f"ok       {name}")
            else:
                bad += 1
                words = re.sub(r"([a-z])([A-Z])", r"\1 \2", name).replace("_", " ")
                near = search(words)[:5]
                print(f"MISSING  {name}" + (f"  (similar: {', '.join(near)})" if near else ""))
        return 1 if bad else 0
    hits = search(" ".join(argv))
    print("\n".join(hits) if hits else "No icons found")
    print(f"-- {len(hits)} of {len(ids)} icons", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
