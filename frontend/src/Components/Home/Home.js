import React, { useState } from "react";
import axios from "axios";
import useTypingEffect from "./useTypingEffect";
import "./home.css";
function Home() {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(""); // State for user-specified word count
  const [essay, setEssay] = useState(""); // Initialize as an empty string
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [generatedWordCount, setGeneratedWordCount] = useState(0); // State for calculated word count

  const handleInputChange = (event) => {
    setTopic(event.target.value);
  };

  const handleWordCountChange = (event) => {
    setWordCount(event.target.value);
  };

  const generateEssay = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    if (!wordCount.trim() || isNaN(wordCount) || parseInt(wordCount, 10) <= 0) {
      alert("Please enter a valid word count.");
      return;
    }

    setLoading(true);
    setEssay(""); // Reset essay before generating a new one
    setGeneratedWordCount(0); // Reset generated word count

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Write an essay about ${topic} with approximately ${wordCount} words.`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your OpenAI API key
          },
        }
      );

      const generatedEssay = response.data.choices[0].message.content;
      setEssay(generatedEssay);

      // Calculate word count
      const words = generatedEssay.trim().split(/\s+/).length;
      setGeneratedWordCount(words);
    } catch (error) {
      console.error("Error generating essay:", error);
      alert("Failed to generate essay. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const typedText = useTypingEffect(essay || "", 2);

  const handleCopy = () => {
    if (!essay) {
      return;
    }
    navigator.clipboard
      .writeText(essay)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  return (
    <div className="container">
      <h1 className="topic">Quick Essay Generator</h1>

      {typedText && (
        <div>
     
          <p>{typedText}</p>
          <button onClick={handleCopy}>Copy</button>
          {copySuccess && <span>{copySuccess}</span>}
        </div>
      )}
      {generatedWordCount > 0 && (
        <div>
          <h3>Generated Word Count: {generatedWordCount}</h3>
        </div>
      )}

      <div className="actionset">
        <div>
          <input
            type="text"
            className="input-style margin"
            value={topic}
            onChange={handleInputChange}
            placeholder="Enter your essay topic..."
          />
        </div>

        <div className="word_gen">
          <input
            type="number"
            className="input-style"
            value={wordCount}
            onChange={handleWordCountChange}
            placeholder="Enter desired word count..."
          />
          <div>
            <button onClick={generateEssay} class="btn">
              <svg
                height="24"
                width="24"
                fill="#FFFFFF"
                viewBox="0 0 24 24"
                data-name="Layer 1"
                id="Layer_1"
                class="sparkle"
              >
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
              </svg>

              <span class="text">{loading ? "Generating..." : "Generate"}</span>
            </button>
          </div>
        </div>
        <p className="my_d">© 2024 Mr.Dila All rights reserved </p>
      </div>
    </div>
  );
}

export default Home;
