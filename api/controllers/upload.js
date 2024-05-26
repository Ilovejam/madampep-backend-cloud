const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
let model;
const modelPath = process.env.TENSORFLOW_MODEL_PATH;

async function loadModel() {
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully");
}

loadModel();

router.post('/', upload.array('images', 3), async (req, res) => {
    try {
        const files = req.files;
        let predictions = [];

        for (let file of files) {
            const imgBuffer = fs.readFileSync(file.path);
            let imgTensor = tf.node.decodeImage(new Uint8Array(imgBuffer), 3);
            imgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);

            imgTensor = imgTensor.expandDims(0).toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));

            const prediction = model.predict(imgTensor);
            const predictionData = prediction.dataSync();

            const isCoffeeCup = predictionData[0] > 0.8; // Adjust this threshold as necessary
            predictions.push({ file: file.originalname, isCoffeeCup });
        }

        res.json({ predictions });
    } catch (error) {
        console.error('Error during image processing:', error);
        res.status(500).json({ error: 'An error occurred while processing images' });
    } finally {
        req.files.forEach(file => fs.unlinkSync(file.path));
    }
});

module.exports = router;
