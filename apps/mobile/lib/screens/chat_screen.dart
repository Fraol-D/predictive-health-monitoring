import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:predictive_health_monitoring/theme/app_theme.dart';
import 'package:predictive_health_monitoring/widgets/common/gradient_button.dart';

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

  void _sendMessage() {
    if (_controller.text.isEmpty) return;
    setState(() {
      _messages.add(Message(id: DateTime.now().toString(), text: _controller.text, isUser: true));
      _isLoading = true;
    });

    // Simulate AI response
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        _messages.add(Message(id: DateTime.now().toString(), text: 'This is a **mock** response to "${_controller.text}"', isUser: false));
        _isLoading = false;
        _controller.clear();
      });
    });
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
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                    hintText: 'Ask the AI Health Assistant...',
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              const SizedBox(width: 8.0),
              GradientButton(
                onPressed: _sendMessage,
                gradient: AppTheme.primaryGradient,
                icon: Icons.send,
                text: '',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConversationStarters() {
    return Column(
      children: [
        ElevatedButton(onPressed: () => _controller.text = 'Get my health risk', child: const Text('Get my health risk')),
        ElevatedButton(onPressed: () => _controller.text = 'Show my last assessment', child: const Text('Show my last assessment')),
        ElevatedButton(onPressed: () => _controller.text = 'Give health tips', child: const Text('Give health tips')),
        ElevatedButton(onPressed: () => _controller.text = 'Explain my results', child: const Text('Explain my results')),
      ],
    );
  }
} 