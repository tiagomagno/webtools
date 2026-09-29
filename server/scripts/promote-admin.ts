// Promove um usuário existente a ADMIN. Rodar manualmente contra o banco de
// destino (dev ou produção) — não há rota HTTP pra isso de propósito.
// Uso: npm run promote-admin -- email@exemplo.com
import { prisma } from "../src/db.js";

const email = process.argv[2];
if (!email) {
  console.error("Uso: npm run promote-admin -- email@exemplo.com");
  process.exit(1);
}

const user = await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
console.log(`OK: ${user.email} agora é ADMIN.`);
await prisma.$disconnect();
