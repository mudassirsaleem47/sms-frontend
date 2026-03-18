import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

export default function AiChatbot() {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your SMS Assistant. How can I help you today?' }
    ]);
    const quickPrompts = [
        'Show today attendance summary',
        'Pending fee collection list',
        'Draft a message for parents'
    ];
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const schoolId = currentUser?.school?._id || currentUser?._id;

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, loading, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        const msg = query.trim();
        if (!msg || loading) return;

        setQuery('');
        const newUserMsg = { role: 'user', content: msg };
        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            const history = messages.slice(-6).map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await axios.post(`${API_URL}/AiChat/Groq`, {
                query: msg,
                schoolId,
                history
            });

            if (response.data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not get response." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Server Error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (text) => {
        if (loading) return;
        setQuery(text);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 h-14 w-14 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 z-[1000] bg-primary text-primary-foreground"
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-4 right-4 z-[1000] flex h-[78vh] w-[calc(100vw-2rem)] max-h-[700px] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200/70 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 sm:bottom-5 sm:right-5 sm:h-[620px] sm:w-[400px]">
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />
                <CardTitle className="relative flex items-center gap-2 text-base font-semibold">
                    <div className="rounded-lg bg-white/15 p-1.5">
                        <Bot className="h-5 w-5" />
                    </div>
                    SMS AI Copilot
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="relative h-8 w-8 text-white hover:bg-white/20"
                >
                    <X className="h-5 w-5" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden bg-slate-50 p-0">
                <ScrollArea ref={scrollRef} className="h-full p-4">
                    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Sparkles className="h-3.5 w-3.5" />
                            Quick prompts
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleQuickPrompt(prompt)}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 transition hover:bg-slate-100"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-end gap-2 max-w-[85%]",
                                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <Avatar className="h-8 w-8 border border-border shrink-0">
                                    <AvatarFallback className={cn(
                                        "text-[10px]",
                                        m.role === 'user' ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                                    )}>
                                        {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-2 text-sm shadow-sm",
                                        m.role === 'user'
                                            ? "rounded-br-none bg-slate-900 text-white"
                                            : "rounded-bl-none border border-slate-200 bg-white text-slate-700"
                                    )}
                                >
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 mr-auto max-w-[85%]">
                                <Avatar className="h-8 w-8 border border-border shrink-0 animate-pulse">
                                    <AvatarFallback className="bg-muted">
                                        <Bot className="h-4 w-4 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-2 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="border-t border-slate-200 bg-white p-4">
                <form onSubmit={handleSend} className="flex w-full items-center gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a message..."
                        className="h-10 flex-1 border-slate-200 bg-slate-50 focus-visible:ring-1 focus-visible:ring-slate-400"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        disabled={loading || !query.trim()}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl bg-slate-900 text-white transition-all duration-200 hover:bg-slate-800"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

