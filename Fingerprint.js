<script> src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3.9.1/dist/fingerprint.min.js"></script>
<script>
const fpPromise = FingerprintJS.load();
const fp = await fpPromise;
const result = await fp.get();
console.log(result.visitorId);
</script>
<script>
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/save-fingerprint');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({
  fingerprint: result.visitorId,
  ip: myIp
}));
</script>

