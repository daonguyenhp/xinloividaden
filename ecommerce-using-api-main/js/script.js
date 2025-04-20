// document.getElementById("chatbot-send").addEventListener("click", async function () {
//     let message = document.getElementById("chatbot-input").value;
//     if (message.trim() !== "") {
//         // Hiển thị tin nhắn của người dùng
//         displayMessage("User: " + message);

//         // Gửi tin nhắn tới GPT-3 và nhận phản hồi
//         let response = await sendMessageToGPT3(message);
        
//         // Hiển thị tin nhắn chatbot
//         displayMessage("Chatbot: " + response);
//     }
//     document.getElementById("chatbot-input").value = ""; // Xóa input
// });

// // Hàm hiển thị tin nhắn
// function displayMessage(message) {
//     let messageContainer = document.getElementById("chatbot-messages");
//     let messageElement = document.createElement("div");
//     messageElement.textContent = message;
//     messageContainer.appendChild(messageElement);
//     messageContainer.scrollTop = messageContainer.scrollHeight; // Cuộn xuống cuối
// }

// // Gửi tin nhắn tới API của GPT-3
// async function sendMessageToGPT3(message) {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": "Bearer <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>",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           "model": "deepseek/deepseek-v3-base:free",
//           "messages": [
//             {
//               "role": "user",
//               "content": "What is the meaning of life?"
//             }
//           ]
//         })
//       });
    
//     const data = await response.json();
//     return data.choices[0].text;
// }


// import OpenAI from "openai";
// const client = new OpenAI();

// const response = await client.responses.create({
//     model: "gpt-4.1",
//     input: "Write a one-sentence bedtime story about a unicorn.",
// });

// console.log(response.output_text);

// document.getElementById("chatbot-send").addEventListener("click", async function () {
//     let message = document.getElementById("chatbot-input").value;
//     if (message.trim() !== "") {
//         // Hiển thị tin nhắn của người dùng
//         displayMessage("User: " + message);

//         // Sử dụng đoạn hội thoại mẫu thay vì gọi API OpenAI
//         let response = getMockedResponse(message);
        
//         // Hiển thị tin nhắn chatbot
//         displayMessage("Chatbot: " + response);
//     }
//     document.getElementById("chatbot-input").value = ""; // Xóa input
// });

// // Hàm hiển thị tin nhắn
// function displayMessage(message) {
//     let messageContainer = document.getElementById("chatbot-messages");
//     let messageElement = document.createElement("div");
//     messageElement.textContent = message;
//     messageContainer.appendChild(messageElement);
//     messageContainer.scrollTop = messageContainer.scrollHeight; // Cuộn xuống cuối
// }

// // Hàm trả về phản hồi giả lập (mocked response)
// function getMockedResponse(message) {
//     // Các phản hồi mẫu (mocked conversation)
//     const mockResponses = {
//         "hello": "Hi! How can I assist you today?",
//         "how are you": "I'm doing great, thank you! How about you?",
//         "buy shirt": "Sure! We have a variety of shirts. What size are you looking for?",
//         "thanks": "You're welcome! Let me know if you need anything else.",
//         "default": "I'm sorry, I don't understand that. Can you please rephrase?"
//     };

//     // Tìm kiếm phản hồi dựa trên nội dung tin nhắn người dùng
//     message = message.toLowerCase().trim();
//     return mockResponses[message] || mockResponses["default"];
// }


// document.getElementById("chatbot-send").addEventListener("click", async function () {
//     let message = document.getElementById("chatbot-input").value;
//     if (message.trim() !== "") {
//         // Hiển thị tin nhắn của người dùng
//         displayMessage("User: " + message);

//         // Sử dụng đoạn hội thoại mẫu thay vì gọi API OpenAI
//         let response = await sendMessageToGemini(message);
        
//         // Hiển thị tin nhắn chatbot
//         displayMessage("Chatbot: " + response);
//     }
//     document.getElementById("chatbot-input").value = ""; // Xóa input
// });

// // Hàm hiển thị tin nhắn
// function displayMessage(message) {
//     let messageContainer = document.getElementById("chatbot-messages");
//     let messageElement = document.createElement("div");
//     messageElement.textContent = message;
//     messageContainer.appendChild(messageElement);
//     messageContainer.scrollTop = messageContainer.scrollHeight; // Cuộn xuống cuối
// }

// // Gửi tin nhắn tới Gemini API
// async function sendMessageToGemini(message) {
//     const response = await fetch("https://gemini-api-endpoint-url", { // Đây là endpoint giả lập, thay thế với URL thực tế của Gemini API
//         method: "POST",
//         headers: {
//             "Authorization": "AIzaSyAwJBZjQPh96mhWqpCNv_DtPnScio8cJEE", // Thay YOUR_API_KEY bằng API key của bạn từ Gemini
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             query: message,
//             languageCode: 'en' // Hoặc ngôn ngữ bạn muốn
//         })
//     });
    
//     const data = await response.json();
//     return data.reply; // Dựa trên cấu trúc phản hồi của Gemini API, thay đổi nếu cần
// }


document.getElementById("chatbot-send").addEventListener("click", async function () {
    let message = document.getElementById("chatbot-input").value;
    if (message.trim() !== "") {
        // Display user's message
        displayMessage("You: " + message);
  
        // Send message to ChatGPT and get the response
        let response = await sendMessageToChatGPT(message);
  
        // Display ChatGPT's response
        displayMessage("ChatGPT: " + response);
        
        // Clear input field
        document.getElementById("chatbot-input").value = "";
    }
  });
  
  // Function to display messages in the chat
  function displayMessage(message) {
    let messageContainer = document.getElementById("chatbot-messages");
    let messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
  }
  
  // Function to send a message to the OpenRouter API and get the response
  async function sendMessageToChatGPT(message) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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", // Replace with your actual API key
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {
                    "role": "user",
                    "content": message,
                }
            ]
        })
    });
  
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }
  
