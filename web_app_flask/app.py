from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)


def compute(stage_width: float, speaker_coverage: float, audience_distance: float):
    speaker_width = 2 * audience_distance * math.tan(math.radians(speaker_coverage / 2))
    amount_of_speakers = math.ceil(stage_width / speaker_width) if speaker_width > 0 else 0
    spacing_between = stage_width / amount_of_speakers if amount_of_speakers > 0 else 0
    edge_to_edge = spacing_between - speaker_width
    return {
        'amount': int(amount_of_speakers),
        'speaker_width': round(speaker_width, 4),
        'spacing': round(spacing_between, 4),
        'edge': round(edge_to_edge, 4),
    }


@app.route('/', methods=['GET', 'POST'])
def index():
    result = None
    defaults = {
        'stage_width': 12,
        'speaker_coverage': 60,
        'audience_distance': 8,
    }

    if request.method == 'POST':
        try:
            s = float(request.form.get('stage_width', defaults['stage_width']))
            c = float(request.form.get('speaker_coverage', defaults['speaker_coverage']))
            d = float(request.form.get('audience_distance', defaults['audience_distance']))
            result = compute(s, c, d)
            defaults.update(stage_width=s, speaker_coverage=c, audience_distance=d)
        except Exception:
            result = {'error': 'Invalid inputs — please enter numeric values.'}

    return render_template('index.html', result=result, defaults=defaults)


@app.route('/api/calc', methods=['POST'])
def api_calc():
    data = request.get_json() or request.form
    try:
        s = float(data.get('stage_width', 0))
        c = float(data.get('speaker_coverage', 0))
        d = float(data.get('audience_distance', 0))
    except Exception:
        return jsonify({'error': 'Invalid input'}), 400

    return jsonify(compute(s, c, d))


if __name__ == '__main__':
    app.run(debug=False)
