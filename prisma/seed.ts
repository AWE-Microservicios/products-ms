import { PrismaClient } from "@prisma/client";
import * as fs from "fs"; 
import * as path from "path";

const prisma = new PrismaClient();  

async function main() {
  
  console.log("Iniciando seed... "); 
  const seedDataPath = path.join(__dirname, "seed.sql");
  const seedData = fs.readFileSync(seedDataPath, "utf-8");
  await prisma.product.deleteMany();
  console.log('🗑️ Tabla limpiada');
  
  const statements = seedData.split(";").map((stmt: string) => stmt.trim()).filter((stmt: string) => stmt.length > 0);
  console.log(`Ejecutando ${statements.length} inserciones...`);

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
      console.log(`Executed: ${statement}`);
    } catch (error) {
      console.error(`Error executing statement: ${statement}`, error);
    }
  }
  console.log("Seed completado exitosamente.");
} 

main()
  .catch((e) => {
    console.error("Error en el seed: ", e); })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seed finalizado."); 
  });