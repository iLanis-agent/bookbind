'use strict';
/* global Bookbind */
(function () {
  const $ = (id) => document.getElementById(id);
  const presets = [
    { n: 'Zine 12p folio', p: 12, s: 4 },
    { n: 'Chapbook 40p', p: 40, s: 8 },
    { n: 'Novel 64p', p: 64, s: 16 },
    { n: 'Odd 33p', p: 33, s: 8 }
  ];
  const prow = $('presets');
  presets.forEach((pr) => {
    const b = document.createElement('button');
    b.textContent = pr.n;
    b.addEventListener('click', () => { $('pages').value = pr.p; $('sig').value = pr.s; run(); });
    prow.appendChild(b);
  });

  const pg = (n, blanks) => blanks.indexOf(n) >= 0 ? '<em>' + n + ' blank</em>' : String(n);

  function run () {
    const total = parseInt($('pages').value, 10);
    const sigSize = parseInt($('sig').value, 10);
    const r = Bookbind.impose(total, sigSize);
    if (r === null) {
      $('plan').innerHTML = '<p>Enter a positive whole page count and a signature size that is a multiple of 4.</p>';
    } else {
      let h = '<p class="big">' + r.signatures.length + ' signature' +
        (r.signatures.length === 1 ? '' : 's') + ', ' + r.totalSheets + ' sheet' +
        (r.totalSheets === 1 ? '' : 's') + ' of paper';
      if (r.blanksTotal > 0) h += ', ' + r.blanksTotal + ' trailing blank page' + (r.blanksTotal === 1 ? '' : 's') + ' added';
      h += '.</p>';
      for (const sig of r.signatures) {
        h += '<h3>Signature ' + sig.n + ' - pages ' + sig.startPage + ' to ' +
          (sig.startPage + sig.paddedPages - 1) +
          (sig.blanks.length ? ' (' + sig.blanks.length + ' blank)' : '') + '</h3>';
        h += '<table><tr><th>Sheet</th><th>Front (left | right)</th><th>Back (left | right)</th></tr>';
        for (const sh of sig.sheets) {
          h += '<tr><td>' + sh.sheet + '</td><td>' + pg(sh.front[0], sig.blanks) + ' | ' + pg(sh.front[1], sig.blanks) +
               '</td><td>' + pg(sh.back[0], sig.blanks) + ' | ' + pg(sh.back[1], sig.blanks) + '</td></tr>';
        }
        h += '</table>';
      }
      h += '<p class="note">Print duplex flipping on the long edge, fronts first; each sheet pairs its back in the next pass. Fold each signature, nest, and trim.</p>';
      $('plan').innerHTML = h;
    }

    const spine = parseFloat($('spine').value);
    const pw = parseFloat($('pw').value), ph = parseFloat($('ph').value);
    const t = Bookbind.threadCm(spine, r ? r.signatures.length : 0);
    const bd = Bookbind.boardMm(pw, ph, 3, 4);
    let e = '';
    if (t !== null && r) e += '<p class="big">Binding thread: about ' + t + ' cm for ' + r.signatures.length + ' signature' + (r.signatures.length === 1 ? '' : 's') + ' (spine x (signatures + 1) + 20% working allowance).</p>';
    if (bd !== null) e += '<p class="big">Cover boards: ' + bd.w + ' x ' + bd.h + ' mm (3 mm squares, 4 mm hinge offset).</p>';
    $('extras').innerHTML = e;
  }

  ['pages', 'sig', 'spine', 'pw', 'ph'].forEach((id) => $(id).addEventListener('input', run));
  run();
})();
