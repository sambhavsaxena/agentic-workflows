LangGraph is a Python library for creating stateful, multi-agent applications with large language models (LLMs), designed to build agent and multi-agent workflows. It provides fine-grained control over agent applications' flow and state, offering features like memory persistence (storing conversation context) and human-in-the-loop workflows (allowing for interruptions and manual adjustments). LangGraph is inspired by Pregel and Apache Beam and is built on LangChain, though it can be used independently, which I aim to do with these experiments.

The library integrates seamlessly with LangChain and LangSmith but does not require them. It also supports advanced features like streaming, asynchronous agent execution, and handling complex scenarios like "double texting" (when two messages are sent before an agent responds). LangGraph Platform, a commercial solution, extends the library to support deployment, debugging, and monitoring of applications in production.

LangGraph is flexible, allowing users to build custom agent architectures, such as tool-calling agents, through simple or low-level implementations.

But I plan to hardcode the entire LangGraph for now, lol.

For now, I have used [Tavily Search](https://tavily.com/) in order to connect the dumb LLM to the internet, further adding [nodes](/langgraph/langgraph-agent.py) so as to replicate a state machine, which can then replicate the workflows in accordance with Turing's concepts.

![image](https://github.com/user-attachments/assets/23e30385-d169-4712-8f1a-bea8d371a964)

Here's how it looks in working:

https://github.com/user-attachments/assets/91ec2f22-4946-47af-a315-5462a16a77b5

