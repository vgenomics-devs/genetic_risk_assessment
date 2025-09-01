import React, { RefObject } from "react";

interface ChatMessage {
    msg: string;
    sent: boolean;
}

interface ChatPanelProps {
    chat: ChatMessage[];
    choices: string[];
    isSendingMessage: boolean;
    scrollBottom: React.RefObject<HTMLDivElement | null>;
    sendMessage: (choice: string) => void;
    showSubmitButton: boolean;
    onSubmit: () => void;
    setChoices?: (choices: string[]) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    chat,
    choices,
    isSendingMessage,
    scrollBottom,
    sendMessage,
    showSubmitButton,
    onSubmit,
    setChoices,
}) => {
    const styles: { [key: string]: React.CSSProperties } = {
        bubbleUser: {
            backgroundColor: "#DADADA",
            color: "black",
            padding: "10px 16px",
            borderRadius: "18px 18px 0 18px",
            width: "fit-content",
            marginLeft: "auto",
            marginBottom: 12,
            wordWrap: "break-word",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
        },
        bubbleBot: {
            backgroundColor: "#e5e5ea",
            color: "#111",
            padding: "10px 16px",
            borderRadius: "18px 18px 18px 0",
            maxWidth: "70%",
            marginBottom: 12,
            wordWrap: "break-word",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
        },
        choicesArea: {
            marginTop: "auto",
            paddingTop: 12,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 12,
            fontFamily: "Geist, Verdana, sans-serif",
        },
        button: {
            backgroundColor: "black",
            border: "none",
            color: "white",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "background 0.2s",
            fontFamily: "Geist, Verdana, sans-serif",
        },
        buttonDisabled: {
            display: "none",
        },
    };

    const handleChoiceClick = (choice: string) => {
        if (setChoices) setChoices([]); // hide immediately
        sendMessage(choice);
    };

    return (
        <div
            style={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#DFDAE4",
                padding: 16,
                overflowY: "auto",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 16 }}>ChatBot</h2>

            {chat.map((msg, idx) => (
                <div key={idx} style={msg.sent ? styles.bubbleUser : styles.bubbleBot}>
                    {msg.msg}
                </div>
            ))}

            <div ref={scrollBottom} />

            {(showSubmitButton || (choices && choices.length > 0)) && (
                <div style={styles.choicesArea}>
                    {showSubmitButton && (
                        <button
                            style={{
                                ...styles.button,
                                ...(isSendingMessage ? styles.buttonDisabled : {}),
                            }}
                            onClick={onSubmit}
                            disabled={isSendingMessage}
                        >
                            Submit
                        </button>
                    )}

                    {choices &&
                        choices.length > 0 &&
                        choices.map((choice, idx) => (
                            <button
                                key={idx}
                                style={{
                                    ...styles.button,
                                    ...(isSendingMessage ? styles.buttonDisabled : {}),
                                }}
                                onClick={() => handleChoiceClick(choice)}
                                disabled={isSendingMessage}
                            >
                                {choice}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ChatPanel;
