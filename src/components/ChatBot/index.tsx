"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { message, Spin } from 'antd';
import ChatPanel from './chatPanel';
import ResultPanel from './result';
import styles from './chatbot.module.css';

interface ChatMessage {
    msg: string;
    sent: boolean;
}

interface ResultData {
    summary?: string;
    riskLevel?: string;
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 123,
    flexDirection: 'column',
    fontWeight: 600,
    fontSize: 20,
    pointerEvents: 'all',
};

function ChatBot() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get query params via useSearchParams
    const user_id = searchParams.get('user_id') || '';
    const conversation_id = searchParams.get('conversation_id') || '';
    const question = searchParams.get('question') || '';
    const choicesRaw = searchParams.get('choices') || '';

    // Memoize parsed choices to avoid re-parsing and infinite loops
    const initialChoices = useMemo(() => {
        try {
            const parsed = choicesRaw ? JSON.parse(choicesRaw) : [];
            if (Array.isArray(parsed)) {
                return parsed;
            }
            return [];
        } catch {
            return [];
        }
    }, [choicesRaw]);

    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [choicesState, setChoices] = useState<string[]>(initialChoices.length ? initialChoices : ['Fever', 'Cough', 'Other']);
    const [isChatFinished, setIsChatFinished] = useState<boolean>(false);
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [showAssessmentCompleted, setShowAssessmentCompleted] = useState<boolean>(false);
    const [isCompletedLoading, setIsCompletedLoading] = useState<boolean>(false);
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
    const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

    const scrollBottom = useRef<HTMLDivElement | null>(null);
    const assessmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setChat(
            question && typeof question === 'string'
                ? [{ msg: question, sent: false }]
                : [{ msg: 'Welcome! What is your main concern today?', sent: false }]
        );

        setChoices(initialChoices.length ? initialChoices : ['Fever', 'Cough', 'Other']);
        setIsChatFinished(false);
        setResultData(null);
        setShowAssessmentCompleted(false);
        setIsCompletedLoading(false);
        setIsSendingMessage(false);
        setShowSubmitButton(false);
    }, [question, initialChoices]);

    // Scroll to bottom on chat update
    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollBottom.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        return () => clearTimeout(timeout);
    }, [chat]);

    useEffect(() => {
        return () => {
            if (assessmentTimeoutRef.current) {
                clearTimeout(assessmentTimeoutRef.current);
            }
        };
    }, []);

    const sendMessage = async (userMessage: string) => {
        setIsSendingMessage(true);
        setChat((prev) => [...prev, { msg: userMessage, sent: true }]);

        if (assessmentTimeoutRef.current) {
            clearTimeout(assessmentTimeoutRef.current);
            assessmentTimeoutRef.current = null;
        }

        try {
            const response = await fetch('http://35.200.230.149:3000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversation_id,
                    message: userMessage,
                    user_id,
                }),
            });

            const data = await response.json();

            if (data.response) {
                setChat((prev) => [...prev, { msg: data.response, sent: false }]);
            }

            if (data.Summary || data['Risk Level']) {
                setResultData({
                    summary: data.Summary,
                    riskLevel: data['Risk Level'],
                });
            }

            if (data.completed === true) {
                setChoices([]);
                setShowSubmitButton(true);
            } else {
                setShowAssessmentCompleted(false);
                setIsCompletedLoading(false);
                setIsChatFinished(false);
                setShowSubmitButton(false);

                if (Array.isArray(data.choices) && data.choices.length > 0) {
                    const filteredChoices = data.choices.filter(
                        (choice: string) => choice && choice.trim() !== ''
                    );
                    setChoices(filteredChoices);
                } else {
                    setChoices([]);
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Something went wrong.');
            setShowAssessmentCompleted(false);
            setIsCompletedLoading(false);
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSubmitAssessment = () => {
        setShowSubmitButton(false);
        setIsCompletedLoading(true);
        setShowAssessmentCompleted(true);

        assessmentTimeoutRef.current = setTimeout(() => {
            setIsCompletedLoading(false);
            setShowAssessmentCompleted(false);
            setIsChatFinished(true);
            assessmentTimeoutRef.current = null;
        }, 3000);
    };

    return (
        <>
            {(isCompletedLoading || showAssessmentCompleted) && (
                <div style={overlayStyle}>
                    <Spin tip="Processing..." size="large" />
                    <div style={{ marginTop: 16, fontWeight: 600, fontSize: 20 }}>Generating Result</div>
                </div>
            )}

            <div className={styles['chatbot-wrapper']}>
                <ChatPanel
                    chat={chat}
                    choices={choicesState}
                    scrollBottom={scrollBottom}
                    sendMessage={sendMessage}
                    isSendingMessage={isSendingMessage}
                    showSubmitButton={showSubmitButton}
                    onSubmit={handleSubmitAssessment}
                    setChoices={setChoices}
                />
                {isChatFinished && <ResultPanel resultData={resultData} navigate={router.push} />}
            </div>
        </>
    );
}

export default ChatBot;
