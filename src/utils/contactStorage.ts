interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  receivedAt: string;
  isRead: boolean;
  isArchived: boolean;
}

const CONTACT_MESSAGES_KEY = 'contact-messages';

export const saveContactMessage = (messageData: {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}): ContactMessage => {
  const messages = getContactMessages();
  
  const newMessage: ContactMessage = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...messageData,
    receivedAt: new Date().toISOString(),
    isRead: false,
    isArchived: false
  };
  
  messages.unshift(newMessage); // Add to beginning (newest first)
  localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
  
  return newMessage;
};

export const getContactMessages = (): ContactMessage[] => {
  const stored = localStorage.getItem(CONTACT_MESSAGES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const markMessageAsRead = (messageId: string): boolean => {
  try {
    const messages = getContactMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex >= 0) {
      messages[messageIndex].isRead = !messages[messageIndex].isRead;
      localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};

export const archiveMessage = (messageId: string): boolean => {
  try {
    const messages = getContactMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex >= 0) {
      messages[messageIndex].isArchived = true;
      localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error archiving message:', error);
    return false;
  }
};

export const deleteContactMessage = (messageId: string): boolean => {
  try {
    const messages = getContactMessages();
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(filteredMessages));
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
};

export const getUnreadMessageCount = (): number => {
  const messages = getContactMessages();
  return messages.filter(msg => !msg.isRead && !msg.isArchived).length;
};

export const simulateEmailReply = (message: ContactMessage, replyContent: string): boolean => {
  try {
    // In a real application, this would integrate with an email service
    // For now, we'll just log the reply and mark the message as read
    console.log('Email Reply Sent:', {
      to: message.email,
      subject: `Re: ${message.subject}`,
      body: replyContent,
      originalMessage: message
    });
    
    // Mark the original message as read
    markMessageAsRead(message.id);
    
    // In a real app, you might also want to store the reply in a separate collection
    const replies = JSON.parse(localStorage.getItem('message-replies') || '[]');
    const newReply = {
      id: Date.now().toString(),
      originalMessageId: message.id,
      to: message.email,
      subject: `Re: ${message.subject}`,
      body: replyContent,
      sentAt: new Date().toISOString(),
      sentBy: 'admin' // In real app, this would be the current admin user
    };
    
    replies.push(newReply);
    localStorage.setItem('message-replies', JSON.stringify(replies));
    
    return true;
  } catch (error) {
    console.error('Error sending reply:', error);
    return false;
  }
};

export { type ContactMessage };