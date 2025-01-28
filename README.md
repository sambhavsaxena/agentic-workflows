# agentic-workflows

Hi community,
I created this repository to experiment with the domain of AI agents, to know what all they can do, and get any fruitful outcomes if possible.

Motivation: [OpenAI's Operator](https://openai.com/index/introducing-operator/)

### A bit of history:
2 years back while browsing youtube, when I came across Indians selling courses about prompt engineering for 99₹, I was well convinced that the concept prompting and creating something useful that solves real world problems is utterly a scam because these people used money (high paying jobs) as the center of attention towards prompt engineering. And cmon, how can something be so handy that you just tell a machine what to do, and, it will do it without efforts. In the end, its just a dumb AI.

Until last week, I came across [bolt.new](https://bolt.new). I used it, and was amazed by the beauty and simplicity of the output it gave:

![image](https://github.com/user-attachments/assets/58d7cef2-457a-4fa8-b29e-8596096d3286)

This got me thinking, how in the world something so powerful that it could eradicate jobs of frontend specialists has already been created and people are still wondering why they're not getting responses for frontend roles they're applying to? Because obviously, to some extent, **they don't need frontend engineers anymore**.

After experiencing this, I jumped on the internet to look for something that replicates what Bolt does. And immediately found [Hkirat](https://www.youtube.com/@harkirat1) making a [Bolt Clone](https://www.youtube.com/watch?v=ofHGE-85EIA).
Later that week, I investigated the project structure and realized that there's not much of new concepts being used, what basically happened behind the scenes was, to my surprise, **Prompt Engineering**.

We have been exposed to artificial intelligence for years, and are surrounded by products like Amazon Echo or Google Voice Assistant, which have been working on closed source AI models for a long time.

After the launch of OpenAI's ChatGPT, access to these models went public. So now, anyone can make a personal Assistant in their premise, providing them exclusive information like account credentials, access to social handles, credit card information, which people otherwise won't have provided to Alexa, or Gemini, because they work on alien platforms. And hence, anyone can now have a service that can do anything in their premise and supervision.

But there are yet many limitations.

These public LLMs can only do small units of work. You need to build a React component? Tell the dumb LLM and it will do it for you. But we don't want to tell them what to do every now and then. We want to create **workflows** these dumb LLMs can use, and get large units of work done **without** human intervention. 

And this is where **AI Agents** come into picture.

![image](https://github.com/user-attachments/assets/5de43609-e695-48da-b918-60b637c9d2d5)

And you know what's the biggest advantage we have as humans? These dumb LLMs understand **natural language** very effectively.
So we can create services that guides these dumb LLMs to understand what we directly want them to understand.

For example: `Hy Agent, plese wrte a sympthetix messge about the terroist attck in Kashmr that happned on 20th Janury, 2025, and post ti on X`.

(Language mistakes are intentional)

Provided that the agent have its tools in place, it will seamlessly understand what I meant, and soon there will be a tweet made on my behalf. Or groceries shopping order, or booking movie tickets, anything a human would have to do manually otherwise.

This is something we will be experimenting here.

### What's the progress?

- I have created something that looks like a service fulfilled by a common dumb AI. Its a random REST call to make a dumb LLM generate an article / story for me. Something that I have already done in [article-ai.js](/article-agent/article-ai.js).

- Next, I created a basic agent which can **understand natural language** and can get us weather information from a free API. Implementation [here](/weather-agent/index.js).
Ref: [Building AI Agent from Scratch](https://www.youtube.com/watch?v=vUYnRGotTbo)

- The above two steps are now combined to create a full-fledged agent that can write a story based on **natural language inputs** and can post them on my blog website using my **login information**, ensuring that these credentials are not exposed to the dumb LLM or on the internet, as it is being executed on my local environment.

Implementation here: [article-agent.js](/article-agent/article-agent.js)

But, did you notice something common among the above two agents?

Both of them have somewhat similar code written for their guiding state machines, the only difference being the [DEVELOPER_PROMPT](/article-agent/prompt.js).

Smart.

Next, let's play around with some real world data. I am thinking of **stock indices**.
