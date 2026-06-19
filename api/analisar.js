import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
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

    const { nome, p1, p2, p3, p4, p5 } = req.body;

    try {

        const resposta = await client.responses.create({
            model: "gpt-5",
            input: `
Você é uma IA divertida.

Nome: ${nome}

Respostas:

1. ${p1}
2. ${p2}
3. ${p3}
4. ${p4}
5. ${p5}

Faça uma análise divertida, positiva e personalizada da personalidade da pessoa.

Escreva em português do Brasil.
`
        });

        return res.status(200).json({
            texto: resposta.output_text
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: erro.message,
            texto: "Não foi possível analisar as respostas."
        });
    }
}