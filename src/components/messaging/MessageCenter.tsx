import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Send, Search, Clock, User, FileText } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  appointmentId?: string;
}

interface Contact {
  id: string;
  name: string;
  role: "doctor" | "patient";
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface MessageCenterProps {
  userId: string;
  userRole: "doctor" | "patient";
  contacts?: Contact[];
  messages?: Message[];
  onSendMessage?: (
    recipientId: string,
    content: string,
    appointmentId?: string,
  ) => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
  userId = "user-1",
  userRole = "patient",
  contacts = [],
  messages = [],
  onSendMessage = () => {},
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get messages for the selected contact
  const contactMessages = selectedContact
    ? messages.filter(
        (message) =>
          (message.senderId === userId &&
            message.recipientId === selectedContact.id) ||
          (message.recipientId === userId &&
            message.senderId === selectedContact.id),
      )
    : [];

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      onSendMessage(selectedContact.id, messageText);
      setMessageText("");
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Contacts sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 p-2">
            <TabsContent value="all" className="m-0">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${selectedContact?.id === contact.id ? "bg-primary/10" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {contact.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{contact.name}</p>
                        {contact.lastMessageTime && (
                          <p className="text-xs text-gray-500">
                            {format(contact.lastMessageTime, "h:mm a")}
                          </p>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No contacts found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {filteredContacts.filter((c) => c.unreadCount > 0).length > 0 ? (
                filteredContacts
                  .filter((c) => c.unreadCount > 0)
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${selectedContact?.id === contact.id ? "bg-primary/10" : "hover:bg-gray-100"}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={contact.avatar}
                            alt={contact.name}
                          />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{contact.name}</p>
                          {contact.lastMessageTime && (
                            <p className="text-xs text-gray-500">
                              {format(contact.lastMessageTime, "h:mm a")}
                            </p>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {contact.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No unread messages</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                  />
                  <AvatarFallback>
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    {selectedContact.role === "doctor" ? (
                      <>
                        <User className="h-3 w-3 mr-1" /> Doctor
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" /> Patient
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {contactMessages.length > 0 ? (
                  contactMessages.map((message) => {
                    const isUserMessage = message.senderId === userId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${isUserMessage ? "bg-primary text-primary-foreground" : "bg-gray-100"}`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${isUserMessage ? "text-primary-foreground/70" : "text-gray-500"}`}
                          >
                            {format(message.timestamp, "h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[80px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="self-end"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-gray-500 max-w-sm">
              Select a contact to start messaging. You can communicate with your
              {userRole === "patient" ? " doctors " : " patients "}
              about appointments and health concerns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
