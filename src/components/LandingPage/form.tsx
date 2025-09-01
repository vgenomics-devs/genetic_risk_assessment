'use client';

import React, { useState } from 'react';
import { Form, DatePicker, Button, message, Typography, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
// import './index.css';

const { Title } = Typography;
const API_CHATBOT_BASE_URL = 'http://35.200.230.149:3000';

interface StartAssessmentResponse {
    conversation_id: string;
    question: string;
    choices: string[];
}

const StartAssessmentForm: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [dob, setDob] = useState<Dayjs | null>(null);

    const startAssessment = async (dob: Dayjs, user_id: string): Promise<void> => {
        const ageInMonths = dayjs().diff(dob, 'month');

        try {
            const res = await fetch(`${API_CHATBOT_BASE_URL}/start_assessment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id,
                    child_age_months: ageInMonths,
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: StartAssessmentResponse = await res.json();

            const query = new URLSearchParams({
                user_id,
                dob: dob.format('YYYY-MM-DD'),
                conversation_id: data.conversation_id,
                question: data.question,
                choices: JSON.stringify(data.choices),
            });

            router.push(`/result?${query.toString()}`);
        } catch (err) {
            console.error('Error starting assessment:', err);
            message.error('Failed to start assessment. Please try again.');
        }
    };

    const onFinish = (values: { dob: Dayjs }) => {
        const dob = values.dob;
        const userId = uuidv4();
        startAssessment(dob, userId);
    };

    const validate = {
        dateOfBirth: [
            { required: true, message: 'Date of birth is required' },
            {
                validator: (_: unknown, value: Dayjs) => {
                    if (!value) return Promise.resolve();
                    const today = dayjs().endOf('day');
                    if (value.isAfter(today)) {
                        return Promise.reject(new Error('Date of birth cannot be in the future'));
                    }
                    return Promise.resolve();
                },
            },
        ],
    };

    const isDobInvalid = dob ? dob.isAfter(dayjs().endOf('day')) : false;

    const styles: Record<string, React.CSSProperties> = {
        container: {
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        card: {
            padding: '0px',
            border: 'none',
        },
        button: {
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 600,
            height: '40px',
        },
    };

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
                    {/* Optional title */}
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ display: 'flex', gap: '36px' }}
                >
                    <Form.Item name="dob" label="" rules={validate.dateOfBirth}>
                        <DatePicker
                            style={{ width: '200px', border: '2px solid black', height: '40px' }}
                            format="YYYY-MM-DD"
                            placeholder="Select DOB"
                            onChange={(value) => setDob(value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={styles.button}
                            disabled={!dob || isDobInvalid}
                        >
                            Start
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default StartAssessmentForm;
