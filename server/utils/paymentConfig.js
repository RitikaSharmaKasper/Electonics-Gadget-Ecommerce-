// import env from "../config/env.js";
// import crypto from "crypto";

// const algorithm = "aes-256-cbc";
// const key = Buffer.from(env.PAYMENT_CONFIG_SECRET_KEY, "hex");

// export const encrypt = (text) => {
//   const iv = crypto.randomBytes(16);

//   const cipher = crypto.createCipheriv(algorithm, key, iv);

//   let encrypted = cipher.update(text, "utf8");
//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   return iv.toString("hex") + ":" + encrypted.toString("hex");
// };

// export const decrypt = (text) => {
//   if (!text || typeof text !== "string") {
//     return null;
//   }

//   const parts = text.split(":");

//   if (parts.length !== 2) {
//     throw new Error("Invalid encrypted format");
//   }

//   const [ivHex, encryptedHex] = parts;

//   const iv = Buffer.from(ivHex, "hex");
//   const encryptedText = Buffer.from(encryptedHex, "hex");

//   const decipher = crypto.createDecipheriv(algorithm, key, iv);

//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   return decrypted.toString("utf8");
// };
