from flask import Flask, request
import sqlite3

app = Flask(__name__)
db_path = 'data.db'

@app.route('/api/save-fingerprint', methods=['POST'])
def save_fingerprint():
    data = request.json
    fingerprint = data.get('fingerprint')
    ip = data.get('ip')
    
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (fingerprint, ip) VALUES (?, ?)', (fingerprint, ip))
        conn.commit()
    
    return 'OK'
