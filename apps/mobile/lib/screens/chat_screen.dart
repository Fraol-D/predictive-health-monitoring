import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import 'package:badges/badges.dart' as badges;
import 'package:predictive_health_monitoring/screens/notifications_screen.dart';
import 'package:predictive_health_monitoring/services/gemini_service.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

// --- DATA MODELS ---
var uuid = const Uuid();

class ChatMessage {
  final String id;
  final String text;
  final bool isUser;

  ChatMessage({required this.text, required this.isUser}) : id = uuid.v4();
}

class ChatSession {
  String id;
  String title;
  List<ChatMessage> messages;
  DateTime timestamp;

  ChatSession({
    required this.id,
    required this.title,
    required this.messages,
    required this.timestamp,
  });
}
// -----------------

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final TextEditingController _controller = TextEditingController();
  final Map<String, ChatSession> _chatSessions = {};
  String? _activeChatId;

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // For now, let's initialize with one session for demonstration
    final initialSessionId = uuid.v4();
    _chatSessions[initialSessionId] = ChatSession(
      id: initialSessionId,
      title: 'Initial Chat',
      messages: [
        ChatMessage(
            text:
                "Hello! I'm your AI Health Assistant. How can I help you today?",
            isUser: false)
      ],
      timestamp: DateTime.now(),
    );
    _activeChatId = initialSessionId;
  }

  // --- CHAT ACTIONS ---

  void _createNewChat() {
    setState(() {
      _activeChatId = null; // Representing a new, unsaved chat
    });
    // Close the drawer if it's open
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
    }
  }

  void _deleteChat(String sessionId) {
    setState(() {
      _chatSessions.remove(sessionId);
      if (_activeChatId == sessionId) {
        // If the active chat is deleted, switch to a new chat view
        _activeChatId = null;
      }
    });
  }

  void _setActiveChat(String sessionId) {
    setState(() {
      _activeChatId = sessionId;
    });
    Navigator.of(context).pop(); // Close the drawer
  }

  Future<void> _sendMessage() async {
    if (_controller.text.isEmpty || _isLoading) return;

    final geminiService = Provider.of<GeminiService>(context, listen: false);
    final userMessageText = _controller.text;
    final userMessage = ChatMessage(text: userMessageText, isUser: true);

    setState(() {
      _isLoading = true;
      _controller.clear();

      if (_activeChatId == null) {
        // This is a new chat, create a session
        final newChatId = uuid.v4();
        final newSession = ChatSession(
          id: newChatId,
          title: userMessageText.substring(
              0, userMessageText.length > 30 ? 30 : userMessageText.length),
          messages: [userMessage],
          timestamp: DateTime.now(),
        );
        _chatSessions[newChatId] = newSession;
        _activeChatId = newChatId;
      } else {
        // Add to the existing active session
        _chatSessions[_activeChatId!]?.messages.add(userMessage);
        _chatSessions[_activeChatId!]?.timestamp = DateTime.now();
      }
    });

    try {
      final response = await geminiService.generateContent(userMessageText);
      final aiMessage = ChatMessage(text: response, isUser: false);
      setState(() {
        _chatSessions[_activeChatId!]?.messages.add(aiMessage);
      });
    } catch (e) {
      final errorMessage = ChatMessage(
          text: 'Error: Could not get a response. ${e.toString()}',
          isUser: false);
      setState(() {
        _chatSessions[_activeChatId!]?.messages.add(errorMessage);
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _sendStarterPrompt(String prompt) {
    _controller.text = prompt;
    _sendMessage();
  }

  // --- UI BUILDERS ---

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeMessages =
        _activeChatId != null ? _chatSessions[_activeChatId!]?.messages : [];

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text(
          'Chat',
          style: theme.textTheme.titleLarge?.copyWith(fontSize: 20),
        ),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: AppTheme.titleHeaderGradient,
          ),
        ),
        actions: [
          IconButton(
            icon: badges.Badge(
              badgeContent: const Text('3',
                  style: TextStyle(color: Colors.white, fontSize: 10)),
              child: const Icon(Icons.notifications_outlined),
            ),
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const NotificationsScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.add_comment_outlined),
            onPressed: _createNewChat,
            tooltip: 'New Chat',
          ),
        ],
      ),
      drawer: _buildChatHistoryDrawer(),
      body: GestureDetector(
        onHorizontalDragEnd: (details) {
          if (details.primaryVelocity == null) return;
          // Swipe right to open drawer
          if (details.primaryVelocity! > 300) {
            _scaffoldKey.currentState?.openDrawer();
          }
          // Swipe left to close drawer
          if (details.primaryVelocity! < -300) {
            if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
              Navigator.of(context).pop();
            }
          }
        },
        child: Column(
          children: [
            Expanded(
              child: activeMessages == null || activeMessages.isEmpty
                  ? _buildConversationStarters()
                  : ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: activeMessages.length,
                      itemBuilder: (context, index) {
                        final message = activeMessages[index];
                        return _buildMessage(message);
                      },
                    ),
            ),
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8.0),
                child: CircularProgressIndicator(),
              ),
            _buildChatInput(),
          ],
        ),
      ),
    );
  }

  Widget _buildChatHistoryDrawer() {
    final sortedSessions = _chatSessions.values.toList()
      ..sort((a, b) => b.timestamp.compareTo(a.timestamp));

    return Drawer(
      child: Column(
        children: [
          AppBar(
            title: const Text('Chat History'),
            automaticallyImplyLeading: false,
            actions: [
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              )
            ],
          ),
          Expanded(
            child: ListView.builder(
              itemCount: sortedSessions.length,
              itemBuilder: (context, index) {
                final session = sortedSessions[index];
                return ListTile(
                  title: Text(session.title, overflow: TextOverflow.ellipsis),
                  selected: _activeChatId == session.id,
                  selectedTileColor:
                      Theme.of(context).colorScheme.surfaceVariant,
                  onTap: () => _setActiveChat(session.id),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline),
                    tooltip: 'Delete Chat',
                    onPressed: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text('Delete Chat?'),
                            content: const Text(
                                'Are you sure you want to delete this chat? This action cannot be undone.'),
                            actions: <Widget>[
                              TextButton(
                                onPressed: () =>
                                    Navigator.of(context).pop(false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () =>
                                    Navigator.of(context).pop(true),
                                child: Text(
                                  'Delete Chat',
                                  style: TextStyle(
                                      color:
                                          Theme.of(context).colorScheme.error),
                                ),
                              ),
                            ],
                          );
                        },
                      );

                      if (confirmed == true) {
                        _deleteChat(session.id);
                      }
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(ChatMessage message) {
    final theme = Theme.of(context);
    final isUser = message.isUser;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 8.0),
        padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 14.0),
        decoration: BoxDecoration(
          gradient: isUser ? AppTheme.titleHeaderGradient : null,
          color: !isUser ? theme.colorScheme.surfaceVariant : null,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isUser ? 16 : 0),
            bottomRight: Radius.circular(isUser ? 0 : 16),
          ),
        ),
        child: MarkdownBody(
          data: message.text,
          styleSheet: MarkdownStyleSheet.fromTheme(theme).copyWith(
            p: theme.textTheme.bodyLarge?.copyWith(
              color: isUser ? Colors.white : theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChatInput() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Ask me anything...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30.0),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              ),
              onSubmitted: (_) => _sendMessage(),
              minLines: 1,
              maxLines: 5, // Allows the input to grow up to 5 lines
              textInputAction: TextInputAction.send,
            ),
          ),
          const SizedBox(width: 8.0),
          Container(
            decoration: const BoxDecoration(
              gradient: AppTheme.titleHeaderGradient,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.send),
              onPressed: _sendMessage,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConversationStarters() {
    final List<Map<String, dynamic>> prompts = [
      {
        'icon': Icons.restaurant_menu_outlined,
        'text': 'Can you suggest a low-carb meal plan?'
      },
      {
        'icon': Icons.analytics_outlined,
        'text': 'Explain my latest health report'
      },
      {
        'icon': Icons.fitness_center_outlined,
        'text': 'What are some good at-home exercises?'
      },
      {'icon': Icons.help_outline, 'text': 'What does my risk score mean?'},
    ];

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "What can I help with?",
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 32),
            Wrap(
              spacing: 12.0,
              runSpacing: 12.0,
              alignment: WrapAlignment.center,
              children: prompts.map((prompt) {
                return ElevatedButton.icon(
                  icon: Icon(prompt['icon'], size: 20),
                  label: Text(prompt['text']),
                  onPressed: () => _sendStarterPrompt(prompt['text']),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        vertical: 16, horizontal: 20),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    // Applying gradient requires a custom button or a workaround
                    // For now, let's use primary color, can be enhanced later.
                    // foregroundColor: Colors.white,
                    // backgroundColor: Theme.of(context).colorScheme.primary,
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
