from flask import Flask, request, jsonify

app = Flask(__name__)
app.secret_key = 'your_secret_key_24_characters'
@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.json
    # 处理接收到的数据
    print("Canvas指纹:", data['canvasFingerprint'])
    print("IP地址:", data['ipAddress'])
    
    # 返回响应
    response = {
        'message': 'Data received successfully'
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run()
