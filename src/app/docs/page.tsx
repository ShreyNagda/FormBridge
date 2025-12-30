import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TerminalCode from "@/components/shared/terminal-code";
import { APP_URL } from "@/lib/constants";

export default function DocsPage() {
  const htmlExample = `<!-- Simple HTML Form -->
<form action="${APP_URL}/api/submit/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" placeholder="Your email" required>
  <textarea name="message" placeholder="Your message"></textarea>
  <button type="submit">Send</button>
</form>`;

  const jsExample = `// Using Fetch API
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    email: "user@example.com",
    message: "Hello world!"
  };

  try {
    const response = await fetch("${APP_URL}/api/submit/YOUR_FORM_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Form submitted!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};`;

  const reactExample = `import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('${APP_URL}/api/submit/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}`;

  const pythonExample = `import requests

url = "${APP_URL}/api/submit/YOUR_FORM_ID"
data = {
    "email": "user@example.com",
    "message": "Hello from Python!"
}

response = requests.post(url, json=data)

if response.status_code == 200:
    print("Success!")
else:
    print("Error:", response.text)`;

  const curlExample = `curl -X POST ${APP_URL}/api/submit/YOUR_FORM_ID \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "message": "Hello from terminal"}'`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              StaticSend provides a simple API endpoint for your forms. Send a
              POST request to your form URL with any JSON or Form Data payload.
            </p>
          </div>

          <div className="space-y-16">
            <section id="html" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                HTML Form
              </h2>
              <p className="text-gray-600 mb-6">
                The simplest way to use StaticSend. Just set the form action to
                your endpoint URL.
              </p>
              <TerminalCode
                code={htmlExample}
                language="html"
                title="index.html"
              />
            </section>

            <section id="javascript" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                JavaScript / Fetch
              </h2>
              <p className="text-gray-600 mb-6">
                Submit forms asynchronously using the Fetch API. Perfect for
                SPAs or custom validation.
              </p>
              <TerminalCode
                code={jsExample}
                language="javascript"
                title="script.js"
              />
            </section>

            <section id="react" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">React</h2>
              <p className="text-gray-600 mb-6">
                A typical React implementation handling loading and success
                states.
              </p>
              <TerminalCode
                code={reactExample}
                language="javascript"
                title="ContactForm.jsx"
              />
            </section>

            <section id="python" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Python</h2>
              <p className="text-gray-600 mb-6">
                Send submissions from your backend scripts or automation tools.
              </p>
              <TerminalCode
                code={pythonExample}
                language="python"
                title="script.py"
              />
            </section>

            <section id="terminal" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Terminal / cURL
              </h2>
              <p className="text-gray-600 mb-6">
                Test your endpoint directly from the command line.
              </p>
              <TerminalCode
                code={curlExample}
                language="bash"
                title="terminal"
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
