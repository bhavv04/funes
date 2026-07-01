use anyhow::{anyhow, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};

pub struct Embedder {
    client: Client,
    endpoint: String,
    model: String,
}

#[derive(Serialize)]
struct EmbedRequest {
    model: String,
    prompt: String,
}

#[derive(Deserialize)]
struct EmbedResponse {
    embedding: Vec<f32>,
}

impl Embedder {
    pub fn new(endpoint: &str, model: &str) -> Self {
        Embedder {
            client: Client::new(),
            endpoint: endpoint.to_string(),
            model: model.to_string(),
        }
    }

    pub async fn embed(&self, text: &str) -> Result<Vec<f32>> {
        let url = format!("{}/api/embeddings", self.endpoint);

        let response = self
            .client
            .post(&url)
            .json(&EmbedRequest {
                model: self.model.clone(),
                prompt: text.to_string(),
            })
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!(
                "Ollama returned error: {}",
                response.status()
            ));
        }

        let embed_response: EmbedResponse = response.json().await?;

        if embed_response.embedding.is_empty() {
            return Err(anyhow!("Ollama returned empty embedding"));
        }

        Ok(embed_response.embedding)
    }

    pub fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
        let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
        let mag_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
        let mag_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();

        if mag_a == 0.0 || mag_b == 0.0 {
            return 0.0;
        }

        dot / (mag_a * mag_b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cosine_similarity_identical_vectors() {
        let a = vec![1.0, 0.0, 0.0];
        let b = vec![1.0, 0.0, 0.0];
        let score = Embedder::cosine_similarity(&a, &b);
        assert!((score - 1.0).abs() < 1e-6);
    }

    #[test]
    fn test_cosine_similarity_opposite_vectors() {
        let a = vec![1.0, 0.0];
        let b = vec![-1.0, 0.0];
        let score = Embedder::cosine_similarity(&a, &b);
        assert!((score - (-1.0)).abs() < 1e-6);
    }

    #[test]
    fn test_cosine_similarity_zero_vector() {
        let a = vec![0.0, 0.0];
        let b = vec![1.0, 0.0];
        let score = Embedder::cosine_similarity(&a, &b);
        assert_eq!(score, 0.0);
    }

    #[test]
    fn test_cosine_similarity_orthogonal_vectors() {
        let a = vec![1.0, 0.0];
        let b = vec![0.0, 1.0];
        let score = Embedder::cosine_similarity(&a, &b);
        assert!((score - 0.0).abs() < 1e-6);
    }
}