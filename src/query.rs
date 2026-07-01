use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct LlmRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(Deserialize)]
struct LlmResponse {
    response: String,
}

pub async fn synthesize(
    question: &str,
    chunks: &[(f32, String, String)], // (score, path, content)
    endpoint: &str,
    model: &str,
) -> Result<String> {
    let client = Client::new();

    let context = chunks
        .iter()
        .enumerate()
        .map(|(i, (score, path, content))| {
            format!(
                "[{}] (score: {:.2}) from {}\n{}",
                i + 1,
                score,
                path,
                content
            )
        })
        .collect::<Vec<_>>()
        .join("\n\n");

    let prompt = format!(
        "You are a personal memory assistant. The user is asking about their own files, \
        notes, and shell history. Answer their question directly and concisely based only \
        on the context provided. If the context does not contain enough information, say so.\n\n\
        Question: {}\n\n\
        Context from their machine:\n{}\n\n\
        Answer:",
        question, context
    );

    let url = format!("{}/api/generate", endpoint);

    let response = client
        .post(&url)
        .json(&LlmRequest {
            model: model.to_string(),
            prompt,
            stream: false,
        })
        .send()
        .await?;

    let llm_response: LlmResponse = response.json().await?;
    Ok(llm_response.response.trim().to_string())
}