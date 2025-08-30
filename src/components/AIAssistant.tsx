'use client'

import {
  Bot,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Send,
  User,
  X
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AIAssistantProps {
  className?: string
}

export function AIAssistant({ className = '' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your MyPath AI assistant. I can help you navigate Australian government services, answer questions about your eligibility, and guide you through processes. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [position, setPosition] = useState({ x: 24, y: 24 }) // Default: bottom-right (24px from edges)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-AU'
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsRecording(false)
      }
      
      recognition.onerror = () => {
        setIsRecording(false)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      setRecognition(recognition)
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return // Don't allow dragging when chat is open
    
    setIsDragging(true)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    e.preventDefault()
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = window.innerHeight - (e.clientY - dragOffset.y) - 56 // 56px is button height
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 56 // 56px is button width
    const maxY = window.innerHeight - 56 // 56px is button height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [isDragging, dragOffset.x, dragOffset.y])

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, dragOffset])

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return // Don't allow dragging when chat is open
    
    const touch = e.touches[0]
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setIsDragging(true)
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    })
    e.preventDefault()
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    const newX = touch.clientX - dragOffset.x
    const newY = window.innerHeight - (touch.clientY - dragOffset.y) - 56 // 56px is button height
    
    const maxX = window.innerWidth - 56
    const maxY = window.innerHeight - 56
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
    e.preventDefault()
  }, [isDragging, dragOffset.x, dragOffset.y])

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add/remove touch event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragOffset])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('medicare') || input.includes('health')) {
      return 'For Medicare services, you can access your Medicare account through myGov at my.gov.au. This includes viewing your Medicare card, claiming benefits, and managing your health records. Would you like me to help you navigate to Medicare services?'
    } else if (input.includes('centrelink') || input.includes('payment')) {
      return 'Centrelink payments and services are available through Services Australia. You can check your payments, update your details, and apply for benefits through your myGov account. What specific Centrelink service are you looking for?'
    } else if (input.includes('tax') || input.includes('ato')) {
      return 'For tax-related services, you can access the Australian Taxation Office (ATO) services through myGov or directly at ato.gov.au. This includes lodging tax returns, managing your business obligations, and checking refund status.'
    } else if (input.includes('visa') || input.includes('immigration')) {
      return 'For visa and immigration services, you can visit the Department of Home Affairs website. They handle visa applications, citizenship, and immigration status updates.'
    } else {
      return 'I understand you\'re looking for help with government services. Could you please provide more specific details about what you need assistance with? I can help with Medicare, Centrelink, taxation, visa services, and many other Australian government services.'
    }
  }

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser')
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div 
        className={`fixed z-50 ${className}`}
        style={{ 
          left: `${position.x}px`, 
          bottom: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <Button
          onClick={() => !isDragging && setIsOpen(true)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          size="lg"
          className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 select-none ${
            isDragging ? 'scale-110' : ''
          }`}
          style={{ touchAction: 'none' }}
        >
          <Bot className="h-6 w-6" />
        </Button>
        <Badge 
          className="absolute -top-2 -left-2 bg-red-500 text-white pointer-events-none" //animate-pulse
          variant="secondary"
        >
          AI
        </Badge>
      </div>
    )
  }

  return (
    <div 
      className={`fixed z-50 ${className}`}
      style={{ 
        left: `${typeof window !== 'undefined' ? Math.min(position.x, window.innerWidth - (isMinimized ? 320 : 384)) : position.x}px`, 
        bottom: `${typeof window !== 'undefined' ? Math.min(position.y, window.innerHeight - (isMinimized ? 64 : 512)) : position.y}px`
      }}
    >
      <Card 
        className={`transition-all duration-300 shadow-xl bg-white border ${
          isMinimized 
            ? 'w-80 h-16' 
            : 'w-80 sm:w-96 h-[32rem]'
        }`}
      >
        <CardHeader className="pb-3 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">MyPath AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[calc(100%-5rem)] bg-white">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about government services..."
                className="flex-1"
              />
              <Button
                onClick={handleVoiceInput}
                variant="outline"
                size="sm"
                className={`px-3 ${isRecording ? 'bg-red-100 text-red-600' : ''}`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="px-3"
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}