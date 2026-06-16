import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { BusinessCategorySchema } from './business-categories/schemas/business-category.schema';
import { toSlug } from './common/utils/slug.util';
import { PlanCode } from './common/enums/plan-code.enum';
import { SubscriptionPlanSchema } from './subscription-plans/schemas/subscription-plan.schema';

config();

const categories = [
  'Comida y restaurantes',
  'Repuestos y accesorios',
  'Importadores de carros',
  'Talleres mecánicos',
  'Polarizado y detailing',
  'PVC, vidrio y aluminio',
  'Herrería',
  'Belleza y citas',
  'Servicios profesionales',
  'Tecnología',
  'Tiendas',
];

const plans = [
  {
    code: PlanCode.Free,
    name: 'Free',
    price: 0,
    productLimit: 3,
    features: ['local básico', 'WhatsApp', 'ubicación'],
  },
  {
    code: PlanCode.Basic,
    name: 'Basic',
    price: 0,
    productLimit: 10,
    features: ['QR', 'ubicación', 'WhatsApp', '1 promoción futura'],
  },
  {
    code: PlanCode.Plus,
    name: 'Plus',
    price: 199,
    productLimit: 30,
    features: [
      'módulo adicional por nicho',
      'venta en vivo con historial',
      'estadísticas básicas',
      'QR y acciones para compartir',
    ],
  },
  {
    code: PlanCode.Pro,
    name: 'Pro',
    price: 349,
    productLimit: 100,
    features: [
      'módulos avanzados',
      'venta en vivo avanzada',
      'soporte prioritario',
      'catalogo ampliado',
    ],
  },
];

async function bootstrap() {
  const configService = new ConfigService();
  await mongoose.connect(
    configService.get<string>('MONGODB_URI') ||
      'mongodb://localhost:27017/mercadito_chimalteco',
  );

  const CategoryModel = mongoose.model(
    'BusinessCategory',
    BusinessCategorySchema,
  );
  const PlanModel = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

  for (const name of categories) {
    await CategoryModel.updateOne(
      { slug: toSlug(name) },
      {
        $setOnInsert: {
          name,
          slug: toSlug(name),
          active: true,
        },
      },
      { upsert: true },
    );
  }

  for (const plan of plans) {
    await PlanModel.updateOne(
      { code: plan.code },
      { $set: { ...plan, active: true } },
      { upsert: true },
    );
  }

  await mongoose.disconnect();
  console.log('Mercadito Chimalteco seed completed');
}

bootstrap().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
