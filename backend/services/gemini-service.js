const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function declarations for Gemini Function Calling
const functions = [
    {
        name: "getStudents",
        description: "Get list of students with optional filters like status, class, or campus",
        parameters: {
            type: "object",
            properties: {
                status: { 
                    type: "string", 
                    enum: ["active", "inactive", "all"],
                    description: "Filter by student status" 
                },
                className: { 
                    type: "string",
                    description: "Filter by class name" 
                },
                campus: {
                    type: "string",
                    description: "Filter by campus name"
                },
                limit: { 
                    type: "number",
                    description: "Maximum number of students to return" 
                }
            }
        }
    },
    {
        name: "getStaff",
        description: "Get list of staff members with optional filters",
        parameters: {
            type: "object",
            properties: {
                status: { 
                    type: "string", 
                    enum: ["active", "inactive", "all"],
                    description: "Filter by staff status" 
                },
                designation: {
                    type: "string",
                    description: "Filter by designation name"
                },
                campus: {
                    type: "string",
                    description: "Filter by campus name"
                }
            }
        }
    },
    {
        name: "getClasses",
        description: "Get list of classes/sections",
        parameters: {
            type: "object",
            properties: {
                campus: {
                    type: "string",
                    description: "Filter by campus name"
                }
            }
        }
    },
    {
        name: "getFeeStatistics",
        description: "Get fee collection statistics and pending fees information",
        parameters: {
            type: "object",
            properties: {
                campus: {
                    type: "string",
                    description: "Filter by campus name"
                }
            }
        }
    },
    {
        name: "getCampuses",
        description: "Get list of all campuses with their statistics",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "getDesignations",
        description: "Get list of all staff designations",
        parameters: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    enum: ["active", "inactive", "all"],
                    description: "Filter by designation status"
                }
            }
        }
    },
    {
        name: "getSystemStats",
        description: "Get overall system statistics including total students, staff, classes, etc.",
        parameters: {
            type: "object",
            properties: {}
        }
    }
];

// Process chat query with Gemini
async function processChatQuery(query, schoolId, conversationHistory = []) {
    try {
        // Use gemini-1.5-flash for function calling support
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            tools: [{ functionDeclarations: functions }]
        });

        // Build conversation history
        const history = conversationHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
        }));

        // Add system context
        const systemContext = `You are an AI assistant for a School Management System. 
        You help users query and manage school data including students, staff, classes, fees, and campuses.
        Be helpful, concise, and professional. When presenting data, format it clearly.
        The school ID is: ${schoolId}`;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemContext }] },
                { role: "model", parts: [{ text: "I understand. I'm ready to help with school management queries." }] },
                ...history
            ]
        });

        const result = await chat.sendMessage(query);
        const response = result.response;

        // Check if function calling is needed
        const functionCalls = response.functionCalls();
        const functionCall = functionCalls?.[0];
        
        return {
            needsFunctionCall: !!functionCall,
            functionCall: functionCall,
            textResponse: !functionCall ? response.text() : '',
            conversationHistory: [
                ...conversationHistory,
                { role: "user", content: query }
            ]
        };
    } catch (error) {
        console.error('Error processing chat query:', error);
        console.error('Error details:', error.message);
        throw new Error(`AI service error: ${error.message}`);
    }
}

// Generate response after function execution
async function generateResponseWithFunctionResult(query, functionName, functionResult, conversationHistory = []) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `User asked: "${query}"
        
I executed the function "${functionName}" and got this result:
${JSON.stringify(functionResult, null, 2)}

Please provide a natural, helpful response to the user based on this data. 
Format the response clearly and professionally. If it's a list, present it in a readable format.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return {
            response,
            conversationHistory: [
                ...conversationHistory,
                { role: "user", content: query },
                { role: "model", content: response }
            ]
        };
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error(`AI response generation error: ${error.message}`);
    }
}

module.exports = {
    processChatQuery,
    generateResponseWithFunctionResult,
    functions
};
