import React, { useState } from "react";
import "./App.css";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import { useEffect } from "react";
import Markdown from "react-markdown";
import axios from "axios";

const App = () => {
  const [code, setCode] = useState("");

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:8080/ai/get-review",
      {
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    setReview(response.data);

    setLoading(false);
  }
  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <button onClick={reviewCode} className="review" disabled={loading}>
            {loading ? "Reviewing" : "Review"}
          </button>
        </div>

        <div className="right">
          {loading ? (
            <p>Please wait... Generating review 🚀</p>
          ) : review ? (
            <Markdown>{review}</Markdown>
          ) : (
            <p>No review yet. Paste your code and click "Review".</p>
          )}
        </div>
      </main>
    </>
  );
};

export default App;


