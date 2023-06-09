// 创建一个隐藏的Canvas元素
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// 设置Canvas的尺寸
canvas.width = 200;
canvas.height = 50;

// 使用不同的属性和文本在Canvas上绘制
ctx.textBaseline = "alphabetic";
ctx.fillStyle = "#f60";
ctx.fillRect(0, 0, 140, 40);
ctx.fillStyle = "#069";
ctx.font = "16px 'Arial'";
ctx.fillText("Browser Canvas Fingerprint", 10, 25);

// 获取Canvas的数据URL
var dataURL = canvas.toDataURL();

// 打印Canvas指纹
console.log("Canvas指纹: " + dataURL);
var configuration = {
  iceServers: [
    // Google STUN 服务器
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Mozilla STUN 服务器
    { urls: "stun:stun.services.mozilla.com" },
    // 其他公共 STUN 服务器
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun01.sipphone.com" },
    { urls: "stun:stun.ekiga.net" },
    { urls: "stun:stun.fwdnet.net" },
    { urls: "stun:stun.ideasip.com" },
    { urls: "stun:stun.iptel.org" },
    { urls: "stun:stun.rixtelecom.se" },
    { urls: "stun:stun.schlund.de" },
    { urls: "stun:stunserver.org" },
    { urls: "stun:stun.softjoys.com" },
    { urls: "stun:stun.voiparound.com" },
    { urls: "stun:stun.voipbuster.com" },
    { urls: "stun:stun.voipstunt.com" },
    { urls: "stun:stun.voxgratia.org" },
    { urls: "stun:stun.xten.com" },
    // Twilio STUN 服务器
    { urls: "stun:global.stun.twilio.com:3478?transport=udp" }
  ]
};

// 创建 RTCPeerConnection 对象
var peerConnection = new RTCPeerConnection(configuration);

// 监听 onicecandidate 事件以获取 IceCandidate 并提取 IP 地址
peerConnection.onicecandidate = function(event) {
  if (event.candidate) {
    var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
    var ipAddr = ipRegex.exec(event.candidate.candidate)[1];
    console.log("IP地址：" + ipAddr);
  }
};

// 创建 Offer 并设置本地描述
peerConnection.createOffer(function(offer) {
  peerConnection.setLocalDescription(offer);
}, function(error) {
  console.log(error);
});
    // 将Canvas指纹和IP地址合并为一个对象
    var data = {
      canvasFingerprint: dataURL,
      ipAddress: ipAddr
    };

    // 发送POST请求到Flask后端
    fetch('/process_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      // 处理后端返回的结果
    })
    .catch(error => {
      console.log(error);
      // 处理请求错误
    });
  }
};

peerConnection.createOffer(function(offer) {
  peerConnection.setLocalDescription(offer);
}, function(error) {
  console.log(error);
});
