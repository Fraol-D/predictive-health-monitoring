import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:provider/provider.dart';
import 'package:predictive_health_monitoring/services/gemini_service.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';

class Message {
  final String id;
  final String text;
  final bool isUser;

  Message({required this.id, required this.text, required this.isUser});
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Message> _messages = [
    Message(id: '1', text: "Hello! I'm your AI Health Assistant. How can I help you today?", isUser: false),
  ];
  bool _isLoading = false;

  Future<void> _sendMessage() async {
    if (_controller.text.isEmpty) return;
    final geminiService = Provider.of<GeminiService>(context, listen: false);
    final userMessage = _controller.text;

    setState(() {
      _messages.add(Message(id: DateTime.now().toString(), text: userMessage, isUser: true));
      _isLoading = true;
      _controller.clear();
    });

    try {
      final response = await geminiService.generateContent(userMessage);
      setState(() {
        _messages.add(Message(id: DateTime.now().toString(), text: response, isUser: false));
      });
    } catch (e) {
      setState(() {
        _messages.add(Message(id: DateTime.now().toString(), text: 'Error: ${e.toString()}', isUser: false));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _onSuggestionTapped(String suggestion) {
    _controller.text = suggestion;
    _sendMessage();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Health Assistant'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _buildMessage(message);
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: CircularProgressIndicator(),
            ),
          _buildChatInput(),
        ],
      ),
    );
  }

  Widget _buildMessage(Message message) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4.0),
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: message.isUser ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12.0),
        ),
        child: MarkdownBody(data: message.text),
      ),
    );
  }

  Widget _buildChatInput() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          if (_messages.length <= 1) _buildConversationStarters(),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    hintText: 'Ask anything...',
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              const SizedBox(width: 8.0),
              IconButton(
                icon: const Icon(Icons.send),
                onPressed: _sendMessage,
                style: IconButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Theme.of(context).colorScheme.onPrimary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConversationStarters() {
    final suggestionButton = (String text, IconData icon) {
      return Expanded(
        child: OutlinedButton.icon(
          icon: Icon(icon, size: 20),
          label: Text(text),
          onPressed: () => _onSuggestionTapped(text),
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            textStyle: const TextStyle(fontSize: 12),
            side: BorderSide(color: Theme.of(context).colorScheme.outline.withOpacity(0.5)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    };

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Try these", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            suggestionButton("Latest news", Icons.article_outlined),
            const SizedBox(width: 12),
            suggestionButton("Create images", Icons.image_outlined),
            const SizedBox(width: 12),
            suggestionButton("Cartoon style", Icons.brush_outlined),
          ],
        ),
        // Old buttons commented out
        // ElevatedButton(onPressed: () => _controller.text = 'Get my health risk', child: const Text('Get my health risk')),
        // ElevatedButton(onPressed: () => _controller.text = 'Show my last assessment', child: const Text('Show my last assessment')),
        // ElevatedButton(onPressed: () => _controller.text = 'Give health tips', child: const Text('Give health tips')),
        // ElevatedButton(onPressed: () => _controller.text = 'Explain my results', child: const Text('Explain my results')),
      ],
    );
  }
} 