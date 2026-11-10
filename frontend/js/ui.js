// Utilidades da interface: avisos para o leitor de tela, vibracao, formatacao.

import { config } from "./config.js";

export const $ = (seletor) => document.querySelector(seletor);
export const $$ = (seletor) => [...document.querySelectorAll(seletor)];

/** Fala para o leitor de tela (TalkBack / VoiceOver) sem mudar o visual. */
export function anunciar(mensagem) {
  const regiao = $("#anuncio");
  if (!regiao) return;
  regiao.textContent = "";
  // o leitor de tela so relê quando o conteudo muda de fato
  setTimeout(() => { regiao.textContent = mensagem; }, 60);
}

export function vibrar(padrao = 30) {
  // Executa se a vibração estiver ativada nos ajustes (ou se não estiver explicitamente desligada)
  if (config?.vibrar === false) return;

  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(padrao);
    } catch (erro) {
      console.warn("Não foi possível vibrar o dispositivo:", erro);
    }
  }
}

export function mostrarErro(mensagem) {
  const caixa = $("#erro");
  caixa.textContent = mensagem;
  caixa.hidden = false;
  anunciar(`Erro. ${mensagem}`);
}

export function limparErro() {
  const caixa = $("#erro");
  caixa.hidden = true;
  caixa.textContent = "";
}

export function etiqueta(texto) {
  const span = document.createElement("span");
  span.className = "etiqueta";
  span.textContent = texto;
  return span;
}

export function dataLegivel(iso) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function segundos(ms) {
  return `${(ms / 1000).toFixed(1)} s`;
}

/** Aplica tema, contraste e tamanho de fonte guardados nos ajustes. */
export function aplicarAparencia() {
  const raiz = document.documentElement;
  const escuroDoSistema = matchMedia("(prefers-color-scheme: dark)").matches;
  const tema = config.tema === "auto" ? (escuroDoSistema ? "escuro" : "claro") : config.tema;
  raiz.dataset.tema = tema;
  if (config.contraste) raiz.dataset.contraste = "alto";
  else delete raiz.dataset.contraste;
  raiz.style.setProperty("--escala-fonte", String(config.escalaFonte || 1));
  const botao = $("#btn-tema");
  if (botao) {
    botao.textContent = tema === "escuro" ? "☀️" : "🌙";
    botao.setAttribute(
      "aria-label",
      tema === "escuro" ? "Mudar para o tema claro" : "Mudar para o tema escuro"
    );
  }
  const cor = document.querySelector('meta[name="theme-color"]');
  if (cor) cor.content = tema === "escuro" ? "#0e1512" : "#0f7b3e";
}

export const CATEGORIAS = [
  ["salas-de-aula", "Salas de aula"],
  ["laboratorios", "Laboratórios"],
  ["corredores", "Corredores"],
  ["biblioteca", "Biblioteca"],
  ["areas-externas", "Áreas externas"],
  ["cartazes", "Cartazes"],
  ["material-didatico", "Material didático"],
  ["outros", "Outros"],
];

export const rotuloCategoria = (id) =>
  CATEGORIAS.find(([chave]) => chave === id)?.[1] || id;