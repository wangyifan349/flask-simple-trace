from flask import Flask, request
from datetime import datetime
import sqlite3

app = Flask(__name__)

def create_user_table():
    conn = sqlite3.connect('your_database.db')  # 替换为实际的数据库连接
    cursor = conn.cursor()

    cursor.execute('''
        SELECT name FROM sqlite_master WHERE type='table' AND name='users'
    ''')
    table_exists = cursor.fetchone()

    if not table_exists:
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                screenWidth INTEGER,
                screenHeight INTEGER,
                browserType TEXT,
                canvasFingerprint TEXT,
                ipAddress TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
    
    conn.close()

@app.route('/collect', methods=['POST'])
def collect():
    data = request.get_json()

    screenWidth = data['screenWidth']
    screenHeight = data['screenHeight']
    browserType = data['browserType']
    canvasFingerprint = data['canvasFingerprint']
    ipAddress = data['ipAddress']

    conn = sqlite3.connect('your_database.db')  # 替换为实际的数据库连接
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO users (screenWidth, screenHeight, browserType, canvasFingerprint, ipAddress)
        VALUES (?, ?, ?, ?, ?)
    ''', (screenWidth, screenHeight, browserType, canvasFingerprint, ipAddress))

    conn.commit()
    conn.close()

    return '数据接收成功并已存储'

if __name__ == '__main__':
    create_user_table()
    app.run()
