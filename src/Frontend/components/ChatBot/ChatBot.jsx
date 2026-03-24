import { useState } from "react";
import intents from "./intents";
import "./ChatBot.css";

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm SmartShop Assistant 🛍️", sender: "bot" }
    ]);
    const [input, setInput] = useState("");

    const getBotResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();

        for (let intent of intents) {
            for (let keyword of intent.keywords) {
                if (msg.includes(keyword)) {
                    return intent.response;
                }
            }
        }

        return "Sorry, I didn’t understand. Try asking about products, orders or delivery.";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: "user" };
        const botMsg = { text: getBotResponse(input), sender: "bot" };

        setMessages([...messages, userMsg, botMsg]);
        setInput("");
    };

    return (
        <>
            <div className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
                🛒
            </div>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chat-header">SmartShop Assistant</div>

                    <div className="chat-window">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;