//import React, { useState, useRef, useEffect } from 'react';
//import { Card, Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';
//import useGroqAI from '../hooks/useGroqAI';
//
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
//
//function Chatbot() {
//    const [messages, setMessages] = useState([
//        {
//            role: 'assistant',
//            content: 'Hello! I\'m your RentEase AI assistant. I can help you:\n- Find products\n- Search items near you\n- Answer questions about the app\n\nHow can I help you today?'
//        }
//    ]);
//    const [input, setInput] = useState('');
//    const [loading, setLoading] = useState(false);
//    const messagesEndRef = useRef(null);
//    const { smartSearch } = useGroqAI();
//
//    const scrollToBottom = () => {
//        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//    };
//
//    useEffect(() => {
//        scrollToBottom();
//    }, [messages]);
//
//    const handleSend = async (e) => {
//        e.preventDefault();
//
//        // Handle empty input
//        if (!input.trim()) {
//            setMessages(prev => [...prev, {
//                role: 'assistant',
//                content: "It looks like you didn't type anything. What product are you looking for?"
//            }]);
//            return;
//        }
//
//        if (loading) return;
//
//        const userMessage = input.trim();
//        setInput('');
//        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
//        setLoading(true);
//
//        try {
//            // Check if it's a search query
//            const lowerInput = userMessage.toLowerCase();
//            if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('near') || lowerInput.includes('product')) {
//                // Use smart search
//                try {
//                    const searchResult = await smartSearch(userMessage);
//
//                    if (searchResult && searchResult.searchQuery) {
//                        // Extract keywords/location etc.
//                        const { keywords, location, category, priceMin, priceMax } = searchResult.searchQuery;
//
//                        // Call backend API
//                        const token = localStorage.getItem('token');
//                        const queryParams = new URLSearchParams();
//                        if (keywords) queryParams.append('keywords', keywords);
//                        if (location) queryParams.append('location', location);
//                        if (category) queryParams.append('category', category);
//                        if (priceMin) queryParams.append('priceMin', priceMin);
//                        if (priceMax) queryParams.append('priceMax', priceMax);
//
//                        let productResponse;
//                        try {
//                            productResponse = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`, {
//                                headers: { 'Authorization': `Bearer ${token}` }
//                            });
//                        } catch (err) {
//                            console.error('Error fetching products:', err);
//                            setMessages(prev => [...prev, { role: 'assistant', content: "Couldn't reach the product service. Try again later." }]);
//                            setLoading(false);
//                            return;
//                        }
//
//                        if (productResponse.ok) {
//                            const products = await productResponse.json();
//                            if (products && products.length > 0) {
//                                setMessages(prev => [...prev, {
//                                    role: 'assistant',
//                                    content: `I found ${products.length} product(s):\n` + products.map(p => `- ${p.name} (${p.category}) - ₹${p.price}`).join('\n')
//                                }]);
//                            } else {
//                                setMessages(prev => [...prev, { role: 'assistant', content: "No products found matching your search." }]);
//                            }
//                        } else {
//                            setMessages(prev => [...prev, { role: 'assistant', content: "Error fetching products from server." }]);
//                        }
//                    } else {
//                        setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't understand your search query. Try again." }]);
//                    }
//
//            } else {
//                // Regular chat using Groq API
//                const token = localStorage.getItem('token');
//
//                if (!token) {
//                    setMessages(prev => [...prev, {
//                        role: 'assistant',
//                        content: "I need you to be logged in to chat with me. Please log in and try again!"
//                    }]);
//                    setLoading(false);
//                    return;
//                }
//
//                let response;
//                try {
//                    response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
//                        method: 'POST',
//                        headers: {
//                            'Content-Type': 'application/json',
//                            'Authorization': `Bearer ${token}`,
//                        },
//                        body: JSON.stringify({
//                            messages: [
//                                {
//                                    role: 'system',
//                                    content: 'You are a helpful assistant for RentEase, a peer-to-peer rental marketplace. Help users find products, understand how to use the app, and answer questions about renting items.'
//                                },
//                                ...messages.map(m => ({ role: m.role, content: m.content })),
//                                { role: 'user', content: userMessage }
//                            ]
//                        }),
//                    });
//                } catch (fetchErr) {
//                    console.error('Network error:', fetchErr);
//                    setMessages(prev => [...prev, {
//                        role: 'assistant',
//                        content: "I'm having some trouble reaching the server. Please try again in a moment."
//                    }]);
//                    setLoading(false);
//                    return;
//                }
//
//                if (response.ok) {
//                    try {
//                        const data = await response.json();
//
//                        // Check for standardized error format
//                        if (data.userMessage) {
//                            // Error response with userMessage
//                            const debugId = data.debugId || 'N/A';
//                            console.error('AI error [debugId: ' + debugId + ']:', data);
//
//                            let errorMessage = data.userMessage;
//                            if (data.suggestion) {
//                                errorMessage += ' ' + data.suggestion;
//                            }
//
//                            setMessages(prev => [...prev, {
//                                role: 'assistant',
//                                content: errorMessage
//                            }]);
//                        } else if (data.response) {
//                            // Success response
//                            const aiResponse = data.response;
//
//                            // Check if response contains error messages
//                            if (!aiResponse || aiResponse.includes('Error:') || aiResponse.includes('Error calling') || aiResponse.includes('Error processing')) {
//                                console.error('AI returned error response:', aiResponse);
//                                setMessages(prev => [...prev, {
//                                    role: 'assistant',
//                                    content: "I'm having some trouble processing that right now. Could you try rephrasing your question? I'm here to help you find products or answer questions about RentEase!"
//                                }]);
//                            } else {
//                                setMessages(prev => [...prev, { role: 'assistant', content: aiResponse || "I'm here to help! How can I assist you today?" }]);
//                            }
//                        } else {
//                            // Empty or unexpected response
//                            setMessages(prev => [...prev, {
//                                role: 'assistant',
//                                content: "I couldn't find anything — would you like to try a different keyword?"
//                            }]);
//                        }
//                    } catch (parseErr) {
//                        console.error('Response parsing error:', parseErr);
//                        setMessages(prev => [...prev, {
//                            role: 'assistant',
//                            content: "I received an unexpected response. Could you try asking your question differently?"
//                        }]);
//                    }
//                } else {
//                    // Handle different HTTP status codes
//                    const status = response.status;
//                    let errorData = null;
//
//                    try {
//                        errorData = await response.json();
//                    } catch (e) {
//                        // Not JSON response
//                    }
//
//                    const userMessage = errorData?.userMessage || "Something went wrong. Please refresh or try again.";
//                    const debugId = errorData?.debugId || 'N/A';
//
//                    console.error('API error status:', status, '[debugId: ' + debugId + ']');
//
//                    if (status === 401) {
//                        setMessages(prev => [...prev, {
//                            role: 'assistant',
//                            content: "It looks like your session expired. Please log in again and try chatting with me!"
//                        }]);
//                    } else {
//                        setMessages(prev => [...prev, {
//                            role: 'assistant',
//                            content: userMessage
//                        }]);
//                    }
//                }
//            }
//        } catch (err) {
//            // Catch any unexpected errors
//            console.error('Unexpected chatbot error:', err);
//            setMessages(prev => [...prev, {
//                role: 'assistant',
//                content: "I'm having some trouble right now. Please try again in a moment, or use the search feature to find products directly!"
//            }]);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    return (
//        <Card className="shadow-lg border-0" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
//            <Card.Header className="bg-primary text-white">
//                <h5 className="mb-0">🤖 RentEase AI Assistant</h5>
//            </Card.Header>
//            <Card.Body style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
//                <div className="d-flex flex-column gap-2">
//                    {messages.map((msg, idx) => (
//                        <div
//                            key={idx}
//                            className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
//                        >
//                            <div
//                                className={`p-3 rounded ${
//                                    msg.role === 'user'
//                                        ? 'bg-primary text-white'
//                                        : 'bg-light text-dark'
//                                }`}
//                                style={{ maxWidth: '75%', whiteSpace: 'pre-wrap' }}
//                            >
//                                {msg.content}
//                            </div>
//                        </div>
//                    ))}
//                    {loading && (
//                        <div className="d-flex justify-content-start">
//                            <div className="bg-light p-3 rounded">
//                                <Spinner animation="border" size="sm" className="me-2" />
//                                Thinking...
//                            </div>
//                        </div>
//                    )}
//                    <div ref={messagesEndRef} />
//                </div>
//            </Card.Body>
//            <Card.Footer>
//                <Form onSubmit={handleSend}>
//                    <InputGroup>
//                        <Form.Control
//                            type="text"
//                            placeholder="Ask me anything... (e.g., 'Find me best products', 'Search items near me')"
//                            value={input}
//                            onChange={(e) => setInput(e.target.value)}
//                            disabled={loading}
//                        />
//                        <Button
//                            variant="primary"
//                            type="submit"
//                            disabled={loading || !input.trim()}
//                        >
//                            Send
//                        </Button>
//                    </InputGroup>
//                </Form>
//            </Card.Footer>
//        </Card>
//    );
//}
//
//export default Chatbot;
//
//
import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import useGroqAI from '../hooks/useGroqAI';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function Chatbot() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hello! I'm your RentEase AI assistant. I can help you:
- Find products
- Search items near you
- Answer questions about the app

