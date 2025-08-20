  import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI, Type } from "@google/genai";


// The client gets the API key from the environment variable `GEMINI_API_KEY`.

const ai = new GoogleGenAI({
    apiKey:"AIzaSyBQOOJikVwAeX9bgafpsJ0neEhT-Bbar_M",
});

export async function generateContentList(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `research: You are a helpful assistant. Please provide a list of content based on the following prompt : ${prompt}`,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: { // ✅ must be `responseSchema` not `responseJsonSchema`
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
          },
          list_of_content: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
        propertyOrdering: ["title", "list_of_content"], // Optional, keeps JSON key order
      },
    },
  });
 // console.log(response.content.parts[0].text);
  
  return JSON.parse(response.candidates[0].content.parts[0].text);
}

export async function generateCoreContent(topic,item){
    const response =await ai.models.generateContent({
         model: "gemini-2.5-flash",
        contents: `research: You are a helpful assistant. Please provide the core content based for the topic given and in html format : ${item}`,
        config: {
            systemInstruction:`The previous response is a list of content in the topic ${topic} and from that you have to generate the content of the topic from the list ${item} . The content that are send should be formatted in html format and should be correctly aligned by utilizing the tags like <h1>,<h2>,<p> etc. The content should be in a way that it can be used as a blog post or article. The content should be well structured and should have proper headings and subheadings.`,
            responseMimeType: "application/json",
            responseJsonSchema: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                    },
                    content: {
                        type: Type.STRING,
                    },
                },
                propertyOrdering: ["title", "content"],
            },
        },
    })
    return JSON.parse(response.candidates[0].content.parts[0].text);
}
