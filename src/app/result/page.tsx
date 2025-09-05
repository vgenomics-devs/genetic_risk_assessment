"use client";
import React from "react";
import ChatBot from '@/components/ChatBot/index';
import { Suspense } from "react";
export default function Result() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatBot />
        </Suspense>
    );
}
