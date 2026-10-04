import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import "./PasswordStrength.css";

// Configuración de animaciones
const CELL = {
  type: "spring",
  stiffness: 520,
  damping: 34,
  mass: 0.45,
};

const CROSSFADE = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.8,
};

const INSTANT = {
  duration: 0,
};

// Patrones considerados débiles o fáciles de adivinar
const COMMON =
  /^(?:password|passw0rd|qwerty|letmein|welcome|admin|iloveyou|monkey|dragon|abc123|111111|123123|123456)/i;

const RUN = /(.)\1{3,}/;

const RUN_UP =
  /(?:0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|qwer|wert|erty|asdf)/i;

const SYMBOL = /[!-/:-@[-`{-~]/;

// Longitud máxima permitida
const MAX_PASSWORD_LENGTH = 50;

// Reglas de validación de contraseña
export const defaultPasswordRules = [
  {
    id: "length",
    label: "8 caracteres o más",
    test: (value) => value.length >= 8,
  },
  {
    id: "case",
    label: "Mayúsculas y minúsculas",
    test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  {
    id: "digit",
    label: "Un número",
    test: (value) => /\d/.test(value),
  },
  {
    id: "symbol",
    label: "Un símbolo (!@#$%...)",
    test: (value) => SYMBOL.test(value),
  },
];

const defaultLabels = ["Vacía", "Débil", "Aceptable", "Buena", "Fuerte"];

// Colores según el nivel de fortaleza
const TONES = {
  none: {
    name: "none",
    bar: "#d6d3d1",
    text: "#78716c",
  },

  danger: {
    name: "danger",
    bar: "#ef4444",
    text: "#dc2626",
  },

  caution: {
    name: "caution",
    bar: "#f59e0b",
    text: "#d97706",
  },

  warning: {
    name: "warning",
    bar: "#ffea00",
    text: "#ca8a04",
  },

  safe: {
    name: "safe",
    bar: "#10b981",
    text: "#059669",
  },
};

function toneFor(score) {
  if (score === 0) return TONES.none;
  if (score === 1) return TONES.danger;
  if (score === 2) return TONES.caution;
  if (score === 3) return TONES.warning;

  return TONES.safe;
}

function PasswordStrength({
  value,
  rules = defaultPasswordRules,
  labels = defaultLabels,
}) {
  const reduced = useReducedMotion();

  const {
    score,
    max,
    rules: evaluated,
    guessable,
    exceedsMaxLength,
  } = useMemo(() => {
    const evalRules = rules.map((rule) => ({
      ...rule,
      met: rule.test(value),
    }));

    const passed = evalRules.reduce(
      (total, rule) => total + (rule.met ? 1 : 0),
      0,
    );

    const isGuessable =
      value.length > 0 &&
      (COMMON.test(value) || RUN.test(value) || RUN_UP.test(value));

    const isTooLong = value.length > MAX_PASSWORD_LENGTH;

    const currentScore =
      value.length === 0
        ? 0
        : isTooLong
          ? 1
          : isGuessable
            ? 1
            : Math.min(rules.length, Math.max(1, passed));

    return {
      score: currentScore,
      max: rules.length,
      rules: evalRules,
      guessable: isGuessable,
      exceedsMaxLength: isTooLong,
    };
  }, [value, rules]);

  const tone = toneFor(score);

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        {Array.from({ length: max }, (_, index) => (
          <div
            key={index}
            className={`password-strength-bar ${
              index < score ? tone.name : ""
            }`}
          />
        ))}
      </div>

      <span className={`password-strength-label ${tone.name}`}>
        {labels[Math.min(score, labels.length - 1)]}
      </span>

      <ul className="password-strength-rules">
        {evaluated.map((rule) => (
          <li key={rule.id}>
            <span
              className={`password-strength-check ${rule.met ? "met" : ""}`}
            >
              {rule.met ? "✓" : ""}
            </span>

            <span>{rule.label}</span>
          </li>
        ))}
      </ul>

      {exceedsMaxLength && (
        <span className="password-strength-error">
          La contraseña no puede superar los 50 caracteres.
        </span>
      )}

      {guessable && !exceedsMaxLength && (
        <span className="password-strength-warning">
          Patrón muy fácil de adivinar.
        </span>
      )}
    </div>
  );
}

export default PasswordStrength;
