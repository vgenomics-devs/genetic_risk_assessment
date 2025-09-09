'use client';

import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, message, Typography, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const API_CHATBOT_BASE_URL = 'http://35.200.230.149:3000';

const StartAssessmentForm: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [today, setToday] = useState<Dayjs | null>(null);

    useEffect(() => {
        setToday(dayjs().endOf('day'));
    }, []);

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

            const data = await res.json();

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

    // Only validate when `today` is set (client side)
    const validate = {
        dateOfBirth: [
            { required: true, message: 'Date of birth is required' },
            {
                validator: (_: unknown, value: Dayjs) => {
                    if (!value || !today) return Promise.resolve();
                    if (value.isAfter(today)) {
                        return Promise.reject(new Error('Date of birth cannot be in the future'));
                    }
                    return Promise.resolve();
                },
            },
        ],
    };

    const dob = Form.useWatch('dob', form);
    const isDobInvalid = dob && today ? dob.isAfter(today) : false;

    const styles: Record<string, React.CSSProperties> = {
        container: {
            maxHeight: 130,
            minWidth: 320,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            // padding: '20px 0',
            boxSizing: 'border-box',
            marginBottom: 0,

        },
        card: {
            padding: '16px 24px',
            border: 'none',
            width: 320,
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 600,
            height: 40,
            marginBottom: 0,
        },
    };

    if (!today) {
        // Return a div with same size so no jump happens
        return <div style={{ minHeight: 200, minWidth: 320 }} />;
    }

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <Title level={4} style={{ textAlign: 'center' }}>
                    {/* Optional title */}
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ display: 'flex', gap: 16, textAlign: 'center', alignItems: 'start', }}
                >
                    <Form.Item name="dob" label="" rules={validate.dateOfBirth}>
                        <DatePicker
                            style={{ width: 200, border: '2px solid black', height: 40 }}
                            format="YYYY-MM-DD"
                            placeholder="Select DOB"
                            disabledDate={(current) => current && current > today}
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
