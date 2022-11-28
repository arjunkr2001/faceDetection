
const video = document.getElementById('video')
console.log(window.getComputedStyle(video, null).getPropertyValue('width'))

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

async function startVideo() {
  let stream = await navigator.mediaDevices.getUserMedia({video:true , audio:false})
  video.srcObject = stream
}

if(window.innerWidth > window.innerHeight)
  video.width = window.innerWidth
else
  video.height = window.innerHeight

video.addEventListener('play', () => {
  const displaySize = { width: Number(window.getComputedStyle(video, null).getPropertyValue('width').slice(0,-2)), height: Number(window.getComputedStyle(video, null).getPropertyValue('height').slice(0,-2)) }
  
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  //const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})