#!/usr/bin/env python3
"""Bookbind oracle: independent python recompute of imposition math."""
import json, os

def impose_sig(start, P):
    out = []
    i = 0
    while i * 4 < P:
        out.append({'sheet': i + 1,
                    'front': [start + P - 1 - 2*i, start + 2*i],
                    'back': [start + 2*i + 1, start + P - 2 - 2*i]})
        i += 1
    return out

def impose(total, sig):
    if not (total > 0) or int(total) != total: return None
    if not (sig >= 4) or sig % 4 != 0: return None
    sigs, start, rem, padded = [], 1, total, total
    while rem > 0:
        take = min(sig, rem)
        tp = take if take % 4 == 0 else take + 4 - take % 4
        sigs.append({'n': len(sigs)+1, 'startPage': start, 'realPages': take,
                     'paddedPages': tp, 'blanks': [start+b-1 for b in range(take+1, tp+1)],
                     'sheets': impose_sig(start, tp)})
        padded += tp - take
        start += tp
        rem -= take
    return {'signatures': sigs,
            'totalSheets': sum(len(s['sheets']) for s in sigs),
            'paddedPages': padded, 'blanksTotal': padded - total}

def thread(spine, n):
    if not (spine > 0 and n >= 1): return None
    return round(spine * (n + 1) * 1.2, 1)

def board(w, h, sq=3, hi=4):
    if not (w > 0 and h > 0): return None
    if not (sq >= 0 and hi >= 0): return None
    return {'w': round(w - hi + sq, 1), 'h': round(h + 2*sq, 1)}

cases = []
for args in [(40,16),(50,16),(12,4),(100,8),(7,16),(0,16),(33,8),(20,6),(64,16),(1,4)]:
    cases.append({'kind':'impose','args':list(args),'oracle':impose(*args)})
for args in [(21,5),(10,1),(0,3),(25.5,12)]:
    cases.append({'kind':'thread','args':list(args),'oracle':thread(*args)})
for args in [(140,210,3,4),(210,297,3,4),(148,210,4,4),(0,210,3,4),(100,100,-1,4)]:
    cases.append({'kind':'board','args':list(args),'oracle':board(*args)})

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': cases}, open(out,'w'))
print('cases:', len(cases))
