from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)

#for translating input language to output language using googletrans api
@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        translator = Translator()
        translation = translator.translate(
            data['text'],
            dest=data['target_lang'],
            src=data['source_lang'] if data['source_lang'] != 'auto' else 'auto'
        ).text
        return jsonify({
            'translation': translation,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
