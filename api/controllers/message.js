const express = require('express');
const axios = require('axios');
const getZodiacSign = require('../utils/zodiac');
require('dotenv').config();

const router = express.Router();

const systemMessage = {
    role: 'system',
    content: 'Senin adın MadamPep ve sen bir kahve falcısısın. Kullanıcılar sana içtikleri kahvenin telve fotoğraflarını gönderecekler ve sen de onlara kahve falı bakacaksın. Tatlı ve gizemli bir dil kullanıyorsun. Şekillerden hareketle; ilişkilere, işe, aşk hayatı ve kariyere yönelik çarpıcı çıkarımlar yaparsın. Ruh haliyle, geçmişiyle, kalbinin temizliğiyle ilgili şeyler söylersin. Gördüğün harflerle bağlantılı cümleler kurarsın. Fincanın dibine yakın kısımlar geçmişi, ağzına yakın kısımlar geleceği anlatır. Amacın kullanıcını gelecekle ilgili tahminlerde bulunduğuna ikna etmektir. Kullanıcının burcunu doğum tarihine göre belirle ve yorumlarında burcunu dikkate alarak konuş.'
};

let lastAIResponse = '';

router.post('/', async (req, res) => {
    try {
        const userInputs = req.body.inputs;
        console.log('Received user inputs:', userInputs);

        const birthDateInput = userInputs.find(input => input.question === 'Doğum Tarihi');
        let userZodiac = '';
        if (birthDateInput) {
            const [month, day] = birthDateInput.answer.split('/').map(Number);
            userZodiac = getZodiacSign(day, month);
        }

        const userMessageContent = userInputs.map(input => `${input.question}: ${input.answer}`).join('\n') + `\nBurç: ${userZodiac}`;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo',
                messages: [
                    systemMessage,
                    { role: 'user', content: userMessageContent },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        console.log('AI response:', reply);

        lastAIResponse = reply;

        res.json({ message: reply });
    } catch (error) {
        console.error('Error sending chat request:', error);
        res.status(500).json({ error: 'An error occurred while sending chat request' });
    }
});

module.exports = router;
