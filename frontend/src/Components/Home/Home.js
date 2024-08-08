import React, { useState } from 'react';
import axios from 'axios';
import useTypingEffect from './useTypingEffect';

function Home() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(''); // State for user-specified word count
  const [essay, setEssay] = useState('');  // Initialize as an empty string
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [generatedWordCount, setGeneratedWordCount] = useState(0); // State for calculated word count

  const handleInputChange = (event) => {
    setTopic(event.target.value);
  };

  const handleWordCountChange = (event) => {
    setWordCount(event.target.value);
  };

  const generateEssay = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic.');
      return;
    }

    if (!wordCount.trim() || isNaN(wordCount) || parseInt(wordCount, 10) <= 0) {
      alert('Please enter a valid word count.');
      return;
    }

    setLoading(true);
    setEssay('');  // Reset essay before generating a new one
    setGeneratedWordCount(0); // Reset generated word count

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Write an essay about ${topic} with approximately ${wordCount} words.` }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
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
      console.error('Error generating essay:', error);
      alert('Failed to generate essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typedText = useTypingEffect(
    essay || 'Enter your topic and word count, then click generate button',
    2
  );

  const handleCopy = () => {
    if (!essay) {
      return;
    }
    navigator.clipboard.writeText(essay)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>QuickEssay Generator</h1>
      <input
        type="text"
        value={topic}
        onChange={handleInputChange}
        placeholder="Enter your essay topic..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <input
        type="number"
        value={wordCount}
        onChange={handleWordCountChange}
        placeholder="Enter desired word count..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={generateEssay}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#4CAF50',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Essay'}
      </button>
      {typedText && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
            position: 'relative',
          }}
        >
          <h2>Generated Essay</h2>
          <p>{typedText}</p>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '5px 10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#007BFF',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
          {copySuccess && (
            <span
              style={{
                position: 'absolute',
                top: '45px',
                right: '10px',
                color: 'green',
              }}
            >
              {copySuccess}
            </span>
          )}
        </div>
      )}
      {generatedWordCount > 0 && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            backgroundColor: '#f1f1f1',
            textAlign: 'center',
          }}
        >
          <h3>Generated Word Count: {generatedWordCount}</h3>
        </div>
      )}
    </div>
  );
}

export default Home;
