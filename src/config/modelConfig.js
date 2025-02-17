// src/config/modelConfig.js

const modelConfig = {
  openai: {
    displayName: "OpenAI",
    models: [
      { modelName: "gpt-4o-mini", displayName: "GPT-4o-Mini, 🌗" },
      { modelName: "o1-mini", displayName: "GPT-o1-Mini, 🌕🌗" },
      { modelName: "gpt-4o", displayName: "GPT-4o, 🌕🌕🌗" },
      
    ]
  },
  deepseek: {
    displayName: "DeepSeek",
    models: [
      { modelName: "deepseek-chat", displayName: "DeepSeek-V3, 🌕" },
      { modelName: "deepseek-reasoner", displayName: "DeepSeek-R1, 🌕🌕" }
    ]
  }
};

export default modelConfig;
