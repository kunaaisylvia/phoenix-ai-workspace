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


def ask_phoenix(messages: list):
    """
    Sends the conversation history to Groq.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[SYSTEM_PROMPT] + messages,
        temperature=0.7,
    )

    return response.choices[0].message.content


def chat(
    session: Session,
    conversation_id: int,
    prompt: str,
    current_user: User,
):
    """
    Complete Phoenix chat workflow.
    """

    # -----------------------------
    # Save user message
    # -----------------------------
    create_message(
        session=session,
        message=MessageCreate(
            role="user",
            content=prompt,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )

    # -----------------------------
    # Load conversation history
    # -----------------------------
    db_messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()

    # -----------------------------
    # Convert history for Groq
    # -----------------------------
    history = [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in db_messages
    ]

    # -----------------------------
    # Ask Phoenix
    # -----------------------------
    assistant_reply = ask_phoenix(history)

    # -----------------------------
    # Save assistant response
    # -----------------------------
    create_message(
        session=session,
        message=MessageCreate(
            role="assistant",
            content=assistant_reply,
            conversation_id=conversation_id,
        ),
        current_user=current_user,
    )

    # -----------------------------
    # Return response
    # -----------------------------
    return {
        "response": assistant_reply
    }