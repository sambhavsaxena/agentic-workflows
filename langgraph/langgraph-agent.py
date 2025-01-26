"""
Author: Sambhav Saxena
File: langgraph-agent.py
Description:
This script demonstrates the use of Langchain to build a state graph for a chatbot
that integrates with the Anthropic language model and Tavily search tools based on human messages.
"""

from typing import Annotated
from langchain_anthropic import ChatAnthropic
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

class State(TypedDict):
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

tool = TavilySearchResults(max_results=2)
tools = [tool]
llm = ChatAnthropic(model="claude-3-5-sonnet-20240620")
llm_with_tools = llm.bind_tools(tools)

def chatbot(state: State):
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state: State):
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "continue"
    return END

tool_node = ToolNode(tools)

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges(
    "chatbot", 
    should_continue,
    {
        "continue": "tools",
        END: END
    }
)
graph_builder.add_edge("tools", "chatbot")
graph_builder.set_entry_point("chatbot")

graph = graph_builder.compile()

initial_state = {
    "messages": [
        HumanMessage(
            content="What's today's stock price of HDFC Bank on NSE?"
        )
    ]
}

result = graph.invoke(initial_state)
last_message = result["messages"][-1]

print("Content:", last_message.content)
