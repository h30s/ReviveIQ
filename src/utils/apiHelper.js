import axios from 'axios';

export async function apiCallWithRetry(url, options, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios(url, options);
            return response;
        } catch (error) {
            lastError = error;

            // Rate limit - wait and retry
            if (error.response?.status === 429) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                console.warn(`  ⏳ Rate limited, waiting ${waitTime / 1000}s...`);
                await sleep(waitTime);
                continue;
            }

            // Timeout - retry
            if (error.code === 'ECONNABORTED' && attempt < maxRetries) {
                console.warn(`  ⏳ Timeout, retrying (${attempt}/${maxRetries})...`);
                await sleep(1000 * attempt);
                continue;
            }

            // Other errors - don't retry
            throw error;
        }
    }

    throw lastError;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
