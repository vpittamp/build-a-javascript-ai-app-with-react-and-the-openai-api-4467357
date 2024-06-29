import PropTypes from "prop-types";

const PromptToLocation = (prompt) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-3.5-turbo-0613",
    messages: [{ role: "user", content: prompt }],
    functions: [
      {
        type: "function",
        function: {
          name: "search_query",
          description:
            "Execute a search query on the Microsoft Graph API to find messages based on user-defined criteria.",
          parameters: {
            type: "object",
            properties: {
              requestBody: {
                type: "object",
                description:
                  "The body of the search request containing the KQL query string.",
              },
              properties: {
                query: {
                  type: "string",
                  description:
                    "The KQL query string for searching messages, possibly using XRANK for boosting.",
                },
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    function_call: "auto",
  };

  const params = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  };

  return fetch(url, params)
    .then((response) => response.json())
    .then((data) => {
      const promptRes = JSON.parse(
        data.choices[0].message.function_call.arguments
      );
      console.log(promptRes);

      const promptData = {
        query: promptRes.query,
      };

      return promptData;
    })
    .catch((error) => {
      console.log("Error:", error);
      return Promise.reject(
        "Unable to identify a query from your question. Please try again."
      );
    });
};

PromptToLocation.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default PromptToLocation;
