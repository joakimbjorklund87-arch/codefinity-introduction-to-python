function calculate() {
  const stageWidth = parseFloat(document.getElementById('stage_width').value);
  const speakerCoverage = parseFloat(document.getElementById('speaker_coverage').value);
  const audienceDistance = parseFloat(document.getElementById('audience_distance').value);

  const minSpeakersEl = document.getElementById('min-speakers');
  const centerSpacingEl = document.getElementById('center-spacing');
  const edgeSpacingEl = document.getElementById('edge-spacing');
  const notesEl = document.getElementById('notes');

  if (isNaN(stageWidth) || isNaN(speakerCoverage) || isNaN(audienceDistance) || stageWidth <= 0 || audienceDistance <= 0) {
    notesEl.textContent = 'Please enter positive numeric values.';
    return;
  }

  const speakerWidth = 2 * audienceDistance * Math.tan((speakerCoverage / 2) * Math.PI / 180);
  const amountOfSpeakers = Math.ceil(stageWidth / speakerWidth);
  const spacingBetween = stageWidth / amountOfSpeakers; // center-to-center
  const edgeToEdge = spacingBetween - speakerWidth; // may be negative if overlap

  minSpeakersEl.textContent = `You need a minimum of ${amountOfSpeakers} speaker(s).`;
  centerSpacingEl.textContent = `Place speakers approximately ${spacingBetween.toFixed(2)} m apart (center-to-center).`;
  edgeSpacingEl.textContent = `Approximate edge-to-edge spacing: ${edgeToEdge.toFixed(2)} m.`;
  notesEl.textContent = edgeToEdge < 0 ? 'Speakers will slightly overlap coverage areas — consider wider coverage or more distance.' : '';
}

// Run initial calculation with default values
window.addEventListener('DOMContentLoaded', calculate);
