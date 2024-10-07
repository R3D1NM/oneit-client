import axios from 'axios';

const SLACK_WEBHOOK_URL = import.meta.env.VITE_SLACK_LOG_WEBHOOK_URL;

interface SlackErrorProps {
    message: string;
    errorPoint: string;
}

export const sendInfoToSlack = async (message: string) => {
    const now = new Date();
    const text = `[INFO] ${message} \n when: ${now.toTimeString()} \n from: ${import.meta.env.VITE_CURRENT_DOMAIN}`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    try {
        await axios({
            method: 'post',

            url: 'https://hooks.slack.com/services/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',

            data: JSON.stringify({text}),
            headers,
        });
    } catch (slackError) {
        console.error('[SLACK]', slackError);
    }
};

export const sendErrorToSlack = async ({
    message,
    errorPoint,
}: SlackErrorProps) => {
    const now = new Date();
    const text = `[ERROR] ${errorPoint} \n when: ${now.toTimeString()} \n from: ${import.meta.env.VITE_CURRENT_DOMAIN} \n\n ${message}`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    try {
        await axios({
            method: 'post',
            url: SLACK_WEBHOOK_URL,
            data: JSON.stringify({text}),
            headers,
        });
    } catch (slackError) {
        console.error('[SLACK]', slackError);
    }
};
