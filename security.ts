/**
 * ⚠️ FICHIER DE TEST UNIQUEMENT
 * Ce fichier contient des vulnérabilités de sécurité INTENTIONNELLES
 * pour tester un outil de code review sécurité. NE PAS utiliser en production.
 * À supprimer après les tests.
 */

// ========== 1. Credentials en dur ==========
const API_KEY = 'sk_live_abc123xyz789_secret_key_do_not_share';
const DB_PASSWORD = 'SuperSecretP@ssw0rd!';
const JWT_SECRET = 'my-jwt-secret-change-in-production';

// ========== 2. Injection SQL (concaténation directe) ==========
function getUserByEmail(email: string): string {
  return `SELECT * FROM users WHERE email = '${email}'`;
}

function deleteUser(userId: string): string {
  return `DELETE FROM users WHERE id = ${userId}`;
}

// ========== 3. Command injection (exécution de commande avec entrée utilisateur) ==========
function runBackup(path: string): void {
  // eslint-disable-next-line no-restricted-syntax
  const { execSync } = require('child_process');
  execSync(`tar -czf backup.tar.gz ${path}`);
}

// ========== 4. Désérialisation non sécurisée (eval / Function avec entrée) ==========
function parseUserInput(jsonString: string): unknown {
  return eval(`(${jsonString})`);
}

// ========== 5. Log de données sensibles ==========
function login(username: string, password: string): void {
  console.log('Login attempt:', { username, password });
}

// ========== 6. Regex ReDoS potentiel (pattern non borné) ==========
function validateEmail(email: string): boolean {
  const re = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;
  return re.test(email);
}

export {
  API_KEY,
  DB_PASSWORD,
  getUserByEmail,
  deleteUser,
  runBackup,
  parseUserInput,
  login,
  validateEmail,
};
