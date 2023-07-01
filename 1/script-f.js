function collectUserData() {
 // 获取屏幕大小
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
 
  // 获取浏览器类型
  var browserType = navigator.userAgent;

  // 创建一个隐藏的canvas元素
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  // 设置canvas尺寸与屏幕大小一致
  canvas.width = screenWidth;
  canvas.height = screenHeight; 
  
  // 绘制一个文本，用于生成canvas指纹
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("Browser", 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText("Canvas", 4, 17);

  // 获取canvas指纹的MD5值
  var canvasFingerprint = md5(canvas.toDataURL());

  // 创建一个对象，包含收集到的用户数据
  var userData = {
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    browserType: browserType,
    canvasFingerprint: canvasFingerprint
  };
  
  // 获取真实IP地址
  getRealIPAddress()
    .then(function(ipAddress) {
      userData.ipAddress = ipAddress;

      // 发送数据到后端
      sendData(userData);
    })
    .catch(function(error) {
      console.error('Failed to get real IP address:', error);
      // 处理获取IP地址失败的情况
    });
}

function getRealIPAddress() {
  return new Promise(function(resolve, reject) {
    var configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.voiparound.com:3478' },
        { urls: 'stun:stun.voipbuster.com:3478' },
        { urls: 'stun:stun.voipstunt.com:3478' },
        { urls: 'stun:stun.voxgratia.org:3478' },
        { urls: 'stun:stun.ekiga.net:3478' },
        { urls: 'stun:stun.ideasip.com:3478' },
        { urls: 'stun:stun.iptel.org:3478' },
        { urls: 'stun:stun.schlund.de:3478' },
      ]
    };
    var peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        var ipAddress = event.candidate.address || event.candidate.ip;
        resolve(ipAddress);
        peerConnection.close();
      }
    };

    peerConnection.createDataChannel('');
    peerConnection.createOffer()
      .then(function(offer) {
        return peerConnection.setLocalDescription(offer);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function sendData(userData) {
  var jsonData = JSON.stringify(userData);
  // 存储数据到Cookie
  document.cookie = "userData=" + encodeURIComponent(jsonData) + "; path=/";
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/collect', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Data sent successfully');
    } else {
      console.error('Failed to send data. Status:', xhr.status);
      // 处理发送数据失败的情况
      // 重试发送
      setTimeout(function() {
        sendData(userData);
      }, 5000); // 等待5秒后重试
    }
  };

  xhr.onerror = function() {
    console.error('Failed to send data');
    // 处理发送数据失败的情况
    // 重试发送
    setTimeout(function() {
      sendData(userData);
    }, 5000); // 等待5秒后重试
  };
  
  xhr.send(jsonData);
}
