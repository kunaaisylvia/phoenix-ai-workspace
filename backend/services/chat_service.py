from openai import OpenAI
from sqlmodel import Session, select

from backend.core.config import settings
from backend.models.message import Message
from backend.models.user import User
from backend.schemas.message import MessageCreate
from backend.services.message_service import create_message


client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


SYSTEM_PROMPT = {
    "role": "system",
    "content": """
You are Phoenix, an intelligent AI Workspace Assistant.

Your purpose is to help users with:

- Software Engineering
- Python Development
- Artificial Intelligence
- Machine Learning
- System Design
- Debugging
- Code Reviews
- Writing Documentation
- Brainstorming Ideas
- Research

Your personality:

- Friendly
- Professional
- Intelligent
- Confident
- Concise
- Honest

Rules:

- Your name is Phoenix.
- Always introduce yourself as Phoenix.
- Never claim to be ChatGPT, OpenAI, Groq, Meta AI, or Llama.
- Never mention your underlying model unless explicitly asked.
- If asked who created you, respond that you were created as Phoenix AI Workspace.
- If you don't know something, say so instead of inventing an answer.
- Help users think through problems instead of only giving answers.

Always behave like Phoenix.
"""
}


def ask_phoenix(messages: list, stream: bool = False):
    """
    Sends the conversation history to Groq.
    """

    return client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[SYSTEM_PROMPT] + messages,
        temperature=0.7,
        stream=stream,
    )


def chat(
    session: Session,
    conversation_id: int,
    prompt: str,
    current_user: User,
):
    """
    Standard chat endpoint.
    """

    create_message(
        session=session,
        message=MessageCreate(
            role="user",
            content=prompt,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )

    db_messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()

    history = [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in db_messages
    ]

    response = ask_phoenix(history)

    assistant_reply = response.choices[0].message.content

    create_message(
        session=session,
        message=MessageCreate(
            role="assistant",
            content=assistant_reply,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )

    return {
        "response": assistant_reply
    }


def stream_chat(
    session: Session,
    conversation_id: int,
    prompt: str,
    current_user: User,
):
    """
    Streaming chat endpoint.
    """

    # Save user message
    create_message(
        session=session,
        message=MessageCreate(
            role="user",
            content=prompt,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )

    # Load conversation history
    db_messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()

    history = [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in db_messages
    ]

    # Request streaming response
    stream = ask_phoenix(
        history,
        stream=True,
    )

    full_response = ""

    for chunk in stream:

        if not chunk.choices:
            continue

        delta = chunk.choices[0].delta.content

        if delta:

            full_response += delta

            yield delta

    # Save assistant reply
    create_message(
        session=session,
        message=MessageCreate(
            role="assistant",
            content=full_response,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )