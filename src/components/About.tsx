import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "./About.scss";
import { useAppProvider } from "../providers/app_provider";
import { useNavigate } from "react-router-dom";

export default function About() {
    const [markdown, setMarkdown] = useState("");
    const { setInApp } = useAppProvider();
    const navigate = useNavigate();

    useEffect(() => {
        setInApp(false);
        fetch("/README.md")
            .then((res) => res.text())
            .then(setMarkdown);
    }, []);

    // Extend the sanitize schema to allow <details> and <summary>
    const schema = {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            "details",
            "summary",
            "figure",
            "figcaption",
        ],
        attributes: {
            ...(defaultSchema.attributes || {}),
            details: ["open"],
            figure: ["class", "style"],
            figcaption: ["class", "style"],
            img: ["src", "alt", "style", "class"],
        },
    };

    return (
        <div className="about-container">
            <div className="about-topbar">
                <div className="logo" onClick={() => navigate("/home")}>
                    silo.
                </div>
            </div>
            <div className="content">
                <article className="markdown-body">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeSanitize, schema]]}
                        components={{
                            details: ({ node, ...props }) => <details {...props} />,
                            summary: ({ node, ...props }) => <summary {...props} />,
                            figure: ({ node, ...props }) => <figure {...props} />,
                            figcaption: ({ node, ...props }) => <figcaption {...props} />,
                        }}
                    >
                        {markdown}
                    </ReactMarkdown>
                    <div className="spacer"></div>
                </article>
            </div>
        </div>
    );
}
