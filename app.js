"use strict";

const inputText = document.querySelector("#inputText");
const outputText = document.querySelector("#outputText");
const removeMarkdown = document.querySelector("#removeMarkdown");
const fixSpacing = document.querySelector("#fixSpacing");
const removeHidden = document.querySelector("#removeHidden");
const cleanButton = document.querySelector("#cleanButton");
const copyButton = document.querySelector("#copyButton");
const clearButton = document.querySelector("#clearButton");
const status = document.querySelector("#status");

function removeCommonMarkdown(text) {
  return text
    // Remove Markdown headings.
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")

    // Remove bold and italic markers.
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")

    // Remove strikethrough markers.
    .replace(/~~(.*?)~~/g, "$1")

    // Remove blockquote markers.
    .replace(/^\s*>\s?/gm, "")

    // Remove horizontal separator lines.
    .replace(/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/gm, "")

    // Remove inline-code markers.
    .replace(/`([^`]+)`/g, "$1");
}

function normalizeSpacing(text) {
  return text
    // Remove trailing spaces from lines.
    .replace(/[ \t]+$/gm, "")

    // Replace repeated spaces or tabs with one space.
    .replace(/[ \t]{2,}/g, " ")

    // Limit consecutive blank lines.
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

function removeHiddenCharacters(text) {
  return text
    // Remove common zero-width characters.
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")

    // Convert non-breaking spaces into normal spaces.
    .replace(/\u00A0/g, " ");
}

function cleanText(text) {
  let result = text;

  if (removeHidden.checked) {
    result = removeHiddenCharacters(result);
  }

  if (removeMarkdown.checked) {
    result = removeCommonMarkdown(result);
  }

  if (fixSpacing.checked) {
    result = normalizeSpacing(result);
  }

  return result;
}

cleanButton.addEventListener("click", () => {
  if (!inputText.value.trim()) {
    outputText.value = "";
    status.textContent = "Paste some text before cleaning.";
    return;
  }

  outputText.value = cleanText(inputText.value);
  status.textContent = "Text cleaned.";
});

copyButton.addEventListener("click", async () => {
  if (!outputText.value) {
    status.textContent = "There is no cleaned text to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    status.textContent = "Cleaned text copied.";
  } catch {
    outputText.focus();
    outputText.select();
    status.textContent = "Select the text and copy it manually.";
  }
});

clearButton.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  status.textContent = "";
  inputText.focus();
});
