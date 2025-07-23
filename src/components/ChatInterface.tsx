import { useState } from 'react'
import { Company } from '@/types/database'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Bot, User, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

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
  const { user } = useAuth()
  const { toast } = useToast()
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
    if (!inputValue.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    const currentInput = inputValue
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const { data, error } = await supabase.functions.invoke('analyze-balance-sheet', {
        body: {
          message: currentInput,
          companyId: selectedCompany?.id,
          userId: user.id
        }
      })

      if (error) {
        console.error('Error calling AI analysis:', error)
        throw new Error(error.message || 'Failed to get AI analysis')
      }

      const aiResponse = data?.response || "I apologize, but I couldn't analyze your request at the moment. Please try again."
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])

      if (!data?.dataAvailable) {
        toast({
          title: "Limited Data",
          description: "Analysis is based on limited financial data. Upload more balance sheets for better insights.",
          variant: "default"
        })
      }

    } catch (error) {
      console.error('Error in chat:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
      
      toast({
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsTyping(false)
    }
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
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
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