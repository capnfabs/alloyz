import './style.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./service-worker.js', import.meta.url));
  });
}

console.log('App loaded!');

const alloyData = {
  sterling: {
    name: 'Sterling Silver',
    breakdown: [
      { label: 'Silver (Ag)', percent: 0.925 },
      { label: 'Copper (Cu)', percent: 0.075 }
    ]
  },
  '9k': {
    name: '9k Gold',
    breakdown: [
      { label: 'Gold (Au)', percent: 0.375 },
      { label: 'Silver (Ag)', percent: 0.3125 },
      { label: 'Copper (Cu)', percent: 0.3125 }
    ]
  },
  '12k': {
    name: '12k Gold',
    breakdown: [
      { label: 'Gold (Au)', percent: 0.5 },
      { label: 'Silver (Ag)', percent: 0.25 },
      { label: 'Copper (Cu)', percent: 0.25 }
    ]
  },
  '14k': {
    name: '14k Gold',
    breakdown: [
      { label: 'Gold (Au)', percent: 0.583 },
      { label: 'Silver (Ag)', percent: 0.2085 },
      { label: 'Copper (Cu)', percent: 0.2085 }
    ]
  },
  '18k': {
    name: '18k Gold',
    breakdown: [
      { label: 'Gold (Au)', percent: 0.75 },
      { label: 'Silver (Ag)', percent: 0.125 },
      { label: 'Copper (Cu)', percent: 0.125 }
    ]
  }
};

const waxInput = document.getElementById('wax-weight');
const metalInput = document.getElementById('metal-weight');
const alloySelect = document.getElementById('alloy-type');
const resultsDiv = document.getElementById('results');
const waxWarningDiv = document.getElementById('wax-warning');

let updating = false;

function syncInputs(source) {
  if (updating) return;
  updating = true;
  let wax = parseFloat(waxInput.value);
  let metal = parseFloat(metalInput.value);
  if (source === 'wax' && !isNaN(wax) && wax > 0) {
    metalInput.value = (wax * 10).toFixed(2);
  } else if (source === 'metal' && !isNaN(metal) && metal > 0) {
    waxInput.value = (metal / 10).toFixed(2);
  }
  updating = false;
}

function calculate() {
  let wax = parseFloat(waxInput.value);
  let metal = parseFloat(metalInput.value);
  let baseMetal = 0;
  let usedWax = false;
  let warning = '';

  if (!isNaN(wax) && wax > 10) {
    warning = '<div class="mt-2 p-2 rounded bg-yellow-200 text-yellow-900 font-bold font-sans-vapor text-sm">This seems like a lot! Did you accidentally enter the metal weight?</div>';
  }
  waxWarningDiv.innerHTML = warning;

  if (!isNaN(wax) && wax > 0) {
    baseMetal = wax * 10;
    usedWax = true;
  } else if (!isNaN(metal) && metal > 0) {
    baseMetal = metal;
  } else {
    resultsDiv.innerHTML = '<span class="text-gray-400">Enter wax or metal weight above.</span>';
    return;
  }

  const totalMetal = baseMetal + 5;
  const alloy = alloyData[alloySelect.value];

  let breakdownHtml = `<div class="mb-2 font-semibold">${alloy.name}</div>`;
  breakdownHtml += `<div class="font-semibold mt-4 text-xs text-gray-400">Metal requirements:</div>`;
  breakdownHtml += `<div class="mt-2 text-xs text-gray-400">
    <div class="flex justify-between tabular-nums">
      <span>Wax weight × 10:</span>
      <span class="inline-flex items-baseline">
        <span class="font-mono min-w-[4.5em] text-right tabular-nums">${baseMetal.toFixed(2)}</span>
        <span class="ml-1 font-mono">g</span>
      </span>
    </div>
    <div class="flex justify-between tabular-nums">
      <span>Sprues:</span>
      <span class="inline-flex items-baseline">
        <span class="font-mono min-w-[4.5em] text-right tabular-nums">5.00</span>
        <span class="ml-1 font-mono">g</span>
      </span>
    </div>
  </div>`;
  breakdownHtml += `<div class="mt-2 flex justify-between items-baseline">
    <span>Total metal needed:</span>
    <span class="inline-flex items-baseline">
      <span class="font-mono min-w-[4.5em] text-right tabular-nums">${totalMetal.toFixed(2)}</span>
      <span class="ml-1 font-mono">g</span>
    </span>
  </div>`;
  breakdownHtml += '<div class="mt-4 mb-2">Breakdown:</div>';
  breakdownHtml += '<hr class="my-2 border-pink-400 border-t-2">';
  breakdownHtml += '<div class="space-y-1">';
  alloy.breakdown.forEach(part => {
    const amt = totalMetal * part.percent;
    breakdownHtml += `<div class="flex justify-between items-baseline">
      <span>${part.label} (${(part.percent*100).toFixed(1)}%)</span>
      <span class="inline-flex items-baseline">
        <span class="font-mono min-w-[4.5em] text-right tabular-nums">${amt.toFixed(2)}</span>
        <span class="ml-1 font-mono">g</span>
      </span>
    </div>`;
  });
  breakdownHtml += '</div>';
  breakdownHtml += '<hr class="my-2 border-pink-400 border-t-2">';

  resultsDiv.innerHTML = breakdownHtml;
}

waxInput.addEventListener('input', () => {
  syncInputs('wax');
  calculate();
});
metalInput.addEventListener('input', () => {
  syncInputs('metal');
  calculate();
});
alloySelect.addEventListener('input', calculate);
alloySelect.addEventListener('change', calculate);

calculate();
