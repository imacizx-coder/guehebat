from flask import Flask, send_from_directory, jsonify, request
import random

app = Flask(__name__, static_folder='static', static_url_path='/')

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/api/ai', methods=['POST'])
def ai_response():
    data = request.json
    pesan = data.get('message', '').lower()
    
    # Respons AI yang lebih variatif
    if "selesai" in pesan or "tugas" in pesan:
        balasan = random.choice([
            "Kerja bagus! Aku merasa lebih berenergi sekarang.",
            "Satu tugas selesai! Ayo lanjutkan fokusnya.",
            "Wah hebat! XP kita pasti bertambah nih."
        ])
    elif "capek" in pesan or "istirahat" in pesan:
        balasan = "Jangan paksakan dirimu. Ambil jeda 5 menit, minum air, lalu kita lanjut lagi ya!"
    else:
        balasan = "Aku di sini menemanimu. Ayo mulai Pomodoro-nya!"
        
    return jsonify({"response": balasan})

if __name__ == '__main__':
    app.run(debug=True)