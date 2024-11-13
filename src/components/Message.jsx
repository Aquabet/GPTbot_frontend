import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "../styles/Message.css";
import { CopyOutlined } from "@ant-design/icons";

const CodeBlock = ({ value, language }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  return (
    <div className="code-block-container">
      {language && <div className="code-language-tag">{language}</div>}
      <pre className="code-block">{value}</pre>
      <button className="copy-button" onClick={handleCopy} title="Copy code">
        <CopyOutlined />
      </button>
    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`message ${isUser ? "user-message" : "assistant-message"}`}>
      <div className="icon">{isUser ? "😊" : "🤖"}</div>
      <div className="message-content">
        <ReactMarkdown
          className="markdown-content"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: ({ inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <CodeBlock
                  value={String(children).replace(/\n$/, "")}
                  language={match ? match[1] : "plaintext"}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string,
};

export default Message;