How can I help you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { smartSearch } = useGroqAI();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "It looks like you didn't type anything. What product are you looking for?"
            }]);
            return;
        }

        if (loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const lowerInput = userMessage.toLowerCase();

            // If it's a search query
            if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('near') || lowerInput.includes('product')) {
                try {
                    const searchResult = await smartSearch(userMessage);

                    if (searchResult?.searchQuery) {
                        const { keywords, location, category, priceMin, priceMax } = searchResult.searchQuery;
                        const token = localStorage.getItem('token');
                        const queryParams = new URLSearchParams();
                        if (keywords) queryParams.append('keywords', keywords);
                        if (location) queryParams.append('location', location);
                        if (category) queryParams.append('category', category);
                        if (priceMin) queryParams.append('priceMin', priceMin);
                        if (priceMax) queryParams.append('priceMax', priceMax);

                        const productResponse = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (productResponse.ok) {
                            const products = await productResponse.json();
                            if (products?.length > 0) {
                                setMessages(prev => [...prev, {
                                    role: 'assistant',
                                    content: `I found ${products.length} product(s):\n` +
                                        products.map(p => `- ${p.name} (${p.category}) - ₹${p.price}`).join('\n')
                                }]);
                            } else {
                                setMessages(prev => [...prev, { role: 'assistant', content: "No products found matching your search." }]);
                            }
                        } else {
                            setMessages(prev => [...prev, { role: 'assistant', content: "Error fetching products from server." }]);
                        }
                    } else {
                        setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't understand your search query. Try again." }]);
                    }
                } catch (err) {
                    console.error('Smart search error:', err);
                    setMessages(prev => [...prev, { role: 'assistant', content: "Unable to process search. Try using the search bar directly." }]);
                }
            } else {
                // Regular chat using Groq AI
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "Please log in to chat with me." }]);
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant for RentEase, a peer-to-peer rental marketplace.' },
                                ...messages.map(m => ({ role: m.role, content: m.content })),
                                { role: 'user', content: userMessage }
                            ]
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const aiResponse = data.response || data.userMessage || "I couldn't find an answer. Try asking differently.";
                        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
                    } else if (response.status === 401) {
                        setMessages(prev => [...prev, { role: 'assistant', content: "Session expired. Please log in again." }]);
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        setMessages(prev => [...prev, { role: 'assistant', content: errorData.userMessage || "Something went wrong. Try again." }]);
                    }
                } catch (chatErr) {
                    console.error('Chat API error:', chatErr);
                    setMessages(prev => [...prev, { role: 'assistant', content: "Unable to contact server. Try again later." }]);
                }
            }
        } catch (err) {
            console.error('Unexpected chatbot error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Card className="shadow-lg border-0" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">🤖 RentEase AI Assistant</h5>
            </Card.Header>
            <Card.Body style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                <div className="d-flex flex-column gap-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%', whiteSpace: 'pre-wrap' }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="d-flex justify-content-start">
                            <div className="bg-light p-3 rounded">
                                <Spinner animation="border" size="sm" className="me-2" />
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </Card.Body>
            <Card.Footer>
                <Form onSubmit={handleSend}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Ask me anything... (e.g., 'Find products', 'Search items near me')"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button variant="primary" type="submit" disabled={loading || !input.trim()}>Send</Button>
                    </InputGroup>
                </Form>
            </Card.Footer>
        </Card>
    );
}

export default Chatbot;
