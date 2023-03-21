import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useStateCallback } from '../hooks/useStateCallback';

/**
 * 使用Markdown来渲染的消息体 组件
 */
const MsgContent = (props) => {
    const [content, setContent] = useStateCallback('');

    useEffect(() => {
        setContent(props.content, () => props.refreshView());
    }, [props.content]);

    return (
        // 使用Markdown进行代码渲染
        <ReactMarkdown
            children={content}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={vs}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        />
    );
};
export default MsgContent;
