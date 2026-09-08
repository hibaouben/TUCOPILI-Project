import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = 'admin@tucopili.com';
  const adminPassword = 'Admin@12345';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Tucopili',
        role: 'ADMIN',
        position: null,
      },
    });
    console.log(`👑 Admin already exists: ${adminEmail}`);
    console.log('   ✓ Admin account updated');
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Tucopili',
        role: 'ADMIN',
        position: null,
      },
    });
    console.log(`👑 Admin created: ${adminEmail}`);
  }

  console.log('');

  const categories = [
    {
      name: 'Coffee',
      description: 'Coffee-based drinks',
      products: [
        ['Espresso', 'A rich and intense coffee served in a small cup', 15, 'espresso.png'],
        ['Double Espresso', 'A double shot of rich and intense espresso', 20, 'double espresso.png'],
        ['Americano', 'Espresso combined with hot water', 18, 'americano.png'],
        ['Cappuccino', 'Espresso with steamed milk and milk foam', 25, 'cappuchino.png'],
        ['Caffè Latte', 'Espresso with smooth steamed milk', 28, 'caffe latte.png'],
        ['Mocha', 'Espresso with chocolate and steamed milk', 30, 'mocha coffe.png'],
        ['Caramel Macchiato', 'Espresso with vanilla, steamed milk and caramel', 32, 'caramel ma.png'],
        ['Vanilla Latte', 'Espresso with steamed milk and vanilla flavor', 30, 'vanilla latte.png'],
        ['Iced Coffee', 'Cold coffee served over ice', 25, 'iced coffe.png'],
        ['Iced Latte', 'Cold espresso with milk served over ice', 30, 'iced latte.png'],
      ],
    },

    {
      name: 'Tea',
      description: 'Hot and refreshing tea drinks',
      products: [
        ['Green Tea', 'Refreshing green tea', 18, 'green tea.png'],
        ['Black Tea', 'Classic black tea', 15, 'blacktea.png'],
        ['Mint Tea', 'Traditional Moroccan mint tea', 20, 'moroccan tea.png'],
        ['Ginger Tea', 'Warm tea with fresh ginger', 20, 'gingertea.png'],
        ['Chamomile Tea', 'Relaxing chamomile tea', 18, 'chamomile tea.png'],
      ],
    },

    {
      name: 'Crepes',
      description: 'Sweet crepes with delicious toppings',
      products: [
        ['Classic Crepe', 'A soft crepe served with sugar', 25, 'crepe classic.png'],
        ['Chocolate Crepe', 'Crepe with chocolate sauce', 30, 'choclate crepe.png'],
        ['Nutella Crepe', 'Crepe filled with Nutella', 35, 'nutella.png'],
        ['Banana & Chocolate Crepe', 'Crepe with banana and chocolate', 40, 'banana choclate crepe.png'],
        ['Strawberry & Chocolate Crepe', 'Crepe with strawberries and chocolate', 42, 'strawberry crepe.png'],
        ['Lotus Biscoff Crepe', 'Crepe with Lotus Biscoff spread and biscuits', 40, 'biscoff.png'],
        ['Mixed Fruit Crepe', 'Crepe topped with fresh seasonal fruits', 45, 'mixed fruit crepe.png'],
      ],
    },

    {
      name: 'Waffles',
      description: 'Freshly prepared waffles with delicious toppings',
      products: [
        ['Classic Waffle', 'Fresh waffle served with sugar', 30, 'classique waffle.png'],
        ['Chocolate Waffle', 'Fresh waffle with chocolate sauce', 35, 'chocolate waffle.png'],
        ['Nutella Waffle', 'Waffle topped with Nutella', 40, 'nutella.png'],
        ['Banana & Chocolate Waffle', 'Waffle with banana and chocolate', 45, 'banana choclate waffle.png'],
        ['Strawberry Waffle', 'Waffle topped with fresh strawberries', 45, 'straberry waffle.png'],
        ['Lotus Biscoff Waffle', 'Waffle with Lotus Biscoff spread and biscuits', 45, 'lotus waffle.png'],
        ['Fruit Waffle', 'Waffle topped with fresh seasonal fruits', 48, 'fruit waffle.png'],
      ],
    },

    {
      name: 'Pastries',
      description: 'Fresh pastries and baked treats',
      products: [
        ['Croissant', 'Fresh buttery croissant', 15, 'croissant.png'],
        ['Chocolate Croissant', 'Buttery croissant filled with chocolate', 18, 'choclate croissant.png'],
        ['Almond Croissant', 'Croissant filled with almond cream', 22, 'amande croissant.png'],
        ['Muffin', 'Fresh homemade muffin', 18, 'muffin.png'],
        ['Chocolate Muffin', 'Soft chocolate muffin', 20, 'muffin.png'],
        ['Cinnamon Roll', 'Soft cinnamon roll with sweet glaze', 22, 'cinamon roll.png'],
      ],
    },

    {
      name: 'Cakes',
      description: 'Fresh cakes and homemade desserts',
      products: [
        ['Chocolate Cake', 'Rich chocolate cake', 30, 'choclate cake.png'],
        ['Cheesecake', 'Creamy cheesecake with a biscuit base', 35, 'cheese cake.png'],
        ['Carrot Cake', 'Moist carrot cake with cream frosting', 30, 'carrot cake.png'],
        ['Red Velvet Cake', 'Classic red velvet cake with cream cheese frosting', 35, 'red vevet cake.png'],
        ['Lemon Cake', 'Light cake with fresh lemon flavor', 28, 'lemon cake.png'],
      ],
    },

    {
      name: 'Cold Drinks',
      description: 'Refreshing cold beverages',
      products: [
        ['Iced Tea', 'Refreshing tea served over ice', 22, 'iced tea.png'],
        ['Iced Mocha', 'Cold coffee with chocolate and milk', 32, 'iced mocha.png'],
        ['Vanilla Milkshake', 'Creamy vanilla milkshake', 35, 'vanilla milkshake.png'],
        ['Chocolate Milkshake', 'Rich chocolate milkshake', 38, 'choclate milkashake.png'],
        ['Strawberry Milkshake', 'Fresh strawberry milkshake', 38, 'strawberry milkshake.png'],
      ],
    },

    {
      name: 'Fresh Juices',
      description: 'Freshly prepared natural juices',
      products: [
        ['Orange Juice', 'Freshly squeezed orange juice', 25, 'orange juice.png'],
        ['Lemonade', 'Fresh homemade lemonade', 22, 'lemonade.png'],
        ['Orange & Carrot Juice', 'Fresh orange and carrot juice blend', 28, 'orange and carrot juice.png'],
        ['Apple Juice', 'Fresh apple juice', 25, 'fresh apple.png'],
        ['Pineapple Juice', 'Fresh pineapple juice', 28, 'pineapple juice.png'],
      ],
    },

    {
      name: 'Smoothies',
      description: 'Fresh fruit smoothies',
      products: [
        ['Strawberry Smoothie', 'Creamy smoothie made with fresh strawberries', 35, 'strawberry smoothies.png'],
        ['Banana Smoothie', 'Smoothie made with fresh bananas', 32, 'banana smoothies.png'],
        ['Mango Smoothie', 'Fresh mango smoothie', 38, 'manga smoothies.png'],
        ['Mixed Berry Smoothie', 'Smoothie made with mixed berries', 40, 'mixte smoothies.png'],
        ['Tropical Smoothie', 'Blend of tropical fruits', 40, 'tropical smoothies.png'],
      ],
    },

    {
      name: 'Sandwiches',
      description: 'Freshly prepared sandwiches',
      products: [
        ['Chicken Sandwich', 'Grilled chicken with fresh vegetables', 40, 'chickensandwich.png'],
        ['Tuna Sandwich', 'Tuna with fresh vegetables and sauce', 38, 'tuna sandwich.png'],
        ['Turkey & Cheese Sandwich', 'Turkey and cheese with fresh vegetables', 42, 'turkey sandwich.png'],
        ['Grilled Cheese Sandwich', 'Grilled bread with melted cheese', 32, 'grilled sandwich.png'],
        ['Chicken Panini', 'Grilled chicken panini with cheese', 45, 'chicken panini.png'],
      ],
    },

    {
      name: 'Breakfast',
      description: 'Breakfast meals and morning favorites',
      products: [
        ['Classic Breakfast', 'Eggs, bread, cheese and fresh vegetables', 45, 'classic breakfast.png'],
        ['Egg & Cheese Toast', 'Toast with eggs and melted cheese', 35, 'egg breakfast.png'],
        ['Avocado Toast', 'Toasted bread with fresh avocado', 40, 'avocado toast.png'],
        ['Pancakes', 'Fluffy pancakes served with honey', 35, 'pancakes.png'],
      ],
    },

    {
      name: 'Desserts',
      description: 'Sweet desserts and treats',
      products: [
        ['Tiramisu', 'Classic Italian coffee-flavored dessert', 35, 'tiramisu.png'],
        ['Chocolate Brownie', 'Rich chocolate brownie', 28, 'brownie.png'],
        ['Chocolate Fondant', 'Warm chocolate cake with a melted center', 40, 'fondant.png'],
        ['Fruit Salad', 'Fresh seasonal fruit salad', 30, 'fruitsalade.png'],
      ],
    },
  ];

  for (const categoryData of categories) {
    let category = await prisma.category.findFirst({
      where: { name: categoryData.name },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
        },
      });
      console.log(`📁 Created category: ${category.name}`);
    } else {
      category = await prisma.category.update({
        where: { id: category.id },
        data: { description: categoryData.description },
      });
      console.log(`📁 Category already exists: ${category.name}`);
    }

    for (const [name, description, price, image] of categoryData.products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: name as string,
          categoryId: category.id,
        },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: name as string,
            description: description as string,
            price: price as number,
            image: image as string | null,
            available: true,
            categoryId: category.id,
          },
        });
        console.log(`   ✓ Product created: ${name}`);
      } else {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            description: description as string,
            price: price as number,
            image: image as string | null,
          },
        });
        console.log(`   ↻ Product updated: ${name}`);
      }
    }
  }

  console.log('');
  console.log('====================================');
  console.log('🌱 Seed completed successfully!');
  console.log('====================================');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });