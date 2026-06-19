import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req, res) {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido"
        });
    }

    try {

        const { nome, p1, p2, p3, p4, p5 } = req.body;

        const resposta = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
Você é uma IA divertida e amigável.

Faça uma análise personalizada da personalidade da pessoa.

Regras:
- Responda em português do Brasil.
- Seja positivo.
- Use no máximo 3 parágrafos.
- Cite alguns pontos das respostas da pessoa.
- Chame a pessoa pelo nome.
`
                },
                {
                    role: "user",
                    content: `
Nome: ${nome}

1. O que gosta de fazer:
${p1}

2. Lugar que sonha conhecer:
${p2}

3. O que valoriza numa amizade:
${p3}

4. Momento marcante:
${p4}

5. Palavra que define a pessoa:
${p5}
`
                }
            ],
            temperature: 0.8,
            max_tokens: 500
        });

        return res.status(200).json({
            texto: resposta.choices[0].message.content
        });

    } catch (erro) {

        console.error("ERRO GROQ:", erro);

        return res.status(500).json({
            erro: erro.message,
            texto: "Não foi possível gerar a análise."
        });
    }
}