import { useState } from 'react'
import { Company } from '@/types/database'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Bot, User } from 'lucide-react'

interface ChatInterfaceProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCompany: Company | null
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export function ChatInterface({ open, onOpenChange, selectedCompany }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your financial AI assistant. I can help you analyze ${selectedCompany?.name || 'your company'}'s performance and answer questions about balance sheets, revenue trends, and financial metrics. What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I understand you're asking about "${inputValue}". This is a placeholder response. In a real implementation, this would connect to an AI service that can analyze ${selectedCompany?.name || 'your company'}'s financial data and provide insights about balance sheets, revenue trends, profitability, and other financial metrics. The backend endpoint would process your question and return relevant analysis.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Financial AI Assistant</DialogTitle>
          <DialogDescription>
            Ask questions about {selectedCompany?.name || 'your company'}'s financial performance
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={`${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {isTyping && (
              <Card className="mr-12">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4">
          <Input
            placeholder="Ask about financial performance, trends, or specific metrics..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}