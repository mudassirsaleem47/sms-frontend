const { processChatQuery, generateResponseWithFunctionResult } = require('../services/gemini-service');
const { executeFunctionCall } = require('../services/ai-functions');

// Process chat query
const chat = async (req, res) => {
    try {
        const { query, conversationHistory = [] } = req.body;
        const { schoolId } = req.params;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        // Process query with Gemini
        const geminiResponse = await processChatQuery(query, schoolId, conversationHistory);

        // If function calling is needed
        if (geminiResponse.needsFunctionCall) {
            const { name: functionName, args } = geminiResponse.functionCall;

            // Execute the function
            const functionResult = await executeFunctionCall(functionName, args, schoolId);

            // Generate natural language response with function result
            const finalResponse = await generateResponseWithFunctionResult(
                query,
                functionName,
                functionResult,
                conversationHistory
            );

            return res.status(200).json({
                success: true,
                response: finalResponse.response,
                data: functionResult,
                conversationHistory: finalResponse.conversationHistory,
                functionCalled: functionName
            });
        }

        // If no function calling needed, return text response
        return res.status(200).json({
            success: true,
            response: geminiResponse.textResponse,
            conversationHistory: geminiResponse.conversationHistory
        });

    } catch (error) {
        console.error('Error in chat controller:', error);
        
        // User-friendly error messages
        let errorMessage = 'Sorry, I encountered an error processing your request.';
        
        if (error.message?.includes('API key')) {
            errorMessage = 'AI service configuration error. Please contact administrator.';
        } else if (error.message?.includes('quota')) {
            errorMessage = 'AI service quota exceeded. Please try again later.';
        } else if (error.message?.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get chat suggestions
const getSuggestions = async (req, res) => {
    try {
        const suggestions = [
            {
                category: 'Students',
                queries: [
                    'How many students are enrolled?',
                    'Show me all active students',
                    'List students in Class 10'
                ]
            },
            {
                category: 'Staff',
                queries: [
                    'How many teachers do we have?',
                    'Show me all staff members',
                    'List all active teachers'
                ]
            },
            {
                category: 'Fees',
                queries: [
                    'What is the total fee collection?',
                    'Show pending fee payments',
                    'Fee statistics for this month'
                ]
            },
            {
                category: 'General',
                queries: [
                    'Show system statistics',
                    'List all campuses',
                    'How many classes do we have?'
                ]
            }
        ];

        res.status(200).json({
            success: true,
            suggestions
        });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching suggestions'
        });
    }
};

module.exports = {
    chat,
    getSuggestions
};
