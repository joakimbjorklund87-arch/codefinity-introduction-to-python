async function submitForm() {
  const stageWidth = parseFloat(document.getElementById('stage_width').value);
  const speakerCoverage = parseFloat(document.getElementById('speaker_coverage').value);
  const audienceDistance = parseFloat(document.getElementById('audience_distance').value);

  const notesEl = document.getElementById('notes');
  const minSpeakersEl = document.getElementById('min-speakers');
  const centerSpacingEl = document.getElementById('center-spacing');
  const edgeSpacingEl = document.getElementById('edge-spacing');

  const errStage = document.getElementById('err-stage');
  const errCov = document.getElementById('err-cov');
  const errDist = document.getElementById('err-dist');

  // clear errors
  errStage.textContent = '';
  errCov.textContent = '';
  errDist.textContent = '';

  setLoading(true);

  if (isNaN(stageWidth) || isNaN(speakerCoverage) || isNaN(audienceDistance)) {
    if (isNaN(stageWidth)) errStage.textContent = 'Required';
    if (isNaN(speakerCoverage)) errCov.textContent = 'Required';
    if (isNaN(audienceDistance)) errDist.textContent = 'Required';
    setLoading(false);
    return;
  }

  const payload = { stage_width: stageWidth, speaker_coverage: speakerCoverage, audience_distance: audienceDistance };

  try {
    const resp = await fetch('/api/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) throw new Error('Server error');

    const data = await resp.json();
    minSpeakersEl.textContent = `You need a minimum of ${data.amount} speaker(s).`;
    centerSpacingEl.textContent = `Place speakers approximately ${data.spacing.toFixed(2)} m apart (center-to-center).`;
    edgeSpacingEl.textContent = `Approximate edge-to-edge spacing: ${data.edge.toFixed(2)} m.`;
    notesEl.textContent = data.edge < 0 ? 'Speakers will slightly overlap coverage areas — consider wider coverage or more distance.' : '';
    // render visualization
    try { renderVisualization(data, stageWidth, audienceDistance, speakerCoverage); } catch (e) { /* ignore */ }
    // focus results for screen readers
    minSpeakersEl.focus && minSpeakersEl.focus();
  } catch (err) {
    notesEl.textContent = 'Error calculating results.';
  }
  setLoading(false);
}

// Initialize with default values on load
window.addEventListener('DOMContentLoaded', () => {
  // initial calculation using default form values
  submitForm();
});

function setLoading(on){
  const loading = document.getElementById('loading');
  const btn = document.getElementById('calc-btn');
  if(on){ loading.hidden = false; btn.disabled = true; }
  else{ loading.hidden = true; btn.disabled = false; }
}

function resetForm(){
  document.getElementById('calc-form').reset();
  document.getElementById('err-stage').textContent = '';
  document.getElementById('err-cov').textContent = '';
  document.getElementById('err-dist').textContent = '';
  document.getElementById('min-speakers').textContent = '';
  document.getElementById('center-spacing').textContent = '';
  document.getElementById('edge-spacing').textContent = '';
  document.getElementById('notes').textContent = '';
}

let currentSpeakers = null;

function renderVisualization(data, stageWidth, audienceDistance, speakerCoverage){
  const svg = document.getElementById('viz');
  const viewW = 760, viewH = 340, margin = 36;
  const ppm = (viewW - margin*2) / Math.max(stageWidth, 1);
  const stageY = margin + 8;
  const audienceY = Math.min(viewH - margin, margin + audienceDistance * ppm + 20);

  const spacingPx = data.spacing * ppm;
  const speakerCount = Math.max(1, data.amount);

  // initialize speaker state if needed
  if(!currentSpeakers || currentSpeakers.length !== speakerCount){
    currentSpeakers = [];
    const firstX = margin + spacingPx/2;
    for(let i=0;i<speakerCount;i++){
      currentSpeakers.push({ x: firstX + i*spacingPx, angle: 90 }); // default angle downwards
    }
  }

  // build SVG content with identifiable elements
  let html = '';
  html += `<line x1="${margin}" y1="${stageY}" x2="${viewW-margin}" y2="${stageY}" stroke="#111" stroke-width="2"/>`;
  html += `<line x1="${margin}" y1="${audienceY}" x2="${viewW-margin}" y2="${audienceY}" stroke="#6b7280" stroke-dasharray="4 4" stroke-width="1"/>`;

  for(let i=0;i<speakerCount;i++){
    const s = currentSpeakers[i];
    const sx = s.x;
    const sy = stageY;
    const ang = s.angle; // degrees
    const halfAngle = (speakerCoverage/2) * Math.PI/180;

    // compute left/right intersection points with audience line using angle +/- halfAngle
    const theta = ang * Math.PI/180;
    const leftTheta = theta - halfAngle;
    const rightTheta = theta + halfAngle;

    function intersectX(t){
      const sin = Math.sin(t);
      const cos = Math.cos(t);
      if(Math.abs(sin) < 1e-6) return null;
      const param = (audienceY - sy) / sin;
      return sx + param * cos;
    }

    const xLeft = intersectX(leftTheta);
    const xRight = intersectX(rightTheta);

    const polyId = `coverage-${i}`;
    if(xLeft !== null && xRight !== null){
      html += `<polygon id="${polyId}" points="${sx},${sy} ${xLeft},${audienceY} ${xRight},${audienceY}" fill="rgba(37,99,235,0.18)" stroke="rgba(37,99,235,0.35)" stroke-width="1"/>`;
    } else {
      html += `<g id="${polyId}"></g>`;
    }

    const circleId = `speaker-circle-${i}`;
    html += `<circle id="${circleId}" cx="${sx}" cy="${sy}" r="8" fill="#111" style="cursor:grab"/>`;
    html += `<text id="label-${i}" x="${sx}" y="${sy - 14}" font-size="11" text-anchor="middle" fill="#111">S${i+1}</text>`;

    // rotate handle (small square above speaker)
    const hx = sx;
    const hy = sy - 34;
    const handleId = `rotate-${i}`;
    html += `<rect id="${handleId}" x="${hx-6}" y="${hy-6}" width="12" height="12" rx="2" fill="#fff" stroke="#111" style="cursor:pointer"/>`;
    // angle display
    html += `<text x="${sx + 18}" y="${sy - 6}" font-size="11" fill="#6b7280">${Math.round(ang)}°</text>`;
  }

  html += `<text x="${viewW/2}" y="${stageY - 18}" text-anchor="middle" font-size="12" fill="#111">Stage (width ${stageWidth} m)</text>`;
  html += `<text x="${viewW/2}" y="${audienceY + 18}" text-anchor="middle" font-size="11" fill="#6b7280">Audience (≈ ${audienceDistance} m)</text>`;

  svg.innerHTML = html;

  // attach interactions
  initInteractions(svg, stageY, audienceY, speakerCoverage);
}

function initInteractions(svg, stageY, audienceY, speakerCoverage){
  const viewW = 760, margin = 36;
  const rect = svg.getBoundingClientRect();

  function clientToSvg(evt){
    const x = (evt.clientX - rect.left) * (viewW / rect.width);
    const y = (evt.clientY - rect.top) * (340 / rect.height);
    return { x, y };
  }

  currentSpeakers.forEach((s, i) => {
    const circle = document.getElementById(`speaker-circle-${i}`);
    const handle = document.getElementById(`rotate-${i}`);
    const poly = document.getElementById(`coverage-${i}`);
    const label = document.getElementById(`label-${i}`);

    if(!circle || !handle) return;

    let dragging = false;
    let rotating = false;

    circle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      circle.setPointerCapture(e.pointerId);
      dragging = true;
    });

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      rotating = true;
    });

    const onPointerMove = (e) => {
      if(!dragging && !rotating) return;
      const p = clientToSvg(e);
      if(dragging){
        const minX = margin; const maxX = viewW - margin;
        s.x = Math.max(minX, Math.min(maxX, p.x));
        // update elements
        circle.setAttribute('cx', s.x);
        label.setAttribute('x', s.x);
        // update polygon
        updateCoverageForSpeaker(i, s, poly, stageY, audienceY, speakerCoverage);
        // move handle
        const h = document.getElementById(`rotate-${i}`);
        if(h){
          const hy = stageY - 34;
          h.setAttribute('x', s.x - 6);
        }
      }
      if(rotating){
        const ang = Math.atan2(p.y - stageY, p.x - s.x) * 180/Math.PI; // degrees
        s.angle = ang;
        // update polygon and angle label
        updateCoverageForSpeaker(i, s, poly, stageY, audienceY, speakerCoverage);
        const angleLabel = svg.querySelectorAll('text')[ (i*2)+1 ];
        if(angleLabel) angleLabel.textContent = `${Math.round(s.angle)}°`;
      }
    };

    const onPointerUp = (e) => {
      if(dragging) { dragging = false; circle.releasePointerCapture(e.pointerId); }
      if(rotating){ rotating = false; handle.releasePointerCapture(e.pointerId); }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  });
}

function updateCoverageForSpeaker(i, s, poly, stageY, audienceY, speakerCoverage){
  const sx = s.x; const sy = stageY; const ang = s.angle;
  const halfAngle = (speakerCoverage/2) * Math.PI/180;
  const theta = ang * Math.PI/180;
  const leftTheta = theta - halfAngle;
  const rightTheta = theta + halfAngle;

  function intersectX(t){
    const sin = Math.sin(t);
    const cos = Math.cos(t);
    if(Math.abs(sin) < 1e-6) return null;
    const param = (audienceY - sy) / sin;
    return sx + param * cos;
  }

  const xLeft = intersectX(leftTheta);
  const xRight = intersectX(rightTheta);
  if(xLeft !== null && xRight !== null){
    poly.setAttribute('points', `${sx},${sy} ${xLeft},${audienceY} ${xRight},${audienceY}`);
  } else {
    poly.setAttribute('points', '');
  }
}

// update render call after successful calculation by intercepting submitForm's success
// modify submitForm to call renderVisualization when data is available

