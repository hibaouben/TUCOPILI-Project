import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
const email = "[admin@tucopili.ma](mailto:admin@tucopili.ma)";
const password = "TucopiliAdmin2026!";

const hashedPassword = await bcrypt.hash(password, 10);

const existingAdmin = await prisma.user.findUnique({
where: { email },
});

if (existingAdmin) {
await prisma.user.update({
where: { email },
data: {
password: hashedPassword,
role: "ADMIN",
firstName: "Admin",
lastName: "Tucopili",
},
});

console.log("Compte ADMIN mis à jour.");


} else {
await prisma.user.create({
data: {
email,
password: hashedPassword,
firstName: "Admin",
lastName: "Tucopili",
role: "ADMIN",
},
});


console.log("Compte ADMIN créé.");


}
}

main()
.catch((error) => {
console.error(error);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});
