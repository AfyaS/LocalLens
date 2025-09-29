const { app } = require('@azure/functions');

app.http('translateText', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'translate',
    handler: async (request, context) => {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400'
                },
                body: ''
            };
        }

        try {
            const { text, targetLanguage } = await request.json();
            
            if (!text || !targetLanguage) {
                return {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Text and targetLanguage are required' })
                };
            }

            // Azure Translator configuration
            const subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
            const endpoint = 'https://api.cognitive.microsofttranslator.com';
            const location = 'eastus'; // Your Azure region
            
            if (!subscriptionKey) {
                return {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Translation service not configured' })
                };
            }

            // Prepare translation request
            const translateUrl = `${endpoint}/translate?api-version=3.0&from=en&to=${targetLanguage}`;
            
            const response = await fetch(translateUrl, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Ocp-Apim-Subscription-Region': location,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{ text: text }])
            });

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const result = await response.json();
            const translatedText = result[0]?.translations[0]?.text || text;

            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    originalText: text,
                    translatedText: translatedText,
                    targetLanguage: targetLanguage
                })
            };

        } catch (error) {
            context.log.error('Translation error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Translation failed',
                    details: error.message 
                })
            };
        }
    }
});
