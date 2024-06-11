require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "hello world"
    });
});

// Helper function to generate content using Google Generative AI
async function generateContent(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

// Function to generate resume content using prompts
async function run(fullName, currentPosition, currentLength, currentTechnologies, workArray, projectArray) {
    const remainderText = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++) {
            stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
        }
        return stringText;
    };

    const projectText = () => {
        let stringText = "";
        for (let i = 0; i < projectArray.length; i++) {
            stringText += `Project Title: ${projectArray[i].title}, Tech Stack: ${projectArray[i].techStack}, Description: ${projectArray[i].description}. `;
        }
        return stringText;
    };

    // Define prompts
    const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technologies: ${currentTechnologies}. Can you write a 100 words description for the top of the resume (first person writing)?`;
    const prompt2 = `I am updating my resume with my latest achievements. My name is ${fullName}, and I currently hold the position of ${currentPosition} with ${currentLength} years of experience. I specialize in the following technologies: ${currentTechnologies}. Can you provide three key points (30 words for each) highlighting my skills? Please use bold text for emphasis and refrain from using any special characters.`;
    const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n During my years, I worked at ${workArray.length} companies. ${remainderText()} \n Can you write me 30 words for each company (separated in numbers) of my succession in the company (in first person)? Provide only 3 points, and do not add any numbering or special characters.`;
    const prompt4 = `I am writing a resume with my projects. My details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I worked on the following projects: ${projectText()} Can you provide a summary (30 words) for each project?`;
    
    // Generate content for each prompt
    const objective = await generateContent(prompt1);
    const keypoints = await generateContent(prompt2);
    const jobResponsibilities = await generateContent(prompt3);
    const projectSummaries = await generateContent(prompt4);

    // Return generated content
    return { objective, keypoints, jobResponsibilities, projectSummaries };
}

app.post("/resume/create", async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        github,
        gmail,
        portfolio,
        linkedin,
        mobileNumber,
        workHistory,
        educationHistory,
        projectHistory
    } = req.body;

    const workArray = JSON.parse(workHistory);
    const educationArray = JSON.parse(educationHistory);
    const projectArray = JSON.parse(projectHistory);
    let database = [];

    const newEntry = {
        id: uuidv4(),
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        github,
        gmail,
        portfolio,
        linkedin,
        mobileNumber,
        workHistory: workArray,
        educationHistory: educationArray,
        projectHistory: projectArray,
    };

    database.push(newEntry);

    // Generate content using Google Generative AI
    const generatedContent = await run(fullName, currentPosition, currentLength, currentTechnologies, workArray, projectArray);

    // Log generated content
    console.log(generatedContent);

    res.json({
        message: "Request Successful!!",
        data: newEntry,
        generatedContent
    });
});

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
