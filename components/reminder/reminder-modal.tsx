'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/input';
import { Brain, Mail, MessageSquare, Send, Loader2 } from 'lucide-react';

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceId: string;
}

export function ReminderModal({ isOpen, onClose, invoiceId }: ReminderModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [escalationLevel, setEscalationLevel] = useState('1');
    const [reminderType, setReminderType] = useState('email');
    const [generatedMessage, setGeneratedMessage] = useState<{
        subject?: string;
        message: string;
        suggestedAction?: string;
    } | null>(null);

    const generateAIReminder = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(`/api/reminders/generate/${invoiceId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ escalationLevel: parseInt(escalationLevel) }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate reminder');
            }

            const data = await response.json();
            setGeneratedMessage(data.data);
            toast.success('AI message generated!');
        } catch (error) {
            toast.error('Failed to generate AI reminder');
        } finally {
            setIsGenerating(false);
        }
    };

    const sendReminder = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/reminders/send/${invoiceId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: reminderType,
                    escalationLevel: parseInt(escalationLevel),
                    customMessage: generatedMessage?.message,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send reminder');
            }

            toast.success('Reminder sent successfully!');
            onClose();
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send reminder');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setGeneratedMessage(null);
        setEscalationLevel('1');
        setReminderType('email');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Send AI Reminder"
            description="Generate and send a personalized payment reminder"
            size="lg"
        >
            <div className="space-y-6">
                {/* Options */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Select
                        label="Escalation Level"
                        value={escalationLevel}
                        onChange={(e) => {
                            setEscalationLevel(e.target.value);
                            setGeneratedMessage(null);
                        }}
                        options={[
                            { value: '1', label: 'Level 1 - Polite Reminder' },
                            { value: '2', label: 'Level 2 - Firm Follow-up' },
                            { value: '3', label: 'Level 3 - Urgent Notice' },
                        ]}
                    />
                    <Select
                        label="Send Via"
                        value={reminderType}
                        onChange={(e) => setReminderType(e.target.value)}
                        options={[
                            { value: 'email', label: '📧 Email' },
                            { value: 'sms', label: '📱 SMS' },
                            { value: 'whatsapp', label: '💬 WhatsApp' },
                        ]}
                    />
                </div>

                {/* Generate Button */}
                {!generatedMessage && (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <Brain className="w-12 h-12 text-primary-400 mx-auto" />
                        <p className="mt-3 text-gray-600">
                            Click below to generate an AI-personalized message based on client history
                        </p>
                        <Button
                            className="mt-4"
                            onClick={generateAIReminder}
                            isLoading={isGenerating}
                            leftIcon={<Brain className="w-5 h-5" />}
                        >
                            Generate AI Message
                        </Button>
                    </div>
                )}

                {/* Generated Message Preview */}
                {generatedMessage && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        {generatedMessage.subject && reminderType === 'email' && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Subject</p>
                                <p className="text-dark-900 font-medium">{generatedMessage.subject}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-500">Message</p>
                            <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                <p className="text-dark-700 whitespace-pre-line">{generatedMessage.message}</p>
                            </div>
                        </div>
                        {generatedMessage.suggestedAction && (
                            <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                                <p className="text-sm text-primary-700">
                                    <strong>AI Suggestion:</strong> {generatedMessage.suggestedAction}
                                </p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGeneratedMessage(null)}
                        >
                            Regenerate
                        </Button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={sendReminder}
                        isLoading={isLoading}
                        disabled={!generatedMessage}
                        leftIcon={<Send className="w-5 h-5" />}
                    >
                        Send {reminderType === 'email' ? 'Email' : reminderType === 'sms' ? 'SMS' : 'WhatsApp'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
