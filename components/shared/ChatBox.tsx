"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageCircle, AlertTriangle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";

// Patterns that indicate contact details being shared
const CONTACT_PATTERNS: RegExp[] = [
  // BR phone numbers (formatted or raw)
  /(\+?55\s*)?\(?\d{2}\)?\s*\d{4,5}[-\s]?\d{4}/,
  // Any 8+ consecutive digits (unformatted numbers)
  /\b\d{8,}\b/,
  // Email addresses
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  // WhatsApp / messaging app mentions
  /\b(what[s']?app|wpp|zap|telegram|signal)\b/i,
  // "Me chama no / manda msg / me add" phrasing
  /\b(me chama|manda msg|me add|me manda|chama no|add no|fala comigo)\b/i,
  // "meu número / cel / fone / whats / zap"
  /\bmeu (numero|n[uú]mero|cel|celular|fone|telefone|whats|zap|wpp|contato)\b/i,
  // Instagram / Facebook handles or mentions
  /\b(instagram|insta|face(book)?|fb|tiktok)\b/i,
  // @username pattern (social handles)
  /@[a-zA-Z0-9._]{2,}/,
  // "me segue / me acompanha" — social follow requests
  /\bme (segue|acompanha|encontra|procura)\b/i,
];

function hasContactInfo(text: string): boolean {
  return CONTACT_PATTERNS.some((re) => re.test(text));
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ── Mock messages for when the table doesn't exist yet ────────────────────────
const MOCK_MESSAGES: Message[] = [
  {
    id:                 "mock-1",
    service_request_id: "mock",
    sender_id:          "system",
    content:            "✅ Técnico aceitou o chamado. Aguarde o contato.",
    read:               true,
    created_at:         new Date(Date.now() - 3600000).toISOString(),
    is_system:          true,
  },
  {
    id:                 "mock-2",
    service_request_id: "mock",
    sender_id:          "other",
    content:            "Olá! Estarei no endereço às 9h. Alguma observação especial?",
    read:               true,
    created_at:         new Date(Date.now() - 1800000).toISOString(),
    is_system:          false,
  },
  {
    id:                 "mock-3",
    service_request_id: "mock",
    sender_id:          "me",
    content:            "Ótimo! O portão está sempre aberto. Pode entrar direto.",
    read:               true,
    created_at:         new Date(Date.now() - 900000).toISOString(),
    is_system:          false,
  },
];

interface Props {
  serviceId: string;
  currentUserId: string;
  currentUserName: string;
  otherUserName: string;
  /** If provided, this message is inserted as a system message on mount (once). */
  systemMessageOnMount?: string;
}

export default function ChatBox({
  serviceId,
  currentUserId,
  currentUserName,
  otherUserName,
  systemMessageOnMount,
}: Props) {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState("");
  const [sending, setSending]           = useState(false);
  const [contactWarning, setContactWarn]= useState(false);
  const [useMock, setUseMock]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const scrollRef                       = useRef<HTMLDivElement>(null);
  const systemMsgInserted               = useRef(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark incoming messages as read
  const markRead = useCallback(async (msgs: Message[]) => {
    const unread = msgs.filter((m) => !m.read && m.sender_id !== currentUserId && !m.is_system);
    if (!unread.length) return;
    try {
      const supabase = createClient();
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("service_request_id", serviceId)
        .neq("sender_id", currentUserId)
        .eq("read", false);
    } catch { /* silent */ }
  }, [serviceId, currentUserId]);

  const fetchMessages = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("service_request_id", serviceId)
        .order("created_at", { ascending: true });

      if (error) {
        setUseMock(true);
        setMessages(MOCK_MESSAGES);
        return;
      }

      const msgs = (data ?? []) as Message[];
      setMessages(msgs);
      setUseMock(false);
      await markRead(msgs);
    } catch {
      setUseMock(true);
      setMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  }, [serviceId, markRead]);

  // Insert one-shot system message if provided
  const insertSystemMessage = useCallback(async (content: string) => {
    if (useMock) return;
    try {
      const supabase = createClient();
      await supabase.from("messages").insert({
        service_request_id: serviceId,
        sender_id:          currentUserId,
        content,
        is_system:          true,
        read:               true,
      });
    } catch { /* table might not exist yet — silent */ }
  }, [serviceId, currentUserId, useMock]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Insert system message on mount (once)
  useEffect(() => {
    if (systemMessageOnMount && !systemMsgInserted.current && !loading && !useMock) {
      systemMsgInserted.current = true;
      insertSystemMessage(systemMessageOnMount);
    }
  }, [systemMessageOnMount, loading, useMock, insertSystemMessage]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setInput(val);
    setContactWarn(hasContactInfo(val));
  }

  async function logContactAttempt(content: string) {
    try {
      const supabase = createClient();
      await supabase.from("contact_attempt_logs").insert({
        service_request_id: serviceId,
        user_id:            currentUserId,
        attempted_content:  content,
      });
    } catch { /* table may not exist yet — silent */ }
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || sending) return;
    if (contactWarning) {
      // Log the blocked attempt for admin monitoring
      await logContactAttempt(content);
      return;
    }

    setSending(true);
    try {
      if (useMock) {
        // Optimistic mock
        setMessages((prev) => [
          ...prev,
          {
            id:                 `local-${Date.now()}`,
            service_request_id: serviceId,
            sender_id:          "me",
            content,
            read:               false,
            created_at:         new Date().toISOString(),
            is_system:          false,
          },
        ]);
        setInput("");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.from("messages").insert({
        service_request_id: serviceId,
        sender_id:          currentUserId,
        content,
        is_system:          false,
      });

      if (!error) {
        setInput("");
        await fetchMessages();
      }
    } catch { /* silent */ } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group consecutive messages by same sender to show name only on first
  type GroupedMessage = Message & { showSender: boolean };

  function groupMessages(msgs: Message[]): GroupedMessage[] {
    return msgs.map((m, i) => ({
      ...m,
      showSender: i === 0 || msgs[i - 1].sender_id !== m.sender_id,
    }));
  }

  function senderName(senderId: string): string {
    if (useMock) return senderId === "me" ? currentUserName : otherUserName;
    return senderId === currentUserId ? currentUserName : otherUserName;
  }

  const grouped = groupMessages(messages);

  return (
    <div className="flex flex-col rounded-2xl border border-brand-border bg-white overflow-hidden shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-brand-border bg-brand-bg">
        <div className="h-8 w-8 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={16} className="text-brand-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-dark leading-tight">Conversa</p>
          <p className="text-[10px] text-brand-muted truncate">{otherUserName}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-brand-muted">
          <Lock size={10} />
          <span>Seguro</span>
        </div>
        {useMock && (
          <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Demo
          </span>
        )}
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-[240px] max-h-[360px] bg-brand-pale"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="animate-spin h-5 w-5 border-2 border-brand-green border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 gap-2">
            <MessageCircle size={28} className="text-brand-border" />
            <p className="text-xs text-brand-muted">Nenhuma mensagem ainda. Diga olá! 👋</p>
          </div>
        ) : (
          grouped.map((msg) => {
            const isMe     = useMock ? msg.sender_id === "me" : msg.sender_id === currentUserId;
            const isSystem = msg.is_system;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="text-[10px] text-brand-muted bg-white border border-brand-border rounded-full px-3 py-1 italic">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {msg.showSender && (
                  <span className="text-[10px] text-brand-muted font-semibold mb-0.5 px-1">
                    {senderName(msg.sender_id)}
                  </span>
                )}
                <div className={`
                  max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed
                  ${isMe
                    ? "bg-brand-green text-white rounded-tr-sm"
                    : "bg-brand-light text-brand-dark rounded-tl-sm border border-brand-border"
                  }
                `}>
                  {msg.content}
                  <div className={`text-[10px] mt-0.5 text-right ${isMe ? "text-white/60" : "text-brand-muted"}`}>
                    {fmtTime(msg.created_at)}
                    {isMe && (
                      <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Contact warning ── */}
      {contactWarning && (
        <div className="flex items-start gap-2 px-4 py-2.5 bg-red-50 border-t border-red-200">
          <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">
            ⚠️ Dados de contato não são permitidos no chat. Para sua segurança, toda comunicação deve ser feita pela plataforma.
          </p>
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex items-end gap-2 px-3 py-3 border-t border-brand-border bg-white">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem… (Enter para enviar)"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green min-h-[38px] max-h-[96px]"
          style={{ overflowY: "auto" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending || contactWarning}
          className="flex-shrink-0 h-9 w-9 rounded-xl bg-brand-green text-white flex items-center justify-center hover:bg-brand-green/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {sending
            ? <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            : <Send size={15} />
          }
        </button>
      </div>
    </div>
  );
}

// ── Helper: insert a system message (called from parent on status transitions) ─

export async function insertSystemMessage(
  serviceId: string,
  senderId: string,
  content: string
): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("messages").insert({
      service_request_id: serviceId,
      sender_id:          senderId,
      content,
      is_system:          true,
      read:               true,
    });
  } catch { /* table might not exist — silent */ }
}

// ── Helper: count unread messages for a user across multiple services ──────────

export async function countUnreadMessages(
  serviceIds: string[],
  currentUserId: string
): Promise<number> {
  if (!serviceIds.length) return 0;
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .in("service_request_id", serviceIds)
      .neq("sender_id", currentUserId)
      .eq("read", false)
      .eq("is_system", false);
    return count ?? 0;
  } catch {
    return 0;
  }
}
