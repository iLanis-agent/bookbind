/* Bookbind engine: signature imposition for home bookbinders.
   A signature of P pages (multiple of 4) folds from P/4 nested sheets.
   Sheet i (0 = outer) prints:
     front: left = P-2i,   right = 2i+1
     back:  left = 2i+2,   right = P-2i-1
   Multiple signatures chunk the page range; the last signature is padded
   with blanks up to a multiple of 4. */
'use strict';
var Bookbind = (function () {

  function imposeSig(startPage, pageCount) {
    /* pageCount must be a positive multiple of 4 */
    var sheets = [];
    var P = pageCount;
    for (var i = 0; i * 4 < P; i++) {
      sheets.push({
        sheet: i + 1,
        front: [startPage + P - 1 - 2 * i, startPage + 2 * i],
        back: [startPage + 2 * i + 1, startPage + P - 2 - 2 * i]
      });
    }
    return sheets;
  }

  function impose(totalPages, sigPages) {
    if (!(totalPages > 0) || Math.floor(totalPages) !== totalPages) return null;
    if (!(sigPages >= 4) || sigPages % 4 !== 0) return null;
    var sigs = [];
    var start = 1;
    var remaining = totalPages;
    var padded = totalPages;
    while (remaining > 0) {
      var take = Math.min(sigPages, remaining);
      var takePadded = take;
      if (takePadded % 4 !== 0) takePadded += 4 - (takePadded % 4);
      var blanks = [];
      for (var b = take + 1; b <= takePadded; b++) blanks.push(start + b - 1);
      sigs.push({
        n: sigs.length + 1,
        startPage: start,
        realPages: take,
        paddedPages: takePadded,
        blanks: blanks,
        sheets: imposeSig(start, takePadded)
      });
      padded += takePadded - take;
      start += takePadded;
      remaining -= take;
    }
    var totalSheets = 0;
    for (var s = 0; s < sigs.length; s++) totalSheets += sigs[s].sheets.length;
    return { signatures: sigs, totalSheets: totalSheets, paddedPages: padded,
             blanksTotal: padded - totalPages };
  }

  /* Binding thread estimate: spine height times (signatures + 1), plus 20%
     working allowance - common hobby rule of thumb. */
  function threadCm(spineCm, numSigs) {
    if (!(spineCm > 0) || !(numSigs >= 1)) return null;
    return Math.round(spineCm * (numSigs + 1) * 1.2 * 10) / 10;
  }

  /* Case-binding board size: height + two squares, width minus hinge offset
     plus one square. Square default 3mm, hinge offset 4mm. */
  function boardMm(pageWmm, pageHmm, squareMm, hingeMm) {
    if (!(pageWmm > 0) || !(pageHmm > 0)) return null;
    var sq = squareMm == null ? 3 : squareMm;
    var hi = hingeMm == null ? 4 : hingeMm;
    if (!(sq >= 0) || !(hi >= 0)) return null;
    return { w: Math.round((pageWmm - hi + sq) * 10) / 10,
             h: Math.round((pageHmm + 2 * sq) * 10) / 10 };
  }

  return { impose: impose, threadCm: threadCm, boardMm: boardMm };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Bookbind;
